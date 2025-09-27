import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface AdvancedFiltersProps {
  table: 'users' | 'tells' | 'brands';
  onResults: (results: any[]) => void;
  adminId: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  table,
  onResults,
  adminId
}) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    dateRange: { start: null as Date | null, end: null as Date | null },
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
    limit: 50
  });
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: {
          action: 'advanced_filter',
          filters: {
            table,
            ...filters,
            dateRange: filters.dateRange.start && filters.dateRange.end ? {
              start: filters.dateRange.start.toISOString(),
              end: filters.dateRange.end.toISOString()
            } : null
          },
          adminId
        }
      });

      if (error) throw error;
      onResults(data.data || []);
    } catch (error) {
      console.error('Filter error:', error);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      status: '',
      dateRange: { start: null, end: null },
      sortBy: 'created_at',
      sortOrder: 'desc',
      limit: 50
    });
  };

  const statusOptions = {
    users: [
      { value: 'active', label: 'Active' },
      { value: 'suspended', label: 'Suspended' }
    ],
    tells: [
      { value: 'pending', label: 'Pending' },
      { value: 'resolved', label: 'Resolved' },
      { value: 'rejected', label: 'Rejected' }
    ],
    brands: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended' }
    ]
  };

  const sortOptions = {
    users: [
      { value: 'created_at', label: 'Date Created' },
      { value: 'full_name', label: 'Name' },
      { value: 'email', label: 'Email' }
    ],
    tells: [
      { value: 'created_at', label: 'Date Created' },
      { value: 'title', label: 'Title' },
      { value: 'status', label: 'Status' }
    ],
    brands: [
      { value: 'created_at', label: 'Date Created' },
      { value: 'name', label: 'Name' },
      { value: 'status', label: 'Status' }
    ]
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder={`Search ${table}...`}
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {statusOptions[table].map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions[table].map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort Order</Label>
            <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => setFilters(prev => ({ ...prev, sortOrder: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Limit</Label>
            <Select value={filters.limit.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, limit: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 results</SelectItem>
                <SelectItem value="50">50 results</SelectItem>
                <SelectItem value="100">100 results</SelectItem>
                <SelectItem value="200">200 results</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.start ? format(filters.dateRange.start, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.start}
                  onSelect={(date) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: date } }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.end ? format(filters.dateRange.end, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.end}
                  onSelect={(date) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: date } }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleFilter} disabled={loading}>
            {loading ? 'Filtering...' : 'Apply Filters'}
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};