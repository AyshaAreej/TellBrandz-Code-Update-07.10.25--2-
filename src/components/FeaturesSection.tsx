import React from 'react';
import { MessageSquare, Star, ArrowRight } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* BrandBlast */}
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">BrandBlast</h3>
            <p className="text-gray-600 leading-relaxed">
              Share negative experiences and get brands to respond
            </p>
          </div>

          {/* BrandBeat */}
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">BrandBeat</h3>
            <p className="text-gray-600 leading-relaxed">
              Celebrate positive experiences and great service
            </p>
          </div>

          {/* Resolution */}
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRight className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Resolution</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect with brands to resolve issues directly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;