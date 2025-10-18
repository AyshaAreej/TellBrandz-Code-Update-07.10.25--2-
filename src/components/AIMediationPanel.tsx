import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AIMediationPanelProps {
  tellId: string;
  tellText: string;
  brandName: string;
  customerName?: string;
  onResponseSent?: () => void;
}

export function AIMediationPanel({ 
  tellId, 
  tellText, 
  brandName, 
  customerName,
  onResponseSent 
}: AIMediationPanelProps) {
  const [suggestedResponse, setSuggestedResponse] = useState('');
  const [editedResponse, setEditedResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const generateSuggestion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-suggested-response', {
        body: { tellText, brandName, customerName }
      });

      if (error) throw error;
      
      setSuggestedResponse(data.suggestedResponse);
      setEditedResponse(data.suggestedResponse);
    } catch (error) {
      console.error('Failed to generate suggestion:', error);
      alert('Failed to generate AI suggestion');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedResponse);
    alert('Response copied to clipboard!');
  };

  const sendResponse = async () => {
    setSending(true);
    try {
      // Here you would integrate with your messaging system
      // For now, we'll just update the tell with a response
      const { error } = await supabase
        .from('tells')
        .update({ 
          brand_response: editedResponse,
          responded_at: new Date().toISOString()
        })
        .eq('id', tellId);

      if (error) throw error;
      
      alert('Response sent successfully!');
      onResponseSent?.();
    } catch (error) {
      console.error('Failed to send response:', error);
      alert('Failed to send response');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Response Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Customer Tell:</h4>
          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
            {tellText}
          </p>
        </div>

        {!suggestedResponse ? (
          <Button 
            onClick={generateSuggestion} 
            disabled={loading}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate AI Suggestion'}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Draft Suggestion (Review & Edit Required)
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            <Textarea

              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              rows={6}
              placeholder="Edit the suggested response..."
              className="resize-none"
            />

            <div className="flex gap-2">
              <Button 
                onClick={sendResponse} 
                disabled={sending || !editedResponse}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Response'}
              </Button>
              <Button 
                variant="outline" 
                onClick={generateSuggestion}
                disabled={loading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          💡 Tip: AI suggestions are generated using Gemini 2.0. Always review before sending.
        </div>
      </CardContent>
    </Card>
  );
}
