import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation as useCountryLocation } from '@/hooks/useLocation';
import { MessageSquare, Plus } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import TellCardWithUserPhoto from './TellCardWithUserPhoto';
import { supabase } from '@/lib/supabase';

interface BrowseStoriesProps {
  showHeader?: boolean;
}

const BrowseStories: React.FC<BrowseStoriesProps> = ({ showHeader = true }) => {
  const [tells, setTells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const location = useRouterLocation();
  const { selectedCountry } = useCountryLocation();
  const tellRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Get navigation state
  const { highlightTellId, scrollToTell, openComments } = location.state || {};

  // Fetch real tells from the backend (initial page)
  useEffect(() => {
    const fetchTells = async () => {
      try {
        setLoading(true);
        
        // Fetch tells data
        let tellsQuery = supabase
          .from('tells')
          .select(`
            id,
            title,
            content,
            status,
            created_at,
            tell_type,
            user_id,
            country,
            brand_name,image_url,evidence_urls
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (selectedCountry && selectedCountry !== 'GLOBAL') {
          tellsQuery = tellsQuery.eq('country', selectedCountry);
        }

        const { data, error } = await tellsQuery;

        if (error) throw error;

        // Fetch users data
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, full_name');

        if (usersError) throw usersError;

        // Map user name to tells
        const tellsWithUser = (data || []).map((tell) => {
          const user = (usersData || []).find((u) => u.id === tell.user_id);

          return {
            ...tell,
            user_name: user ? user.full_name : 'Unknown User',
          };
        });

        // Fetch brand counts (BrandBlasts and BrandBeats counts)
        const brandCounts: { [brandName: string]: { brandBlasts: number; brandBeats: number } } = {};

        tellsWithUser.forEach((tell) => {
          const brandName = tell.brand_name;

          if (!brandCounts[brandName]) {
            brandCounts[brandName] = { brandBlasts: 0, brandBeats: 0 };
          }

          if (tell.tell_type === 'BrandBlast') {
            brandCounts[brandName].brandBlasts += 1;
          } else if (tell.tell_type === 'BrandBeat') {
            brandCounts[brandName].brandBeats += 1;
          }
        });

        // Map counts to tells
        const tellsWithCounts = tellsWithUser.map((tell) => {
          const brandCountsForThisTell = brandCounts[tell.brand_name];

          return {
            ...tell,
            brandBlastsCount: brandCountsForThisTell?.brandBlasts || 0,
            brandBeatsCount: brandCountsForThisTell?.brandBeats || 0,
          };
        });

        setTells(tellsWithCounts);
        if (tellsWithCounts.length > 0) {
          const last = tellsWithCounts[tellsWithCounts.length - 1];
          setLastCreatedAt(last.created_at);
          setHasMore(tellsWithCounts.length === 10);
        } else {
          setLastCreatedAt(null);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching tells for homepage:', err);
        setTells([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTells();
  }, [selectedCountry]);

  // Fetch next page (older tells) and append
  const fetchMore = async () => {
    if (isLoadingMore || !hasMore || !lastCreatedAt) return;
    try {
      setIsLoadingMore(true);

      let tellsQuery = supabase
        .from('tells')
        .select(`
          id,
          title,
          content,
          status,
          created_at,
          tell_type,
          user_id,
          country,
          brand_name,image_url,evidence_urls
        `)
        .lt('created_at', lastCreatedAt)
        .order('created_at', { ascending: false })
        .limit(10);

      if (selectedCountry && selectedCountry !== 'GLOBAL') {
        tellsQuery = tellsQuery.eq('country', selectedCountry);
      }

      const { data, error } = await tellsQuery;
      if (error) throw error;

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name');
      if (usersError) throw usersError;

      const tellsWithUser = (data || []).map((tell) => {
        const user = (usersData || []).find((u) => u.id === tell.user_id);
        return {
          ...tell,
          user_name: user ? user.full_name : 'Unknown User',
        };
      });

      const appended = tellsWithUser.map((tell) => ({
        ...tell,
        brandBlastsCount: 0,
        brandBeatsCount: 0,
      }));

      setTells((prev) => [...prev, ...appended]);

      if (tellsWithUser.length > 0) {
        const last = tellsWithUser[tellsWithUser.length - 1];
        setLastCreatedAt(last.created_at);
        setHasMore(tellsWithUser.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching more tells:', err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle scrolling to specific tell after data loads
  useEffect(() => {
    if (!loading && scrollToTell && highlightTellId && tellRefs.current[highlightTellId]) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        const element = tellRefs.current[highlightTellId];
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Add highlight effect
          element.style.transition = 'all 0.3s ease';
          element.style.backgroundColor = '#fef3c7'; // yellow-100
          element.style.borderColor = '#f59e0b'; // yellow-500
          element.style.borderWidth = '2px';
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.borderColor = '';
            element.style.borderWidth = '';
          }, 3000);
        }
      }, 100);
    }
  }, [loading, scrollToTell, highlightTellId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {showHeader && <Header />}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading stories...</div>
        </div>
        {showHeader && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header />}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Brand Stories</h1>
          <p className="text-gray-600 max-w-2xl">
           Discover real experiences from customers across multiple brands around the world. Read authentic reviews, complaints, and praise to make informed decisions about brands and services.
          </p>
        </div>

        {tells.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <MessageSquare className="h-20 w-20 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Stories Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to share your brand experience and help build a community of informed consumers. 
              Your voice can make a difference!
            </p>
            <div className="space-y-4">
              <Link to="/create-tell">
                <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold px-8 py-3 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Share Your First Story
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Help others by sharing your experiences with brands and services
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tells.map((tell) => (
              <div
                key={tell.id}
                ref={(el) => tellRefs.current[tell.id] = el}
                className="rounded-lg border border-gray-200"
              >
                <TellCardWithUserPhoto
                  tell={tell}
                  shouldOpenComments={highlightTellId === tell.id && openComments}
                />
              </div>
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  className="px-8 py-3"
                  onClick={fetchMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading...' : 'Load more'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {showHeader && <Footer />}
    </div>
  );
};

export default BrowseStories;