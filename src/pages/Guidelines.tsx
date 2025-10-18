import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
const Guidelines: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Community Guidelines</h1>
          <p className="text-gray-600 mb-8">Welcome to TellBrandz!</p>
          
          <div className="prose max-w-none">
            <p className="mb-6">
              At TellBrandz.com, our mission is to empower customers to share their authentic experiences with brands and to encourage brands to be more responsive and accountable. To ensure our platform remains a fair, effective, and respectful space for everyone, we've established these Community Guidelines.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Be Respectful and Constructive</h2>
              <p className="text-gray-700 mb-4">We encourage honest feedback, but always in a respectful manner.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>No Personal Attacks or Harassment:</strong> Do not insult, threaten, bully, or harass other users, brands, or individuals.</li>
                <li><strong>Focus on the Brand/Product:</strong> Your "tells" should focus on your experience with a brand's product or service, not personal attacks.</li>
                <li><strong>Avoid Excessive Profanity:</strong> While we understand frustration, excessive profanity detracts from constructive dialogue.</li>
                <li><strong>Stay Relevant:</strong> Comments should be relevant to the "tell" or discussion.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Be Honest and Accurate</h2>
              <p className="text-gray-700 mb-4">The credibility of TellBrandz relies on the honesty of our users.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Share Your Genuine Experience:</strong> Your "tell" must be based on your actual, personal experience with the brand.</li>
                <li><strong>Provide Factual Information:</strong> Focus on verifiable facts. Opinions should be clearly stated as such.</li>
                <li><strong>No Fabricated "Tells":</strong> Do not submit false, misleading, or intentionally inaccurate "tells" or evidence.</li>
                <li><strong>Authentic Responses:</strong> Brand representatives must ensure their responses are truthful and genuine.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Protect Privacy</h2>
              <p className="text-gray-700 mb-4">Respecting privacy is fundamental to our community.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Do Not Share Personal Information:</strong> Do not publicly share sensitive personal information such as phone numbers, addresses, or financial details.</li>
                <li><strong>Respect Others' Privacy:</strong> Do not post images or videos of identifiable individuals without their consent.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Illegal or Harmful Activities</h2>
              <p className="text-gray-700 mb-4">TellBrandz cannot be used to promote or engage in illegal or dangerous activities.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>No Illegal Content:</strong> Do not post content that promotes illegal acts, violence, or unlawful activity.</li>
                <li><strong>No Threats:</strong> Do not use the platform to issue threats or incite violence.</li>
                <li><strong>No Impersonation:</strong> Do not impersonate any person or entity, including brand representatives or other users.</li>
                <li><strong>No Malware or Spam:</strong> Do not upload viruses, malware, or engage in spamming or phishing.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Respect Intellectual Property</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Original Content:</strong> Only post content that you have the right to use.</li>
                <li><strong>Cite Sources:</strong> If you reference external information, clearly credit the original source.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Maintain Platform Integrity</h2>
              <p className="text-gray-700 mb-4">Help us keep TellBrandz fair and functional.</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>No Abuse of Features:</strong> Do not misuse platform features, such as the reporting system.</li>
                <li><strong>No Excessive Self-Promotion:</strong> While brands can engage, excessive promotional content is prohibited.</li>
                <li><strong>One Account Per User:</strong> Each individual user should maintain only one account.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Consequences</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-700 mb-2"><strong>First Violation:</strong> May result in a warning and content removal.</p>
                <p className="text-gray-700 mb-2"><strong>Repeated Violations:</strong> May lead to temporary account suspension.</p>
                <p className="text-gray-700"><strong>Severe Violations:</strong> Will result in immediate and permanent account termination.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Reporting Violations</h2>
              <p className="text-gray-700 mb-4">
                If you see content or behavior that violates these guidelines, please report it using our "Report" button or by contacting us: 
                <a href="mailto:report@tellbrandz.com" className="text-blue-600 hover:text-blue-800 ml-1">
                  report@tellbrandz.com
                </a>
              </p>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-gray-700">
                By adhering to these guidelines, you help us build a vibrant, trustworthy, and effective community where customer voices genuinely matter and brands are encouraged to do their best.
              </p>
              <p className="text-gray-700 mt-2 font-semibold">
                Thank you for being a part of TellBrandz.com!
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default Guidelines;