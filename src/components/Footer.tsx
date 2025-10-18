import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/688b3314fcf74852e0269be1_1754154891392_46e4ce7e.png" 
                alt="TellBrandz Logo" 
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-100">TellBrandz</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              The digital bureau for real accountability. Share your brand experiences and 
              help build better business practices through transparent feedback.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://www.linkedin.com/company/tellbrandz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Platform</h3>
            <ul className="space-y-4 md:space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/how-it-works')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/faq')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Legal</h3>
            <ul className="space-y-4 md:space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/guidelines')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="text-gray-300 hover:text-gray-100 text-sm transition-colors hover:translate-x-1 transform duration-200 block"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-xs">
              © 2025 Copyright DajEd RolloutTech. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm italic font-light">
              ...just tell the brand
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;