import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';

interface SavedSearch {
  id: string;
  name: string;
  description: string;
  search_config: any;
  is_favorite: boolean;
  created_at: string;
  last_used_at: string;
}

export default function SavedSearchManager({ onLoadSearch }: { onLoadSearch: (config: any) => void }) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('is_favorite', { ascending: false })
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      setSearches(data || []);
    } catch (error: any) {
      toast.error('Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ is_favorite: !isFavorite })
        .eq('id', id);

      if (error) throw error;
      loadSavedSearches();
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error: any) {
      toast.error('Failed to update favorite');
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSavedSearches();
      toast.success('Search deleted');
    } catch (error: any) {
      toast.error('Failed to delete search');
    }
  };

  const loadSearch = async (search: SavedSearch) => {
    try {
      await supabase
        .from('saved_searches')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', search.id);

      onLoadSearch(search.search_config);
      toast.success(`Loaded search: ${search.name}`);
    } catch (error: any) {
      toast.error('Failed to load search');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Saved Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : searches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved searches yet</p>
        ) : (
          <div className="space-y-2">
            {searches.map((search) => (
              <div key={search.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{search.name}</h4>
                    {search.is_favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                  </div>
                  {search.description && (
                    <p className="text-sm text-muted-foreground">{search.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleFavorite(search.id, search.is_favorite)}>
                    <Star className={`h-4 w-4 ${search.is_favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => loadSearch(search)}>
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteSearch(search.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
