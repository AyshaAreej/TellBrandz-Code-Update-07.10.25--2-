import React from 'react';
import { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Breadcrumb } from '../components/Breadcrumb';
import { BackToTop } from '../components/BackToTop';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const faqData = [
    {
      category: 'General Questions',
      questions: [
        {
          q: 'What is TellBrandz.com?',
          a: 'TellBrandz.com is a platform where customers can share their experiences (positive or negative) with brands, and brands can respond, resolve issues, and improve their accountability.'
        },
        {
          q: 'How is TellBrandz different from other review sites?',
          a: 'TellBrandz focuses on facilitating direct communication and resolution between customers and brands. Brands can have negative "tells" marked as resolved after they\'ve addressed the issue to the customer\'s satisfaction.'
        },
        {
          q: 'Is TellBrandz free to use?',
          a: 'TellBrandz is completely free for all users to view and share their stories. Brands can resolve BrandBlasts at no cost by engaging directly with customers.'
        }
      ]
    },
    {
      category: 'For Customers',
      questions: [
        {
          q: 'What is a "BrandBlast"?',
          a: 'A "BrandBlast" is a negative experience or complaint about a product or service.'
        },
        {
          q: 'What is a "BrandBeat"?',
          a: 'A "BrandBeat" is a positive experience or praise for a product or service.'
        },
        {
          q: 'Can I edit my "tell" after submitting it?',
          a: 'Once a "tell" is published, it cannot be edited to maintain integrity. You may be able to edit it while it\'s in moderation.'
        },
        {
          q: 'Do I get paid if my "BrandBlast" is removed?',
          a: 'No, TellBrandz resolution is completely free for both customers and brands. Your satisfaction with the brand\'s resolution is the goal.'
        }
      ]
    },
    {
      category: 'For Brands (Representatives)',
      questions: [
        {
          q: 'How do I claim my brand\'s profile?',
          a: 'Click "Claim Your Brand" on your brand\'s profile page and follow the verification steps, which ensure you are an authorized representative.'
        },
        {
          q: 'How does the "BrandBlast" removal process work?',
          a: 'You engage with the complainer to resolve their issue. Once they are satisfied and give consent, the detailed "BrandBlast" content is replaced with a "Resolved" notice at no cost.'
        },
        {
          q: 'What happens if I don\'t resolve a "BrandBlast"?',
          a: 'The "BrandBlast" will remain public on your profile and continue to contribute to your total "BrandBlasts" count.'
        }
      ]
    }
  ];

  const toggleSection = (category: string) => {
    setExpandedSection(expandedSection === category ? null : category);
  };

  const filteredFAQ = faqData.map(section => ({
    ...section,
    questions: section.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Breadcrumb />
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Your Questions, Answered.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-8 px-4">
            Find quick answers to common questions about using TellBrandz.com.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto px-4">
            <Input
              type="text"
              placeholder="Search our FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg border-2 border-blue-200 focus:border-blue-500"
            />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-4 sm:space-y-6">
          {filteredFAQ.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.category)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <h2 className="text-lg sm:text-xl font-semibold">{section.category}</h2>
              </button>
              
              {expandedSection === section.category && (
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {section.questions.map((item, questionIndex) => (
                    <div key={questionIndex} className="border-b border-gray-200 last:border-b-0 pb-3 sm:pb-4 last:pb-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Q: {item.q}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        A: {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQ.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 text-base sm:text-lg">No FAQs match your search term.</p>
          </div>
        )}

        {/* Contact Support */}
        <div className="text-center mt-8 sm:mt-12 px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Still have questions?</h2>
          <Button 
            onClick={() => navigate('/contact')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
          >
            Contact Our Support Team
          </Button>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default FAQ;