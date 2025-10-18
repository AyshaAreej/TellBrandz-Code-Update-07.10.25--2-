import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandExecutiveSummary } from './BrandExecutiveSummary';
import { BrandTriageFeed } from './BrandTriageFeed';
import { BrandAPIAccess } from './BrandAPIAccess';
import GeographicHeatmap from './GeographicHeatmap';
import TokenPurchaseModal from './TokenPurchaseModal';
import { AdvancedAnalyticsDashboard } from './AdvancedAnalyticsDashboard';
import { RealTimeNotificationSystem } from './RealTimeNotificationSystem';
import { HistoricAnalysisReports } from './HistoricAnalysisReports';
import { TokenWalletTransactionLog } from './TokenWalletTransactionLog';
import { EmailNotificationPreferences } from './EmailNotificationPreferences';
import { MultiBrandSwitcher } from './MultiBrandSwitcher';
import { AutomatedEmailTriggers } from './AutomatedEmailTriggers';
import { MultiBrandAnalyticsComparison } from './MultiBrandAnalyticsComparison';
import RealTimeDashboardUpdates from './RealTimeDashboardUpdates';
import AnalyticsExport from './AnalyticsExport';
import AdvancedAIInsights from './AdvancedAIInsights';
import WebhookIntegration from './WebhookIntegration';
import SentimentTrendForecasting from './SentimentTrendForecasting';
import SentimentAlertManager from './SentimentAlertManager';



import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';


export function BrandDashboardEnhanced() {
  const [brandId, setBrandId] = useState<string>('');
  const [brandName, setBrandName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [showTokenPurchase, setShowTokenPurchase] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadBrandData();
  }, []);

  const loadBrandData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: rep } = await supabase
        .from('brand_representatives')
        .select('brand_id')
        .eq('user_id', user.id)
        .single();

      if (rep) {
        setBrandId(rep.brand_id);
        const { data: brand } = await supabase.from('brands').select('token_balance, name').eq('id', rep.brand_id).single();
        setTokenBalance(brand?.token_balance || 0);
        setBrandName(brand?.name || '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleBrandChange = async (newBrandId: string) => {
    setBrandId(newBrandId);
    const { data: brand } = await supabase.from('brands').select('token_balance').eq('id', newBrandId).single();
    setTokenBalance(brand?.token_balance || 0);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!brandId) return <div className="p-8"><Card><CardContent className="p-6">No brand access</CardContent></Card></div>;

  return (
    <div className="p-8 space-y-6">
      <Alert><Sparkles className="h-4 w-4" /><AlertDescription>AI-powered analytics</AlertDescription></Alert>
      <div className="flex justify-between items-center">
        <MultiBrandSwitcher currentBrandId={brandId} onBrandChange={handleBrandChange} userId={userId} />
        <div className="flex gap-3">
          <RealTimeNotificationSystem brandId={brandId} />
          <Badge variant="secondary"><Coins className="h-4 w-4 mr-2" />{tokenBalance} Tokens</Badge>
          <Button onClick={() => setShowTokenPurchase(true)} size="sm">Buy Tokens</Button>
        </div>
      </div>
      <BrandExecutiveSummary brandId={brandId} />
      <Tabs defaultValue="triage">
        <TabsList>
          <TabsTrigger value="triage">Triage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="comparison">Multi-Brand</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="triage"><BrandTriageFeed brandId={brandId} tokenBalance={tokenBalance} onTokenDeduct={(amt) => setTokenBalance(prev => prev - amt)} /></TabsContent>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <AdvancedAIInsights brandId={brandId} />
            </div>
            <div className="space-y-6">
              <RealTimeDashboardUpdates brandId={brandId} />
              <AnalyticsExport brandId={brandId} brandName={brandName} />
            </div>
          </div>
          <div className="space-y-6">
            <SentimentTrendForecasting brandId={brandId} />
            <AdvancedAnalyticsDashboard brandId={brandId} />
            <GeographicHeatmap brandId={brandId} />
          </div>
        </TabsContent>


        <TabsContent value="comparison"><MultiBrandAnalyticsComparison /></TabsContent>
        <TabsContent value="reports"><HistoricAnalysisReports brandId={brandId} tokenBalance={tokenBalance} onTokenDeduct={(amt) => setTokenBalance(prev => prev - amt)} /></TabsContent>
        <TabsContent value="wallet"><TokenWalletTransactionLog brandId={brandId} /></TabsContent>
        <TabsContent value="settings">
          <div className="space-y-6">
            <SentimentAlertManager />
            <EmailNotificationPreferences brandId={brandId} />
            <AutomatedEmailTriggers />
            <WebhookIntegration brandId={brandId} />
          </div>
        </TabsContent>


        <TabsContent value="api"><BrandAPIAccess brandId={brandId} tokenBalance={tokenBalance} /></TabsContent>
      </Tabs>

      <TokenPurchaseModal open={showTokenPurchase} onClose={() => setShowTokenPurchase(false)} brandId={brandId} onSuccess={loadBrandData} />
    </div>
  );
}