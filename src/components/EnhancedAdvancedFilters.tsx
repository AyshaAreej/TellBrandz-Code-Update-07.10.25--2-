import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface FilterState {
  searchTerm: string;
  status: string;
  emotionalTone: string[];
  operationalTags: string[];
  ratingRange: { min: number; max: number };
  tokenBalanceRange: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  location: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface EnhancedAdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const EnhancedAdvancedFilters: React.FC<EnhancedAdvancedFiltersProps> = ({
  onFilterChange,
  onReset,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: '',
    emotionalTone: [],
    operationalTags: [],
    ratingRange: { min: 1, max: 5 },
    tokenBalanceRange: { min: 0, max: 10000 },
    dateRange: { start: null, end: null },
    location: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const emotionalTones = ['Anger', 'Frustration', 'Joy', 'Neutral', 'Disappointment', 'Delight'];
  const operationalTags = [
    'Product Defect',
    'Service Delay',
    'Billing Error',
    'Staff Friendliness',
    'Platform Usability',
    'General Compliment',
    'Shipping Issue',
    'Quality Concern',
    'Other',
  ];

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      status: '',
      emotionalTone: [],
      operationalTags: [],
      ratingRange: { min: 1, max: 5 },
      tokenBalanceRange: { min: 0, max: 10000 },
      dateRange: { start: null, end: null },
      location: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
    onReset();
  };

  const toggleEmotionalTone = (tone: string) => {
    setFilters((prev) => ({
      ...prev,
      emotionalTone: prev.emotionalTone.includes(tone)
        ? prev.emotionalTone.filter((t) => t !== tone)
        : [...prev.emotionalTone, tone],
    }));
  };

  const toggleOperationalTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      operationalTags: prev.operationalTags.includes(tag)
        ? prev.operationalTags.filter((t) => t !== tag)
        : [...prev.operationalTags, tag],
    }));
  };

  const activeFilterCount =
    (filters.searchTerm ? 1 : 0) +
    (filters.status ? 1 : 0) +
    filters.emotionalTone.length +
    filters.operationalTags.length +
    (filters.location ? 1 : 0) +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Search</Label>
            <Input
              placeholder="Search tells..."
              value={filters.searchTerm}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="brandbeat">BrandBeat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Location</Label>
            <Input
              placeholder="City or country..."
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        {showAdvanced && (
          <>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Emotional Tone
              </Label>
              <div className="flex flex-wrap gap-2">
                {emotionalTones.map((tone) => (
                  <Badge
                    key={tone}
                    variant={filters.emotionalTone.includes(tone) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleEmotionalTone(tone)}
                  >
                    {tone}
                    {filters.emotionalTone.includes(tone) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Operational Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {operationalTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.operationalTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleOperationalTag(tag)}
                  >
                    {tag}
                    {filters.operationalTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.start ? format(filters.dateRange.start, 'PP') : 'Start'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.start || undefined}
                        onSelect={(date) => setFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, start: date || null } }))}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.end ? format(filters.dateRange.end, 'PP') : 'End'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.end || undefined}
                        onSelect={(date) => setFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, end: date || null } }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};