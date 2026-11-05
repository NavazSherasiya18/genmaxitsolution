import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingActions } from './components/layout/FloatingWhatsApp';
import { FreeAuditModal } from './components/ui/FreeAuditModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesHubPage } from './pages/ServicesHubPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { GenmaxAiChatbot } from './components/chat/GenmaxAiChatbot';

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainApp() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditDefaultService, setAuditDefaultService] = useState('Free Comprehensive SEO & Website Audit');
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  const handleOpenAudit = (serviceName?: string) => {
    if (serviceName) {
      setAuditDefaultService(serviceName);
    }
    setIsAuditModalOpen(true);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors duration-300">
        
        {/* Google Maps Platform Quota Defense Banner (Tier 2 Notification) */}
        {gmpQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Sticky Header */}
        <Navbar onOpenAudit={() => handleOpenAudit()} />

        {/* Main Routed Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/about" element={<AboutPage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/services" element={<ServicesHubPage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/services/:slug" element={<ServiceDetailPage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/portfolio" element={<PortfolioPage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/pricing" element={<PricingPage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage onOpenAudit={() => handleOpenAudit()} />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<HomePage onOpenAudit={() => handleOpenAudit()} />} />
          </Routes>
        </main>

        {/* Luxurious Footer */}
        <Footer />

        {/* Floating Quick WhatsApp and Scroll-To-Top Controls */}
        <FloatingActions />

        {/* Gemini AI Consultant Multi-Turn Chatbot */}
        <GenmaxAiChatbot onOpenAudit={handleOpenAudit} />

        {/* Global Free Consultation & SEO Audit Modal */}
        <FreeAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          defaultService={auditDefaultService}
        />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
