import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Breadcrumb } from '../components/Breadcrumb';
import { BackToTop } from '../components/BackToTop';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle anchor links for dummy tell section
    if (window.location.hash === '#dummy-tell') {
      const element = document.getElementById('dummy-tell-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Breadcrumb />
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            How TellBrandz Transforms Feedback into Action
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Learn how TellBrandz empowers your voice and helps brands become more accountable.
          </p>
        </div>

        {/* For Customers Section */}
        <section className="mb-8 sm:mb-16">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 sm:mb-4">For Customers</h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-8">Share Your Experience, Get Heard</p>
            
            <div className="space-y-4 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Share Your "Tell" for Free</h3>
                  <ul className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 list-disc list-inside pl-2 sm:pl-0">
                    <li><strong>Free Access:</strong> Create an account and access our platform at no cost</li>
                    <li><strong>Choose Your Story:</strong> Did a brand exceed expectations (BrandBeat) or fall short (BrandBlast)?</li>
                    <li><strong>Detail Your Experience:</strong> Write a clear, factual account with dates, locations, and evidence</li>
                    <li><strong>Submit:</strong> Once ready, submit your "tell" for moderation</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Engage & Observe</h3>
                  <ul className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 list-disc list-inside pl-2 sm:pl-0">
                    <li><strong>Moderation:</strong> Our team reviews every "tell" against Community Guidelines</li>
                    <li><strong>Public Visibility:</strong> Your "tell" becomes a public record on the brand's profile</li>
                    <li><strong>Comments:</strong> Other users can comment and share similar experiences</li>
                    <li><strong>Brand Response:</strong> Brands may respond publicly to your "tell"</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Resolution (For BrandBlasts)</h3>
                  <ul className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 list-disc list-inside pl-2 sm:pl-0">
                    <li><strong>Brand Reaches Out:</strong> Brands may contact you through the platform to resolve issues</li>
                    <li><strong>Dialogue & Promise:</strong> Engage directly with brand representatives</li>
                    <li><strong>Resolution Acknowledged:</strong> Satisfied? Mark the "tell" as resolved</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Start Your Tell Now
              </Button>
            </div>
          </div>
        </section>

        {/* For Brands Section */}
        <section className="mb-8 sm:mb-12">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2 sm:mb-4">For Brands</h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-8">Listen, Resolve, and Build Trust</p>
            
            <div className="space-y-4 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Claim Your Brand Profile</h3>
                  <ul className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 list-disc list-inside pl-2 sm:pl-0">
                    <li><strong>Verify Identity:</strong> Complete our secure verification process</li>
                    <li><strong>Gain Control:</strong> Access your brand's dedicated page and dashboard</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Monitor & Respond to Feedback</h3>
                  <ul className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 list-disc list-inside pl-2 sm:pl-0">
                    <li><strong>Real-time Insights:</strong> View all "BrandBlasts" and "BrandBeats" in your dashboard</li>
                    <li><strong>Public Responses:</strong> Craft official responses demonstrating customer service commitment</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Initiate Resolution & Reputation Management</h3>
                  <ul className="text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 list-disc list-inside pl-2 sm:pl-0">
                    <li><strong>Direct Engagement:</strong> Communicate privately with customers about BrandBlasts</li>
                    <li><strong>Make a Promise:</strong> Work toward satisfactory resolution</li>
                     <li><strong>Teller Approval:</strong> Upon customer satisfaction, BrandBlast becomes "Resolved" at no cost</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
              >
                Claim Your Brand Profile
              </Button>
            </div>
          </div>
        </section>

        {/* Dummy Tell Example Section */}
        <section id="dummy-tell-section" className="mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2 sm:mb-4">Sample Brand Story</h2>
            <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">This is a sample story to show you how TellBrandz works</p>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <span className="text-gray-600 font-bold text-sm sm:text-base">TC</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">TechCorp</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Sample Brand</p>
                </div>
              </div>
              
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                "Amazing Customer Service Experience"
              </h4>
              
              <p className="text-sm sm:text-base text-gray-700 mb-4">
                This is an example of how a real brand story would appear on TellBrandz. 
                Users share their experiences, both positive (BrandBeats) and negative (BrandBlasts), 
                to help others make informed decisions and hold brands accountable.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                  <span>👎 12 BrandBlasts</span>
                  <span>👍 45 BrandBeats</span>
                </div>
                <Button 
                    onClick={() => window.location.href = '/share-experience'}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base px-4 py-2 w-full sm:w-auto"
                >
                  Share Your Story
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default HowItWorks;