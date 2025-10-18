import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface ResolutionProps {
  tellId: string;
  brandId: string;
  repId: string;
}

export function BrandResolutionWorkflow({ tellId, brandId, repId }: ResolutionProps) {
  const [tokenMode, setTokenMode] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    setLoading(true);
    try {
      if (tokenMode) {
        // Token-based resolution (BrandBeat conversion)
        const { error } = await supabase.functions.invoke('resolution-management', {
          body: {
            action: 'convertToBrandBeat',
            tellId,
            brandId,
            repId,
            tokenCost: 50
          }
        });
        if (error) throw error;
        alert('BrandBeat conversion successful! 50 tokens deducted.');
      } else {
        // Free resolution
        const { error } = await supabase.functions.invoke('resolution-management', {
          body: {
            action: 'sendMessage',
            tellId,
            message,
            repId
          }
        });
        if (error) throw error;
        alert('Message sent successfully!');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resolution Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="token-mode">Token Resolution Mode</Label>
          <Switch
            id="token-mode"
            checked={tokenMode}
            onCheckedChange={setTokenMode}
          />
        </div>

        {tokenMode ? (
          <div className="space-y-3">
            <Badge variant="secondary">Cost: 50 Tokens</Badge>
            <p className="text-sm text-muted-foreground">
              Convert this BrandBlast to a BrandBeat (resolved status) and remove from public feed.
            </p>
            <Button onClick={handleResolve} disabled={loading} className="w-full">
              Propose BrandBeat Conversion
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Type your response to the customer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <Button onClick={handleResolve} disabled={loading || !message} className="w-full">
              Send Message
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
