import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Brand {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  logo: string;
  location: string;
  established: number;
  satisfaction: number;
}

interface BrandExportProps {
  brands: Brand[];
  selectedBrands?: number[];
  onClose?: () => void;
}

export const BrandExport: React.FC<BrandExportProps> = ({
  brands,
  selectedBrands = [],
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'name', 'category', 'rating', 'reviews', 'location'
  ]);
  const [includeAll, setIncludeAll] = useState(selectedBrands.length === 0);

  const availableFields = [
    { key: 'name', label: 'Brand Name' },
    { key: 'category', label: 'Category' },
    { key: 'rating', label: 'Rating' },
    { key: 'reviews', label: 'Review Count' },
    { key: 'location', label: 'Location' },
    { key: 'established', label: 'Year Established' },
    { key: 'satisfaction', label: 'Satisfaction %' }
  ];

  const exportData = includeAll ? brands : brands.filter(b => selectedBrands.includes(b.id));

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldKey) 
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const generateCSV = () => {
    const headers = selectedFields.map(field => 
      availableFields.find(f => f.key === field)?.label || field
    );
    
    const rows = exportData.map(brand => 
      selectedFields.map(field => brand[field as keyof Brand])
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  };

  const generateJSON = () => {
    const filteredData = exportData.map(brand => {
      const filtered: any = {};
      selectedFields.forEach(field => {
        filtered[field] = brand[field as keyof Brand];
      });
      return filtered;
    });

    return JSON.stringify(filteredData, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (exportFormat) {
      case 'csv':
        downloadFile(
          generateCSV(),
          `brand-directory-${timestamp}.csv`,
          'text/csv'
        );
        break;
      case 'json':
        downloadFile(
          generateJSON(),
          `brand-directory-${timestamp}.json`,
          'application/json'
        );
        break;
      case 'pdf':
        // For PDF, we'll use a simple text format for now
        const textContent = exportData.map(brand => {
          const fields = selectedFields.map(field => 
            `${availableFields.find(f => f.key === field)?.label}: ${brand[field as keyof Brand]}`
          ).join('\n');
          return `${brand.name}\n${fields}\n${'='.repeat(40)}`;
        }).join('\n\n');
        
        downloadFile(
          textContent,
          `brand-directory-${timestamp}.txt`,
          'text/plain'
        );
        break;
    }
    
    onClose?.();
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return <Table className="h-4 w-4" />;
      case 'json': return <FileText className="h-4 w-4" />;
      case 'pdf': return <FileSpreadsheet className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <Download className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Export Brand Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">Export Format</label>
          <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center space-x-2">
                  <Table className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">CSV (Excel compatible)</span>
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center space-x-2">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">JSON (Developer friendly)</span>
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Text (Simple format)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">Data Selection</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={includeAll}
                onCheckedChange={setIncludeAll}
              />
              <span className="text-xs sm:text-sm">Export all brands ({brands.length})</span>
            </div>
            {!includeAll && (
              <Badge variant="secondary" className="text-xs">
                Selected: {selectedBrands.length} brands
              </Badge>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs sm:text-sm font-medium mb-2 block">Fields to Include</label>
          <div className="space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
            {availableFields.map(field => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedFields.includes(field.key)}
                  onCheckedChange={() => handleFieldToggle(field.key)}
                />
                <span className="text-xs sm:text-sm">{field.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              onClick={handleExport}
              disabled={selectedFields.length === 0 || exportData.length === 0}
              className="flex-1 text-xs sm:text-sm"
              size="sm"
            >
              {getFormatIcon(exportFormat)}
              <span className="ml-2">Export ({exportData.length})</span>
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="text-xs sm:text-sm" size="sm">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};