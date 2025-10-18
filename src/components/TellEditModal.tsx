import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Tell {
  id: string;
  type: 'BrandBlast' | 'BrandBeat';
  title: string;
  description: string;
  brand_name: string;
}

interface TellEditModalProps {
  tell: Tell | null;
  open: boolean;
  onClose: () => void;
  onSave: (updatedTell: Tell) => void;
}

const TellEditModal: React.FC<TellEditModalProps> = ({ tell, open, onClose, onSave }) => {
  const [formData, setFormData] = useState<Tell | null>(tell);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setFormData(tell);
  }, [tell]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setLoading(true);
    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update tell:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Experience Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: 'BrandBlast' | 'BrandBeat') => 
                setFormData({...formData, type: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BrandBlast">BrandBlast (Complaint)</SelectItem>
                <SelectItem value="BrandBeat">BrandBeat (Praise)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="edit-brand">Brand Name</Label>
            <Input
              id="edit-brand"
              value={formData.brand_name}
              onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TellEditModal;