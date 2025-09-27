import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Search, Clock, Trash2, Download, FileText } from 'lucide-react';

interface SearchAnalytics {
  totalSearches: number;
  recentSearches: string[];
  popularSearches: { term: string; count: number }[];
  searchTrends: { date: string; count: number }[];
}

export const SearchAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    recentSearches: [],
    popularSearches: [],
    searchTrends: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const searchCounts = JSON.parse(localStorage.getItem('searchCounts') || '{}');
    
    // Calculate popular searches
    const popularSearches = Object.entries(searchCounts)
      .map(([term, count]) => ({ term, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate recent searches (last 10)
    const recentSearches = searches.slice(-10).reverse();

    // Calculate total searches
    const totalSearches = searches.length;

    // Mock search trends (in real app, this would come from backend)
    const searchTrends = [
      { date: '2024-01-01', count: 15 },
      { date: '2024-01-02', count: 23 },
      { date: '2024-01-03', count: 18 },
      { date: '2024-01-04', count: 31 },
      { date: '2024-01-05', count: 27 }
    ];

    setAnalytics({
      totalSearches,
      recentSearches,
      popularSearches,
      searchTrends
    });
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
    localStorage.removeItem('searchCounts');
    setAnalytics({
      totalSearches: 0,
      recentSearches: [],
      popularSearches: [],
      searchTrends: []
    });
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('searchHistory');
    loadAnalytics();
  };

  const exportToCSV = () => {
    const csvContent = [
      'Search Term,Count',
      ...analytics.popularSearches.map(s => `"${s.term}",${s.count}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search-analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(analytics, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search-analytics.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Analytics</h2>
        {analytics.totalSearches > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToJSON}>
              <FileText className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        )}
      </div>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold">{analytics.totalSearches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Popular Terms</p>
                <p className="text-2xl font-bold">{analytics.popularSearches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Recent Searches</p>
                <p className="text-2xl font-bold">{analytics.recentSearches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Searches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Popular Searches</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.popularSearches.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No search data available</p>
          ) : (
            <div className="space-y-2">
              {analytics.popularSearches.map((search, index) => (
                <div key={search.term} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <span className="font-medium">{search.term}</span>
                  </div>
                  <Badge variant="secondary">{search.count} searches</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Searches</span>
          </CardTitle>
          {analytics.recentSearches.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearRecentSearches}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {analytics.recentSearches.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent searches</p>
          ) : (
            <div className="space-y-2">
              {analytics.recentSearches.map((search, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>{search}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear All Data */}
      {(analytics.totalSearches > 0) && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Clear Search Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete all search history and analytics data.
            </p>
            <Button variant="destructive" onClick={clearSearchHistory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Search Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};