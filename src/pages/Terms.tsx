import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const Terms: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Terms of Use</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Effective Date: August 1, 2025</p>
          
          <div className="prose max-w-none">
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              Welcome to TellBrandz.com ("TellBrandz," "we," "us," or "our"). These Terms of Use ("Terms") govern your access to and use of our website and any related services (collectively, the "Platform").
            </p>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                By creating an account, submitting a "tell," commenting, or otherwise using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, including any future modifications.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">2. Eligibility and Accounts</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>Age Restriction:</strong> You must be at least 18 years old to create an account and use the full features of the Platform.</li>
                <li><strong>Account Creation:</strong> You agree to provide accurate, current, and complete information during the registration process.</li>
                <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">3. User Roles and Responsibilities</h2>
              
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">3.1. Customers:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <li><strong>Free Access:</strong> Creating an account and sharing your "tells" (BrandBlast or BrandBeat) is completely free on TellBrandz.</li>
                <li><strong>Content Ownership:</strong> You retain ownership of the content you submit ("User Content"). However, you grant TellBrandz a worldwide, non-exclusive, royalty-free license to use your User Content.</li>
                <li><strong>Accuracy of "Tells":</strong> You are solely responsible for the accuracy, truthfulness, and completeness of the "tells" and evidence you submit.</li>
              </ul>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">3.2. Brand Representatives:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>Claiming a Profile:</strong> To claim a brand profile, you must be an authorized representative of the brand and complete our verification process.</li>
                <li><strong>Brand Responsibility:</strong> You are solely responsible for all actions taken under your claimed brand profile.</li>
                <li><strong>"Tell" Removal Process:</strong> Brands may request the removal of a "BrandBlast" only after engaging with the original "teller" and obtaining their consent.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">4. Prohibited Content/Conduct</h2>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>Submit any User Content that is false, defamatory, abusive, harassing, obscene, hateful, discriminatory, infringing, or illegal.</li>
                <li>Impersonate any person or entity.</li>
                <li>Upload or transmit viruses or any other harmful code.</li>
                <li>Engage in spamming, phishing, or other disruptive activities.</li>
                <li>Attempt to gain unauthorized access to any part of the Platform or its related systems.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">5. Brand Resolution Process</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>Free Platform:</strong> TellBrandz is completely free for all users to create accounts, view content, and share their stories.</li>
                <li><strong>Free Resolution:</strong> Brands can resolve BrandBlasts at no cost by engaging directly with customers and obtaining their satisfaction.</li>
                <li><strong>Resolution Process:</strong> Brands must first engage with the customer and obtain their satisfaction before the BrandBlast can be marked as "Resolved".</li>
                <li><strong>Customer Consent Required:</strong> Resolution is only possible with explicit customer consent and satisfaction.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                To the fullest extent permitted by law, TellBrandz shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">7. Governing Law</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">8. Contact Us</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                If you have any questions about these Terms, please contact us: 
                <a href="mailto:info@tellbrandz.com" className="text-blue-600 hover:text-blue-800 ml-1 break-all">
                  info@tellbrandz.com
                </a>
              </p>
              <p className="text-gray-700 mt-2 text-sm sm:text-base">
                Support Email: 
                <a href="mailto:support@tellbrandz.com" className="text-blue-600 hover:text-blue-800 ml-1 break-all">
                  support@tellbrandz.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;