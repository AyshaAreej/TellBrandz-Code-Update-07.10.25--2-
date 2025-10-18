import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Star, Trash2, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FilterPreset {
  id: string;
  name: string;
  filters: {
    status?: string;
    sentiment?: string;
    dateRange?: string;
    location?: string;
    operationalTags?: string[];
  };
  isDefault: boolean;
  createdAt: Date;
}

interface AdvancedFilterPresetsProps {
  currentFilters: any;
  onApplyPreset: (filters: any) => void;
}

export const AdvancedFilterPresets: React.FC<AdvancedFilterPresetsProps> = ({ 
  currentFilters, 
  onApplyPreset 
}) => {
  const { toast } = useToast();
  const [presets, setPresets] = useState<FilterPreset[]>([
    {
      id: '1',
      name: 'Crisis Mode',
      filters: { status: 'unresolved', sentiment: 'negative', dateRange: 'last_24h' },
      isDefault: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'This Week Resolved',
      filters: { status: 'resolved', dateRange: 'last_7d' },
      isDefault: false,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'High Priority',
      filters: { sentiment: 'negative', operationalTags: ['urgent', 'escalation'] },
      isDefault: false,
      createdAt: new Date()
    }
  ]);
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const saveCurrentFilters = () => {
    if (!newPresetName.trim()) {
      toast({ title: 'Please enter a preset name', variant: 'destructive' });
      return;
    }

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      filters: currentFilters,
      isDefault: false,
      createdAt: new Date()
    };

    setPresets([...presets, newPreset]);
    setNewPresetName('');
    setShowSaveDialog(false);
    toast({ title: 'Filter preset saved successfully' });
  };

  const applyPreset = (preset: FilterPreset) => {
    onApplyPreset(preset.filters);
    toast({ title: `Applied preset: ${preset.name}` });
  };

  const deletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
    toast({ title: 'Preset deleted' });
  };

  const toggleDefault = (id: string) => {
    setPresets(presets.map(p => ({
      ...p,
      isDefault: p.id === id ? !p.isDefault : p.isDefault
    })));
  };

  const getFilterSummary = (filters: any) => {
    const parts = [];
    if (filters.status) parts.push(filters.status);
    if (filters.sentiment) parts.push(filters.sentiment);
    if (filters.dateRange) parts.push(filters.dateRange);
    if (filters.location) parts.push(filters.location);
    if (filters.operationalTags?.length) parts.push(`${filters.operationalTags.length} tags`);
    return parts.join(' • ') || 'No filters';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-orange-600" />
            <CardTitle>Filter Presets</CardTitle>
          </div>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Filter Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Input
                    placeholder="Preset name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Current filters: {getFilterSummary(currentFilters)}
                </div>
                <Button onClick={saveCurrentFilters} className="w-full">
                  Save Preset
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {presets.map(preset => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{preset.name}</span>
                  {preset.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {getFilterSummary(preset.filters)}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleDefault(preset.id)}
                >
                  <Star className={`h-4 w-4 ${preset.isDefault ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(preset)}
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deletePreset(preset.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
