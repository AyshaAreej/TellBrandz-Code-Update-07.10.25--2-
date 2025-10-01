import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Privacy: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              TellBrandz Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Effective Date: September 30, 2025
            </p>

            <div className="prose max-w-none text-gray-700">
              <p className="mb-6 text-sm sm:text-base">
                This Privacy Policy describes how TellBrandz.com ("TellBrandz,"
                "we," "us," or "our") collects, uses, and shares your personal
                information when you use our platform. By accessing or using
                TellBrandz, you agree to this Privacy Policy.
              </p>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  1. Information We Collect
                </h2>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  1.1. Information You Provide Directly:
                </h3>
                <ul className="list-disc list-inside space-y-2 mb-4 text-sm sm:text-base">
                  <li>
                    <strong>Account Information:</strong> When you register, you
                    provide your name, email address, and a secure password.
                  </li>
                  <li>
                    <strong>Profile Information:</strong> You may choose to
                    provide additional information, such as a profile picture or
                    display name.
                  </li>
                  <li>
                    <strong>"Tell" Content:</strong> When you submit a review
                    ("tell"), you provide the brand name, product/service
                    details, and the detailed description of your experience.
                  </li>
                  <li>
                    <strong>Contextual (Demographic) Data:</strong> To improve
                    the integrity and context of your feedback, you may
                    optionally provide demographic information, including:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>
                        Age Range (derived from Date of Birth, if provided)
                      </li>
                      <li>Occupation/Industry</li>
                      <li>Income Range</li>
                    </ul>
                    <em className="block mt-2 text-gray-600">
                      Note: All Contextual Data is optional, and you control its
                      visibility to brands via your Dashboard.
                    </em>
                  </li>
                  <li>
                    <strong>Communications:</strong> Records of your
                    correspondence with us (e.g., customer support inquiries).
                  </li>
                </ul>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  1.2. Information We Collect Automatically:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                  <li>
                    <strong>Usage Data:</strong> Information about your activity
                    on the Platform, such as pages you visit, features you
                    interact with, and the frequency of your contributions.
                  </li>
                  <li>
                    <strong>Device and Location Information:</strong> Technical
                    information about the device you use (IP address, browser
                    type, operating system) and non-precise geolocation data
                    (city/region derived from your IP address).
                  </li>
                  <li>
                    <strong>Cookies and Tracking Technologies:</strong> We use
                    cookies, web beacons, and similar technologies to collect
                    information about your browsing activities, maintain your
                    session, and analyze platform usage.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="mb-3 text-sm sm:text-base">
                  We use the information we collect for the following essential
                  purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                  <li>
                    <strong>To Provide and Maintain the Platform:</strong> To
                    operate, secure, and ensure the optimal functionality of
                    TellBrandz.
                  </li>
                  <li>
                    <strong>To Contextualize and Share Feedback:</strong> Your
                    "Tell" Content and your Contextual Data are used to generate
                    the "Contextual Signal" that is shared with brands to hold
                    them accountable and foster a responsive marketplace.
                  </li>
                  <li>
                    <strong>To Facilitate Resolution:</strong> To enable brands
                    to identify and directly engage with users regarding their
                    reviews (where permissible by our Terms of Use).
                  </li>
                  <li>
                    <strong>To Personalize Your Experience:</strong> To tailor
                    content, suggest relevant brands, and provide personalized
                    insights in your "Data & Insights" Dashboard.
                  </li>
                  <li>
                    <strong>For Communication:</strong> To send you
                    service-related notifications, security alerts, and
                    promotional updates (if you have opted in).
                  </li>
                  <li>
                    <strong>For Moderation and Enforcement:</strong> To moderate
                    user-generated content, prevent fraud, and enforce our Terms
                    of Use.
                  </li>
                  <li>
                    <strong>For Analytics and Reporting:</strong> To understand
                    user engagement, analyze market trends, and improve our
                    services and features.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  3. How We Share Your Information
                </h2>
                <p className="mb-3 text-sm sm:text-base">
                  We share your information only as described in this policy,
                  with the following key distinctions:
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  3.1. Publicly Displayed Information
                </h3>
                <p className="mb-4 text-sm sm:text-base">
                  Your "Tell" Content, username, profile picture, and review
                  date are visible to other users and the general public and may
                  be indexed by search engines.
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  3.2. Sharing with Brands (Contextual Data)
                </h3>
                <p className="mb-2 text-sm sm:text-base">
                  When you submit a review, we share the following information
                  with the specific brand being reviewed via our proprietary
                  Brand Dashboard:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-sm sm:text-base">
                  <li>Your "Tell" Content.</li>
                  <li>Your Username.</li>
                  <li>
                    Your Contextual Data (e.g., Age Range, Income Range,
                    Occupation) ONLY if you have explicitly chosen to share it
                    in your "Data & Insights" Dashboard settings.
                  </li>
                </ul>
                <p className="mb-4 text-sm sm:text-base italic">
                  Your email address is NEVER directly shared with the brands.
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  3.3. Service Providers
                </h3>
                <p className="mb-4 text-sm sm:text-base">
                  We engage trusted third-party service providers to perform
                  functions on our behalf, such as cloud hosting, payment
                  processing, analytics, and customer support. These providers
                  are bound by strict contractual obligations to keep your
                  information confidential.
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  3.4. Legal Compliance and Protection
                </h3>
                <p className="text-sm sm:text-base">
                  We may disclose your information if we believe it is required
                  by law, to respond to legal process (like a subpoena), or to
                  protect the rights, property, and safety of TellBrandz, our
                  users, or the public.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  4. Data Security and Retention
                </h2>
                <p className="text-sm sm:text-base">
                  We employ industry-standard technical and organizational
                  security measures designed to protect your personal
                  information. However, no security system is impenetrable. We
                  retain your personal information only as long as necessary to
                  provide you with the service and fulfill the purposes outlined
                  in this policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  5. Your Choices and Advanced Data Rights
                </h2>
                <p className="mb-3 text-sm sm:text-base">
                  As a TellBrandz user, you have{" "}
                  <strong>Advanced Data Rights</strong> accessible via your
                  "Data & Insights" section:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                  <li>
                    <strong>Access and Rectification:</strong> You can access
                    and update your Account and Profile information at any time
                    via your settings.
                  </li>
                  <li>
                    <strong>Data Sharing Control (Opt-In/Out):</strong> You have
                    the right to control which elements of your Contextual Data
                    (e.g., Income Range) are shared with brands. You can modify
                    your preferences at any time in your "Data & Insights"
                    Dashboard.
                  </li>
                  <li>
                    <strong>Data Portability (Right to Export):</strong> You
                    have the right to request a copy of all your personal data
                    and review history. This can be securely exported with one
                    click via your "Data & Insights" Dashboard.
                  </li>
                  <li>
                    <strong>Deletion (Right to be Forgotten):</strong> You can
                    request the deletion of your account and associated personal
                    data. Note that content you have made public may persist as
                    anonymized data after your account is deleted.
                  </li>
                  <li>
                    <strong>Communications Opt-Out:</strong> You can opt-out of
                    receiving promotional and non-essential emails from us via
                    the "unsubscribe" link in the email footer.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  6. Children's Privacy
                </h2>
                <p className="text-sm sm:text-base">
                  TellBrandz is intended for users who are 18 years of age or
                  older. We do not knowingly collect personal information from
                  children under 18. If we become aware that a child under 18
                  has provided us with personal information, we will take steps
                  to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  7. Changes to this Privacy Policy
                </h2>
                <p className="text-sm sm:text-base">
                  We may update this Privacy Policy periodically. We will notify
                  you of any material changes by updating the "Effective Date"
                  at the top of the policy and by providing a prominent
                  notification on our platform or by email.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  8. Contact Us
                </h2>
                <p className="text-sm sm:text-base">
                  If you have any questions about this Privacy Policy or your
                  data rights, please contact us <br/>at:{" "}
                  <a
                    href="mailto:info@tellbrandz.com"
                    className="text-blue-600 hover:text-blue-800 font-semibold break-all"
                  >
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
