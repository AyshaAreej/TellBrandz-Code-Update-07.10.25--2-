import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function B2BDataAPIDemo() {
  const [apiKey, setApiKey] = useState('');
  const [brandDomain, setBrandDomain] = useState('');
  const [country, setCountry] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        brand_domain: brandDomain,
        ...(country && { location_country: country })
      });

      const res = await fetch(
        `https://pwjalknplkbxriaiimvr.supabase.co/functions/v1/b2b-data-api?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (error: any) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>B2B Data API Test Console</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>API Key</Label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="tb_xxxxxxxxxxxxx"
          />
        </div>

        <div>
          <Label>Brand Domain (Required)</Label>
          <Input
            value={brandDomain}
            onChange={(e) => setBrandDomain(e.target.value)}
            placeholder="example.com"
          />
        </div>

        <div>
          <Label>Country Filter (Optional)</Label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Nigeria"
          />
        </div>

        <Button onClick={testAPI} disabled={loading || !apiKey || !brandDomain}>
          {loading ? 'Testing...' : 'Test API'}
        </Button>

        {response && (
          <div className="mt-4">
            <Badge variant={response.error ? 'destructive' : 'default'}>
              {response.error ? 'Error' : 'Success'}
            </Badge>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-xs">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
