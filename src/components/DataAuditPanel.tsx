import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Save, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { getAgeRangeFromDOB } from '@/utils/dobCalculator';


interface DemographicData {
  age_range?: string;
  occupation?: string;
  income_range?: string;
  education_level?: string;
  household_size?: number;
  demographic_preferences?: {
    share_age: boolean;
    share_occupation: boolean;
    share_income: boolean;
    share_education: boolean;
    share_household: boolean;
  };
}

export default function DataAuditPanel({ userId }: { userId: string }) {
  const [data, setData] = useState<DemographicData>({
    demographic_preferences: {
      share_age: true,
      share_occupation: true,
      share_income: true,
      share_education: true,
      share_household: true
    }
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('age_range, date_of_birth, occupation, income_range, education_level, household_size, share_age_range, share_occupation, share_income_range, share_education_level, share_household_size')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (userData) {
        // Calculate age range from DOB if available
        let ageRange = userData.age_range;
        if (userData.date_of_birth && !ageRange) {
          const calculatedRange = getAgeRangeFromDOB(userData.date_of_birth);
          ageRange = calculatedRange.range;
        }

        setData({
          age_range: ageRange,
          occupation: userData.occupation,
          income_range: userData.income_range,
          education_level: userData.education_level,
          household_size: userData.household_size,
          demographic_preferences: {
            share_age: userData.share_age_range ?? true,
            share_occupation: userData.share_occupation ?? true,
            share_income: userData.share_income_range ?? true,
            share_education: userData.share_education_level ?? true,
            share_household: userData.share_household_size ?? true,
          }
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const { data: exportData, error } = await supabase.functions.invoke('user-data-export', {
        body: { userId }
      });

      if (error) throw error;

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tellbrandz-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data exported',
        description: 'Your data has been downloaded successfully.'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Unable to export data. Please try again.',
        variant: 'destructive'
      });
    }
  };



  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          age_range: data.age_range,
          occupation: data.occupation,
          income_range: data.income_range,
          education_level: data.education_level,
          household_size: data.household_size,
          share_age_range: data.demographic_preferences?.share_age,
          share_occupation: data.demographic_preferences?.share_occupation,
          share_income_range: data.demographic_preferences?.share_income,
          share_education_level: data.demographic_preferences?.share_education,
          share_household_size: data.demographic_preferences?.share_household,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your demographic data and preferences have been updated.'
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Unable to save changes. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const togglePreference = (field: keyof typeof data.demographic_preferences) => {
    setData(prev => ({
      ...prev,
      demographic_preferences: {
        ...prev.demographic_preferences!,
        [field]: !prev.demographic_preferences![field]
      }
    }));
  };


  if (loading) {
    return <div className="text-center py-8">Loading data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Demographic Data
          </CardTitle>
          <CardDescription>
            Manage what information you share with brands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Age Range</Label>
                <Select value={data.age_range} onValueChange={(v) => setData({...data, age_range: v})}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-64">55-64</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.demographic_preferences?.share_age}
                  onCheckedChange={() => togglePreference('share_age')}
                />
                <Label>Share with Brands</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 mr-4">
                <Label>Occupation</Label>
                <Input
                  value={data.occupation || ''}
                  onChange={(e) => setData({...data, occupation: e.target.value})}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.demographic_preferences?.share_occupation}
                  onCheckedChange={() => togglePreference('share_occupation')}
                />
                <Label>Share</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Income Range</Label>
                <Select value={data.income_range} onValueChange={(v) => setData({...data, income_range: v})}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select income" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<25k">Less than $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-75k">$50,000 - $75,000</SelectItem>
                    <SelectItem value="75k-100k">$75,000 - $100,000</SelectItem>
                    <SelectItem value="100k+">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.demographic_preferences?.share_income}
                  onCheckedChange={() => togglePreference('share_income')}
                />
                <Label>Share</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Education Level</Label>
                <Select value={data.education_level} onValueChange={(v) => setData({...data, education_level: v})}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.demographic_preferences?.share_education}
                  onCheckedChange={() => togglePreference('share_education')}
                />
                <Label>Share</Label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Household Size</Label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={data.household_size || ''}
                  onChange={(e) => setData({...data, household_size: parseInt(e.target.value)})}
                  className="w-[200px]"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={data.demographic_preferences?.share_household}
                  onCheckedChange={() => togglePreference('share_household')}
                />
                <Label>Share</Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handleExportData} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
