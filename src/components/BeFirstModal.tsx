import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';

interface BeFirstModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

export function BeFirstModal({ isOpen, onClose, onSignUp }: BeFirstModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Be the First to Comment!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <MessageSquare className="h-16 w-16 text-yellow-400" />
              <Users className="h-8 w-8 text-gray-400 absolute -bottom-1 -right-1" />
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">
            This brand story is waiting for its first comment. Join our community and start the conversation!
          </p>
          
          {/* Show pending comment info if available */}
          {(() => {
            const pendingComment = localStorage.getItem('pendingComment');
            if (pendingComment) {
              try {
                const tellInfo = JSON.parse(pendingComment);
                return (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Ready to comment on:</strong> "{tellInfo.tellTitle}" by {tellInfo.brandName}
                    </p>
                  </div>
                );
              } catch (e) {
                return null;
              }
            }
            return null;
          })()}
          
          <div className="space-y-3">
            <Button 
              onClick={onSignUp}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-semibold"
            >
              Sign Up & Comment
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}