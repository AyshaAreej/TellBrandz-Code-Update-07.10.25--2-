import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface TellCardProps {
  id: string;
  title: string;
  content: string;
  brand: string;
  author: string;
  date: string;
  status?: 'open' | 'resolved' | 'in_progress';
  type?: 'blast' | 'beat';
}
export const TellCard: React.FC<TellCardProps> = ({ 
  id, title, content, brand, author, date, status = 'open', type = 'blast' 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">✓ Resolved</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Open</Badge>;
    }
  };

  const getTypeBadge = () => {
    return type === 'blast' 
      ? <Badge variant="destructive">BrandBlast</Badge>
      : <Badge className="bg-blue-100 text-blue-800">BrandBeat</Badge>;
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeBadge()}
              {getStatusBadge()}
              <span className="text-sm text-muted-foreground">@{brand}</span>
            </div>
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">{content}</p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>by {author}</span>
          </div>
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>

        {status === 'resolved' && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              This issue has been resolved through our paid resolution service
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};