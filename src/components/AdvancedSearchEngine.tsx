import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TellCard } from './TellCard';
import SavedSearchManager from './SavedSearchManager';
import { toast } from 'sonner';



interface SearchFilter {
  field: string;
  operator: string;
  value: string;
}

export default function AdvancedSearchEngine() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');



  const fields = [
    { value: 'brand', label: 'Brand' },
    { value: 'sentiment', label: 'Sentiment' },
    { value: 'status', label: 'Status' },
    { value: 'date', label: 'Date' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater', label: 'Greater Than' },
    { value: 'less', label: 'Less Than' }
  ];

  const addFilter = () => {
    setFilters([...filters, { field: 'brand', operator: 'contains', value: '' }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, key: string, value: string) => {
    const updated = [...filters];
    updated[index] = { ...updated[index], [key]: value };
    setFilters(updated);
  };

  const executeSearch = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('advanced-search', {
      body: { query, filters }
    });
    if (!error && data?.results) {
      setResults(data.results);
    }
    setLoading(false);
  };

  const saveSearch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          name: searchName,
          search_config: { query, filters }
        });

      if (error) throw error;
      toast.success('Search saved successfully');
      setShowSaveDialog(false);
      setSearchName('');
    } catch (error: any) {
      toast.error('Failed to save search');
    }
  };

  const loadSearch = (config: any) => {
    setQuery(config.query || '');
    setFilters(config.filters || []);
  };




  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Advanced Search Engine
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(!showSaveDialog)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showSaveDialog && (
                <div className="flex gap-2 p-3 border rounded-lg bg-accent">
                  <Input
                    placeholder="Search name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={saveSearch}>Save</Button>
                  <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                </div>
              )}

              <div className="flex gap-2">
                <Input placeholder="Search tells, brands, keywords..." value={query} 
                  onChange={(e) => setQuery(e.target.value)} className="flex-1" />
                <Button onClick={executeSearch} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />Search
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Advanced Filters</span>
                  <Button size="sm" variant="outline" onClick={addFilter}>
                    <Filter className="w-4 h-4 mr-2" />Add Filter
                  </Button>
                </div>
                {filters.map((filter, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Select value={filter.field} onValueChange={(v) => updateFilter(index, 'field', v)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>{fields.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={filter.operator} onValueChange={(v) => updateFilter(index, 'operator', v)}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>{operators.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input placeholder="Value" value={filter.value} onChange={(e) => updateFilter(index, 'value', e.target.value)} className="flex-1" />
                    <Button size="icon" variant="ghost" onClick={() => removeFilter(index)}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold">Search Results ({results.length})</h3>
              {results.map(tell => <TellCard key={tell.id} tell={tell} />)}
            </div>
          )}
        </div>

        <div>
          <SavedSearchManager onLoadSearch={loadSearch} />
        </div>
      </div>
    </div>
  );
}
