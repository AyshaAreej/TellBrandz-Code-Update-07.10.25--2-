import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Building, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  description?: string;
}

interface BrandManagementIntegrationProps {
  onBrandUpdate?: (brands: Brand[]) => void;
}

export const BrandManagementIntegration: React.FC<BrandManagementIntegrationProps> = ({
  onBrandUpdate
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    established: new Date().getFullYear(),
    description: '',
    logo: '🏢'
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('brand-management', {
        body: { action: 'get_brands' }
      });

      if (error) throw error;
      
      if (data?.brands) {
        setBrands(data.brands);
        onBrandUpdate?.(data.brands);
      }
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const action = editingBrand ? 'update_brand' : 'create_brand';
      const payload = editingBrand 
        ? { ...formData, id: editingBrand.id }
        : formData;

      const { data, error } = await supabase.functions.invoke('brand-management', {
        body: { action, ...payload }
      });

      if (error) throw error;

      await loadBrands();
      resetForm();
      setShowAddDialog(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Error saving brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brandId: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('brand-management', {
        body: { action: 'delete_brand', id: brandId }
      });

      if (error) throw error;

      await loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      location: '',
      established: new Date().getFullYear(),
      description: '',
      logo: '🏢'
    });
  };

  const startEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      category: brand.category,
      location: brand.location,
      established: brand.established,
      description: brand.description || '',
      logo: brand.logo
    });
    setShowAddDialog(true);
  };

  const categories = [
    'Telecommunications', 'Banking & Finance', 'E-commerce', 
    'Manufacturing', 'Transportation', 'Food & Beverage',
    'Technology', 'Healthcare', 'Education', 'Retail'
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-5 w-5" />
          <span>Brand Management</span>
          <Badge variant="secondary">{brands.length}</Badge>
        </CardTitle>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-1" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Brand Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Logo Emoji</label>
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({...formData, logo: e.target.value})}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Year Established</label>
                <Input
                  type="number"
                  value={formData.established}
                  onChange={(e) => setFormData({...formData, established: parseInt(e.target.value)})}
                  min="1800"
                  max={new Date().getFullYear()}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-1" />
                  {editingBrand ? 'Update' : 'Create'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddDialog(false);
                    setEditingBrand(null);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No brands found</p>
            <p className="text-sm">Add your first brand to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {brands.map(brand => (
              <div key={brand.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{brand.logo}</div>
                  <div>
                    <h4 className="font-medium">{brand.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {brand.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        📍 {brand.location} • Est. {brand.established}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(brand)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(brand.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};