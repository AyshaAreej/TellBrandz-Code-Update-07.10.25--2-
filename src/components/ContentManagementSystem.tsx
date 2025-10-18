import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Image, Settings, Plus, Edit, Trash2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'announcement' | 'faq';
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

const ContentManagementSystem: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'page' as 'page' | 'announcement' | 'faq',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.warn('Error fetching content:', error);
      // Fallback to demo data
      setContent([
        {
          id: '1',
          title: 'Welcome Page',
          content: 'Welcome to TellBrandz!',
          type: 'page',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('content_items')
          .update({
            title: formData.title,
            content: formData.content,
            type: formData.type,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: 'Content updated successfully' });
      } else {
        const { error } = await supabase
          .from('content_items')
          .insert({
            title: formData.title,
            content: formData.content,
            type: formData.type,
            status: formData.status
          });
        
        if (error) throw error;
        toast({ title: 'Content created successfully' });
      }
      
      resetForm();
      fetchContent();
    } catch (error) {
      toast({ 
        title: 'Error saving content', 
        description: 'Please try again',
        variant: 'destructive' 
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Content deleted successfully' });
      fetchContent();
    } catch (error) {
      toast({ 
        title: 'Error deleting content',
        variant: 'destructive' 
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', type: 'page', status: 'draft' });
    setEditingItem(null);
    setIsCreating(false);
  };

  const startEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      status: item.status
    });
    setIsCreating(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content Items</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingItem ? 'Edit Content' : 'Create New Content'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                />
                <div className="flex gap-4">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="page">Page</option>
                    <option value="announcement">Announcement</option>
                    <option value="faq">FAQ</option>
                  </select>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {content.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={item.type === 'page' ? 'default' : 'secondary'}>
                        {item.type}
                      </Badge>
                      <Badge variant={item.status === 'published' ? 'default' : 'outline'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Updated: {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>CMS Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Configure content management system settings here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagementSystem;