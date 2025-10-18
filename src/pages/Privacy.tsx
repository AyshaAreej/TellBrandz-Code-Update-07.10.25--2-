import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Database, Eye, Download, Lock } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Effective Date: October 7, 2025</p>
          
          <div className="prose max-w-none">
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              This Privacy Policy describes how TellBrandz.com ("TellBrandz," "we," "us," or "our") collects, uses, and shares your personal information when you use our platform.
            </p>

            <section className="mb-6 sm:mb-8 border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">1. Information We Collect</h2>
              </div>
              
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">1.1. Information You Provide Directly:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <li><strong>Account Information:</strong> When you register, you provide your name, email address, and password.</li>
                <li><strong>Profile Information:</strong> You may choose to provide additional information for your profile, such as a profile picture or location.</li>
                <li><strong>"Tell" Content:</strong> When you submit a "tell," you provide brand name, product/service details, and detailed description of your experience.</li>
                <li><strong>Demographic Data (Optional):</strong> Age Range, Occupation, Income Range, Education Level, and Household Size. These fields are entirely optional and can be opted out at any time.</li>
                <li><strong>Date of Birth (Secure Storage):</strong> If provided, your date of birth is stored securely and only the derived Age Range is shared with brands.</li>
                <li><strong>Communications:</strong> Records of your correspondence with us (e.g., customer support inquiries).</li>
              </ul>

              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">1.2. Information We Collect Automatically:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>Usage Data:</strong> Information about your activity on the Platform, such as pages you visit and interactions with features.</li>
                <li><strong>Device Information:</strong> Information about the device you use to access the Platform, including IP address and browser type.</li>
                <li><strong>Cookies:</strong> We use cookies and similar technologies to collect information about your browsing activities.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8 border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-green-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">We use the information we collect for various purposes, including:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>To Provide and Maintain the Platform:</strong> To operate, maintain, and improve the functionality of TellBrandz.com.</li>
                <li><strong>To Personalize Your Experience:</strong> To tailor content and features to your interests.</li>
                <li><strong>To Contextualize Market Feedback:</strong> Demographic data is used to contextualize and improve the integrity of market feedback shared with brands, helping them understand customer perspectives better.</li>
                <li><strong>To Facilitate Resolution:</strong> To enable brands to resolve BrandBlasts through direct customer engagement.</li>
                <li><strong>For Communication:</strong> To send you service-related notifications and updates.</li>
                <li><strong>For Moderation:</strong> To moderate user-generated content and enforce our Terms of Use.</li>
                <li><strong>For Analytics:</strong> To understand how users interact with our Platform and improve our services.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">3. How We Share Your Information</h2>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">We may share your information with third parties in the following circumstances:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>Publicly Displayed Information:</strong> Your "tells," comments, username, and profile picture are visible to other users and the public.</li>
                <li><strong>With Brands (Respecting Privacy Settings):</strong> If you submit a "tell" about a brand, that brand will have access to your "tell" and username. Demographic data is only shared if you have opted in to share specific fields.</li>
                <li><strong>Service Providers:</strong> We engage third-party service providers for hosting, analytics, and customer support.</li>
                <li><strong>Legal Compliance:</strong> We may disclose your information if required by law or to protect our rights and safety.</li>
                <li><strong>With Your Consent:</strong> We may share your information with third parties when we have your explicit consent.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">4. Data Security</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, use, alteration, and disclosure. Sensitive data such as Date of Birth is stored securely and masked or generalized (as Age Ranges) where possible to minimize risk. However, no internet transmission or electronic storage method is 100% secure.
              </p>
            </section>

            <section className="mb-6 sm:mb-8 border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">5. Your Rights and Controls</h2>
              </div>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">You have extensive rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li><strong>Access and Rectification:</strong> You can access and update your account information through your profile settings.</li>
                <li><strong>Right to Opt-Out:</strong> You have granular control over which demographic fields are shared with brands. You can opt-out of sharing specific data points (e.g., Income Range, Occupation) at any time through the "Data & Insights" section of your dashboard.</li>
                <li><strong>Right to Data Portability:</strong> You can download a complete export of your review history and all associated demographic data in JSON format with one click via the "Download My Data" button in your dashboard.</li>
                <li><strong>Deletion:</strong> You can request the deletion of your account and associated personal data.</li>
                <li><strong>Opt-Out of Emails:</strong> You can opt-out of receiving promotional emails from us.</li>
                <li><strong>Cookies:</strong> You can modify your browser settings to decline cookies if you prefer.</li>
                <li><strong>Data Transparency:</strong> You can view which brands have accessed your contextual review data through the Review Visibility Score in your dashboard.</li>
              </ul>
            </section>

            <section className="mb-6 sm:mb-8 border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">6. Data Minimization & Retention</h2>
              </div>
              <p className="text-gray-700 mb-3 text-sm sm:text-base">
                <strong>Data Minimization:</strong> TellBrandz is designed to collect only the minimum necessary data to achieve our core goal of providing contextual market feedback. We mask or generalize sensitive data (e.g., using Age Ranges instead of exact dates of birth) wherever possible.
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <strong>Data Retention:</strong> We retain your demographic data for as long as your account is active or as needed to provide you services. Upon account deletion, all personal information, including demographic data and review history, is permanently deleted from our systems within 30 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                TellBrandz.com is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18.
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">8. Changes to this Privacy Policy</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Effective Date."
              </p>
            </section>

            <section className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">9. Contact Us</h2>
              <p className="text-gray-700 text-sm sm:text-base">
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us: 
                <a href="mailto:info@tellbrandz.com" className="text-blue-600 hover:text-blue-800 ml-1 break-all">
                  info@tellbrandz.com
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

export default Privacy;