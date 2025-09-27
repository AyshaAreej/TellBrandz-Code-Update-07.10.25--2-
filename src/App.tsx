import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/components/theme-provider';
import { ScrollToTop } from '@/components/ScrollToTop';
import WelcomeOnboarding from '@/components/WelcomeOnboarding';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Guidelines from '@/pages/Guidelines';
import HowItWorks from '@/pages/HowItWorks';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import BrowseStories from '@/components/BrowseStories';
import BrandDirectory from '@/components/BrandDirectory';
import ShareExperience from '@/pages/ShareExperience';
import Dashboard from '@/pages/Dashboard';
import AuthCallback from '@/pages/AuthCallback';
import AuthFormFixed from '@/components/AuthFormFixed';

const App = () => (
  <ThemeProvider defaultTheme="light">
    <AppProvider>
      <Toaster />
      <WelcomeOnboarding />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/guidelines" element={<Guidelines />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/browse-stories" element={<BrowseStories />} />
          <Route path="/brands" element={<BrandDirectory />} />
          <Route path="/share-experience" element={<ShareExperience />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          <Route path="/auth" element={<AuthFormFixed />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </Router>
    </AppProvider>
  </ThemeProvider>
);

export default App;