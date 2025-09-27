import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  CreditCard, 
  ShoppingCart, 
  Car, 
  Plane, 
  Home,
  Utensils,
  Shirt,
  Gamepad2,
  Heart
} from 'lucide-react';

interface Category {
  name: string;
  icon: React.ReactNode;
  count: number;
  brands: string[];
}

const categories: Category[] = [
  {
    name: 'Telecommunications',
    icon: <Smartphone className="h-5 w-5" />,
    count: 15,
    brands: ['MTN', 'Airtel', 'Glo', '9mobile']
  },
  {
    name: 'Banking & Finance',
    icon: <CreditCard className="h-5 w-5" />,
    count: 25,
    brands: ['GTBank', 'First Bank', 'Access Bank', 'UBA']
  },
  {
    name: 'E-commerce',
    icon: <ShoppingCart className="h-5 w-5" />,
    count: 12,
    brands: ['Jumia', 'Konga', 'PayPorte', 'Slot']
  },
  {
    name: 'Transportation',
    icon: <Car className="h-5 w-5" />,
    count: 8,
    brands: ['Uber', 'Bolt', 'Opay', 'Gokada']
  },
  {
    name: 'Airlines',
    icon: <Plane className="h-5 w-5" />,
    count: 6,
    brands: ['Arik Air', 'Air Peace', 'Dana Air']
  },
  {
    name: 'Real Estate',
    icon: <Home className="h-5 w-5" />,
    count: 10,
    brands: ['RevolutionPlus', 'Mixta Africa', 'Lekki Gardens']
  },
  {
    name: 'Food & Beverage',
    icon: <Utensils className="h-5 w-5" />,
    count: 18,
    brands: ['Dangote', 'Nestle', 'Coca-Cola', 'Indomie']
  },
  {
    name: 'Fashion & Retail',
    icon: <Shirt className="h-5 w-5" />,
    count: 14,
    brands: ['Shoprite', 'Game', 'Mr Price', 'Zara']
  }
];

const BrandCategories: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <Link
          key={index}
          to={`/brands?category=${encodeURIComponent(category.name)}`}
          className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="text-orange-500 group-hover:text-orange-600">
              {category.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 text-sm group-hover:text-orange-600">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500">{category.count} brands</p>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {(category.brands || []).slice(0, 3).join(', ')}
            {(category.brands || []).length > 3 && '...'}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BrandCategories;