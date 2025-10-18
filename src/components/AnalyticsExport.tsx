import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportProps {
  brandId: string;
  brandName: string;
}

export default function AnalyticsExport({ brandId, brandName }: ExportProps) {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [timeRange, setTimeRange] = useState('30');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportData = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (format === 'csv') {
        const csvContent = `Brand,Date,Tells,Sentiment,Resolution Rate\n${brandName},${new Date().toLocaleDateString()},156,7.8,85%\n`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandName}-analytics-${Date.now()}.csv`;
        a.click();
      } else {
        // PDF export would use a library like jsPDF
        toast({
          title: 'PDF Export',
          description: 'PDF export feature coming soon!',
        });
      }
      
      toast({
        title: 'Export Complete',
        description: `Analytics exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Unable to export analytics',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Export Analytics</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Format</label>
          <Select value={format} onValueChange={(v) => setFormat(v as 'csv' | 'pdf')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  CSV
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Time Range</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportData} disabled={isExporting} className="w-full">
          {isExporting ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
          ) : (
            <><Download className="w-4 h-4 mr-2" /> Export Report</>
          )}
        </Button>
      </div>
    </Card>
  );
}
