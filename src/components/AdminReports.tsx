import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Users, AlertCircle, Download, Calendar } from 'lucide-react';

interface ReportData {
  moderationActivity: any[];
  userEngagement: any[];
  contentTrends: any[];
  escalationMetrics: any[];
}

export const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    moderationActivity: [],
    userEngagement: [],
    contentTrends: [],
    escalationMetrics: []
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [timeRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'get_admin_reports',
          timeRange
        }
      });
      if (data?.reports) {
        setReportData(data.reports);
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-management', {
        body: { 
          action: 'export_report',
          reportType,
          timeRange
        }
      });
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
          {change}% from last period
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Advanced Reports</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => exportReport('all')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Moderations"
          value="1,234"
          change="+12.5"
          icon={AlertCircle}
          trend="up"
        />
        <MetricCard
          title="Active Users"
          value="8,567"
          change="+8.2"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Content Flagged"
          value="89"
          change="-15.3"
          icon={AlertCircle}
          trend="down"
        />
        <MetricCard
          title="Response Time"
          value="2.4h"
          change="-22.1"
          icon={Calendar}
          trend="down"
        />
      </div>

      <Tabs defaultValue="moderation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="moderation">Moderation Activity</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="trends">Content Trends</TabsTrigger>
          <TabsTrigger value="escalations">Escalations</TabsTrigger>
        </TabsList>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Activity Overview</CardTitle>
              <CardDescription>
                Daily moderation actions and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.moderationActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{item.action}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.count}</div>
                      <Badge variant={item.trend === 'up' ? 'default' : 'secondary'}>
                        {item.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>
                User activity and engagement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Daily Active Users</h4>
                  <div className="text-2xl font-bold">12,456</div>
                  <div className="text-sm text-green-600">+5.2% from yesterday</div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Average Session Time</h4>
                  <div className="text-2xl font-bold">8m 32s</div>
                  <div className="text-sm text-green-600">+12% from last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Trends Analysis</CardTitle>
              <CardDescription>
                Popular topics and content patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Customer Service', 'Product Quality', 'Delivery Issues', 'Pricing', 'Support'].map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{topic}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Metrics</CardTitle>
              <CardDescription>
                Automated escalation performance and outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <div className="text-sm text-muted-foreground">Auto Escalations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};