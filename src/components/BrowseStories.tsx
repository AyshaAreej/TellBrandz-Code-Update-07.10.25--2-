import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import TellCardWithUserPhoto from './TellCardWithUserPhoto';

interface BrowseStoriesProps {
  showHeader?: boolean;
}
const BrowseStories: React.FC<BrowseStoriesProps> = ({ showHeader = true }) => {
  const [tells, setTells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real tells from the backend
  useEffect(() => {
    const fetchTells = async () => {
      try {
        // This would be replaced with actual API call
        setTells([]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tells:', error);
        setLoading(false);
      }
    };
    
    fetchTells();
  }, []);

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
            Discover real experiences from customers across Nigeria. Read authentic reviews, 
            complaints, and praise to make informed decisions about brands and services.
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
              <TellCardWithUserPhoto
                key={tell.id}
                tell={tell}
                onLike={(id) => console.log('Liked:', id)}
                onComment={(id, comment) => console.log('Comment:', id, comment)}
              />
            ))}
          </div>
        )}
      </div>
      {showHeader && <Footer />}
    </div>
  );
};

export default BrowseStories;