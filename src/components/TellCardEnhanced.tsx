import React, { useState } from 'react';
import { MessageCircle, Heart, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface Tell {
  id: string;
  type: 'BrandBlast' | 'BrandBeat';
  title: string;
  description: string;
  brand_name: string;
  user_id: string;
  status: 'pending' | 'published' | 'rejected';
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

interface TellCardEnhancedProps {
  tell: Tell;
  onLike?: (tellId: string) => void;
  onComment?: (tellId: string, comment: string) => void;
}

const TellCardEnhanced: React.FC<TellCardEnhancedProps> = ({ tell, onLike, onComment }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(tell.id);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={'https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1757129321085_96dfb1d7.png'}
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-900">Anonymous User</span>
            <span className="text-gray-500 text-sm">• {formatDate(tell.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {/* Type Badge */}
            <Badge 
              className={`flex items-center gap-1 text-white font-medium ${
                tell.type === 'BrandBeat' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {tell.type === 'BrandBeat' ? <ThumbsUp className="h-3 w-3" /> : <ThumbsDown className="h-3 w-3" />}
              {tell.type}
            </Badge>
            
            {/* Resolved Badge */}
            {tell.resolved && (
              <Badge className="flex items-center gap-1 text-white font-medium bg-green-500 hover:bg-green-600">
                <CheckCircle className="h-3 w-3" />
                Resolved
              </Badge>
            )}
            
            <span className="text-sm text-gray-600">About</span>
            <span className="font-semibold text-gray-900">{tell.brand_name}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2">{tell.title}</h3>
          
          <p className="text-gray-700 mb-4 leading-relaxed">
            {isExpanded ? tell.description : `${(tell.description || '').slice(0, 150)}${(tell.description || '').length > 150 ? '...' : ''}`}
          </p>
          
          {(tell.description || '').length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center p-1">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${tell.brand_name}`}
              alt={`${tell.brand_name} logo`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {Math.floor(Math.random() * 20) + 1}
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {Math.floor(Math.random() * 10)}
        </button>
      </div>
    </div>
  );
};

export default TellCardEnhanced;