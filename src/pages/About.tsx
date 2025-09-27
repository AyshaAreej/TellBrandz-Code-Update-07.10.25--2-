import React from 'react';
import { Button } from '../components/ui/button';
import { Breadcrumb } from '../components/Breadcrumb';
import { BackToTop } from '../components/BackToTop';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <Breadcrumb />
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Your Voice. Their Accountability. That's TellBrandz.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            We believe in the power of every customer's voice to drive real change. TellBrandz is built on the conviction that transparency and direct communication transform the brand-consumer relationship.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h2>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
              In today's fast-paced world, it's easy for customer feedback to get lost in the noise. We started TellBrandz because we saw a gap: customers had complaints and praises, but often felt unheard, while brands struggled to genuinely understand and act on crucial feedback.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We envisioned a platform where "tells" (your experiences) are more than just reviews – they're a direct line to brands, a catalyst for improvement, and a public record of responsiveness. TellBrandz was born from this vision, a place where every voice truly matters.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Mission</h2>
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <p className="text-base sm:text-lg leading-relaxed">
              To empower consumers to share their authentic brand experiences and to compel brands to listen, respond, and take meaningful action, fostering a culture of accountability and continuous improvement.
            </p>
          </div>
        </section>

        {/* How We're Different */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">How We're Different</h2>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              TellBrandz goes beyond traditional review sites. We don't just host your feedback; we facilitate real-world solutions. Our unique resolution process allows brands to directly engage with customers, make amends, and, with the customer's consent, have negative "tells" marked as resolved – a testament to their commitment to doing better.
            </p>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { title: 'Transparency', desc: 'Openly sharing customer experiences and brand responses.' },
              { title: 'Accountability', desc: 'Holding brands responsible for their actions and promises.' },
              { title: 'Empowerment', desc: 'Giving every customer a powerful voice.' },
              { title: 'Resolution', desc: 'Focusing on constructive outcomes that benefit both parties.' },
              { title: 'Integrity', desc: 'Ensuring the authenticity and fairness of all interactions.' }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-600 mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-700">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Join the Movement</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Be part of a community that's shaping how brands listen and respond. Whether you have a BrandBlast to share or a BrandBeat to celebrate, your voice makes a difference here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Tell Your Story Now
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg w-full sm:w-auto"
            >
              Explore Brands
            </Button>
          </div>
        </section>
      </div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;