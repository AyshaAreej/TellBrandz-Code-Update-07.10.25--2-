import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function BrandAPIAccess({ brandId, tokenBalance }: { brandId: string; tokenBalance?: number }) {

  const [apiKey, setApiKey] = useState('');
  const [masked, setMasked] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPIKey();
  }, [brandId]);

  const fetchAPIKey = async () => {
    try {
      const { data, error } = await supabase
        .from('brand_api_keys')
        .select('*')
        .eq('brand_id', brandId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setApiKey(data.api_key);
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAPIKey = async () => {
    setLoading(true);
    try {
      const newKey = `tb_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase.from('brand_api_keys').insert({
        brand_id: brandId,
        api_key: newKey,
        key_name: 'Primary API Key'
      });

      if (error) throw error;
      setApiKey(newKey);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API key copied to clipboard!');
  };

  const displayKey = masked && apiKey ? `${apiKey.substring(0, 8)}${'*'.repeat(20)}` : apiKey;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>REST API Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge variant="secondary">Tier 2 Feature - B2B Data API</Badge>
          
          {apiKey ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={displayKey} readOnly />
                <Button size="icon" variant="outline" onClick={() => setMasked(!masked)}>
                  {masked ? <Eye /> : <EyeOff />}
                </Button>
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  <Copy />
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={generateAPIKey} disabled={loading}>
              Generate API Key
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Endpoint</h3>
            <code className="bg-gray-100 p-2 rounded block">
              GET https://pwjalknplkbxriaiimvr.supabase.co/functions/v1/b2b-data-api
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Authentication</h3>
            <code className="bg-gray-100 p-2 rounded block">
              Authorization: Bearer {apiKey || '[YOUR_API_KEY]'}
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Query Parameters</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>brand_domain</code> (required) - Your brand domain</li>
              <li><code>location_country</code> - Filter by country</li>
              <li><code>location_city</code> - Filter by city</li>
              <li><code>rating_min</code> - Minimum rating (1-5)</li>
              <li><code>rating_max</code> - Maximum rating (1-5)</li>
              <li><code>date_start</code> - Start date (YYYY-MM-DD)</li>
              <li><code>date_end</code> - End date (YYYY-MM-DD)</li>
              <li><code>limit</code> - Max records (default: 100, max: 500)</li>
              <li><code>offset</code> - Pagination offset</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Rate Limits</h3>
            <p className="text-sm text-muted-foreground">500 requests per minute</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

