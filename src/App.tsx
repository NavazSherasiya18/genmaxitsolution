import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AureliaStoreProvider } from './context/AureliaStoreContext';
import { AzureStoreProvider } from './context/AzureStoreContext';
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
import { AdminLeadsPage } from './pages/AdminLeadsPage';
import { ProjectLiveDetailPage } from './pages/ProjectLiveDetailPage';
import { AureliaHomePage } from './pages/aurelia/AureliaHomePage';
import { AureliaShopPage } from './pages/aurelia/AureliaShopPage';
import { AureliaProductPage } from './pages/aurelia/AureliaProductPage';
import { AureliaWishlistPage } from './pages/aurelia/AureliaWishlistPage';
import { AureliaBagPage } from './pages/aurelia/AureliaBagPage';
import { AureliaCheckoutPage } from './pages/aurelia/AureliaCheckoutPage';
import { AureliaOrderConfirmationPage } from './pages/aurelia/AureliaOrderConfirmationPage';
import { AureliaHousePage } from './pages/aurelia/AureliaHousePage';
import { AzureHomePage } from './pages/azure/AzureHomePage';
import { AzureDestinationsPage } from './pages/azure/AzureDestinationsPage';
import { AzureSearchPage } from './pages/azure/AzureSearchPage';
import { AzureVillaDetailPage } from './pages/azure/AzureVillaDetailPage';
import { AzureSavedVillasPage } from './pages/azure/AzureSavedVillasPage';
import { AzureExperiencesPage } from './pages/azure/AzureExperiencesPage';
import { AzureCheckoutPage } from './pages/azure/AzureCheckoutPage';
import { AzureConfirmationPage } from './pages/azure/AzureConfirmationPage';
import { AzureConciergePage } from './pages/azure/AzureConciergePage';
import { HealthLinkStoreProvider } from './context/HealthLinkStoreContext';
import { HealthLinkPublicPage } from './pages/healthlink/HealthLinkPublicPage';
import { HealthLinkWorkspacePage } from './pages/healthlink/HealthLinkWorkspacePage';
import { HealthLinkPatientPortalPage } from './pages/healthlink/HealthLinkPatientPortalPage';
import { PrimusStoreProvider } from './context/PrimusStoreContext';
import { PrimusPublicPage } from './pages/primus/PrimusPublicPage';
import { PrimusWorkspacePage } from './pages/primus/PrimusWorkspacePage';
import { PrimusAssetProfilePage } from './pages/primus/PrimusAssetProfilePage';
import { PrimusInvestorPortalPage } from './pages/primus/PrimusInvestorPortalPage';
import { AetherStoreProvider } from './context/AetherStoreContext';
import { AetherPublicPage } from './pages/aether/AetherPublicPage';
import { AetherControlTowerPage } from './pages/aether/AetherControlTowerPage';
import { AetherShipmentDetailPage } from './pages/aether/AetherShipmentDetailPage';
import { AetherDriverWorkspacePage } from './pages/aether/AetherDriverWorkspacePage';
import { AetherCustomerPortalPage } from './pages/aether/AetherCustomerPortalPage';
import { GenmaxAiChatbot } from './components/chat/GenmaxAiChatbot';
import { ScrollProgressBar } from './components/ui/ScrollProgressBar';
import { VerifyDetailsModal } from './components/ui/VerifyDetailsModal';

// Scroll to top automatically on route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const isStandaloneProjectRoute =
    location.pathname.startsWith('/project/') || location.pathname.startsWith('/showcase/');

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditDefaultService, setAuditDefaultService] = useState('Free Comprehensive SEO & Website Audit');
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Automatically trigger the "Verify Your Details" popup 5 to 6 seconds after website load (Genmax agency pages only)
  useEffect(() => {
    if (isStandaloneProjectRoute) return;
    const timer = setTimeout(() => {
      setIsVerifyModalOpen(true);
    }, 5500); // 5.5 seconds

    return () => clearTimeout(timer);
  }, [isStandaloneProjectRoute]);

  const handleOpenAudit = (serviceName?: string) => {
    if (serviceName) {
      setAuditDefaultService(serviceName);
    }
    setIsAuditModalOpen(true);
  };

  const handleOpenVerify = () => {
    setIsVerifyModalOpen(true);
  };

  return (
    <>
      <ScrollToTop />
      {/* Slim, gradient-colored scroll progress bar tracking page depth (Genmax agency pages only) */}
      {!isStandaloneProjectRoute && <ScrollProgressBar />}

      <div className={
        isStandaloneProjectRoute
          ? 'min-h-screen flex flex-col'
          : 'min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-200 transition-colors duration-300'
      }>
        
        {/* Google Maps Platform Quota Defense Banner (Tier 2 Notification) */}
        {!isStandaloneProjectRoute && gmpQuotaExceeded && (
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

        {/* Sticky Header (Genmax agency routes only) */}
        {!isStandaloneProjectRoute && (
          <Navbar onOpenAudit={() => handleOpenAudit()} onOpenVerify={handleOpenVerify} />
        )}

        {/* Main Routed Content */}
        <main className="flex-1">
          <AetherStoreProvider>
            <PrimusStoreProvider>
              <HealthLinkStoreProvider>
                <AzureStoreProvider>
                  <AureliaStoreProvider>
                    <Routes>
                      <Route path="/" element={<HomePage onOpenAudit={handleOpenAudit} />} />
                      <Route path="/about" element={<AboutPage onOpenAudit={() => handleOpenAudit()} />} />
                      <Route path="/services" element={<ServicesHubPage onOpenAudit={handleOpenAudit} />} />
                      <Route path="/services/:slug" element={<ServiceDetailPage onOpenAudit={handleOpenAudit} />} />
                      <Route path="/portfolio" element={<PortfolioPage onOpenAudit={handleOpenAudit} />} />
                      <Route path="/project/aurelia-luxury-ecommerce" element={<Navigate to="/showcase/aurelia" replace />} />
                      <Route path="/project/azure-escapes-travel" element={<Navigate to="/showcase/azure-escapes" replace />} />
                      <Route path="/project/healthlink-telemedicine-saas" element={<Navigate to="/showcase/healthlink" replace />} />
                      <Route path="/project/primus-capital-wealth" element={<Navigate to="/showcase/primus-capital" replace />} />
                      <Route path="/project/aether-fleet-logistics" element={<Navigate to="/showcase/aether-fleet" replace />} />
                      <Route path="/project/:slug" element={<ProjectLiveDetailPage onOpenAudit={() => handleOpenAudit()} />} />

                {/* Aurélia & Co. Multi-Page Concept Store */}
                <Route path="/showcase/aurelia" element={<AureliaHomePage />} />
                <Route path="/showcase/aurelia/shop" element={<AureliaShopPage />} />
                <Route path="/showcase/aurelia/collections/:collectionSlug" element={<AureliaShopPage />} />
                <Route path="/showcase/aurelia/search" element={<AureliaShopPage />} />
                <Route path="/showcase/aurelia/product/:slug" element={<AureliaProductPage />} />
                <Route path="/showcase/aurelia/wishlist" element={<AureliaWishlistPage />} />
                <Route path="/showcase/aurelia/bag" element={<AureliaBagPage />} />
                <Route path="/showcase/aurelia/checkout" element={<AureliaCheckoutPage />} />
                <Route path="/showcase/aurelia/order-confirmation" element={<AureliaOrderConfirmationPage />} />
                <Route path="/showcase/aurelia/house" element={<AureliaHousePage />} />

                {/* Azure Escapes Luxury Coastal Villas Showcase */}
                <Route path="/showcase/azure-escapes" element={<AzureHomePage />} />
                <Route path="/showcase/azure-escapes/destinations/:destination" element={<AzureDestinationsPage />} />
                <Route path="/showcase/azure-escapes/villas" element={<AzureSearchPage />} />
                <Route path="/showcase/azure-escapes/search" element={<AzureSearchPage />} />
                <Route path="/showcase/azure-escapes/villas/:slug" element={<AzureVillaDetailPage />} />
                <Route path="/showcase/azure-escapes/saved" element={<AzureSavedVillasPage />} />
                <Route path="/showcase/azure-escapes/experiences" element={<AzureExperiencesPage />} />
                <Route path="/showcase/azure-escapes/reserve" element={<AzureCheckoutPage />} />
                <Route path="/showcase/azure-escapes/confirmation" element={<AzureConfirmationPage />} />
                <Route path="/showcase/azure-escapes/concierge" element={<AzureConciergePage />} />

                {/* HealthLink Clinical Operations & Patient Portal Showcase */}
                <Route path="/showcase/healthlink" element={<HealthLinkPublicPage />} />
                <Route path="/showcase/healthlink/app" element={<HealthLinkWorkspacePage />} />
                <Route path="/showcase/healthlink/app/:role" element={<HealthLinkWorkspacePage />} />
                <Route path="/showcase/healthlink/portal" element={<HealthLinkPatientPortalPage />} />
                <Route path="/showcase/healthlink/portal/:tab" element={<HealthLinkPatientPortalPage />} />

                {/* Primus Capital Institutional Real Estate Showcase */}
                <Route path="/showcase/primus-capital" element={<PrimusPublicPage />} />
                <Route path="/showcase/primus-capital/app" element={<PrimusWorkspacePage />} />
                <Route path="/showcase/primus-capital/app/:module" element={<PrimusWorkspacePage />} />
                <Route path="/showcase/primus-capital/assets/:slug" element={<PrimusAssetProfilePage />} />
                <Route path="/showcase/primus-capital/portal" element={<PrimusInvestorPortalPage />} />
                <Route path="/showcase/primus-capital/portal/:tab" element={<PrimusInvestorPortalPage />} />

                {/* Aether Fleet IoT Logistics & Cold-Chain Showcase */}
                <Route path="/showcase/aether-fleet" element={<AetherPublicPage />} />
                <Route path="/showcase/aether-fleet/app" element={<AetherControlTowerPage />} />
                <Route path="/showcase/aether-fleet/app/:module" element={<AetherControlTowerPage />} />
                <Route path="/showcase/aether-fleet/shipments/:code" element={<AetherShipmentDetailPage />} />
                <Route path="/showcase/aether-fleet/driver" element={<AetherDriverWorkspacePage />} />
                <Route path="/showcase/aether-fleet/track" element={<AetherCustomerPortalPage />} />
                <Route path="/showcase/aether-fleet/track/:trackingCode" element={<AetherCustomerPortalPage />} />

                <Route path="/solutions-and-plans" element={<PricingPage onOpenAudit={() => handleOpenAudit()} />} />
                <Route path="/pricing" element={<PricingPage onOpenAudit={() => handleOpenAudit()} />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage onOpenAudit={() => handleOpenAudit()} />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin/leads" element={<AdminLeadsPage />} />
                <Route path="/admin" element={<AdminLeadsPage />} />
                {/* Fallback to Home */}
                <Route path="*" element={<HomePage onOpenAudit={handleOpenAudit} />} />
                    </Routes>
                  </AureliaStoreProvider>
                </AzureStoreProvider>
              </HealthLinkStoreProvider>
            </PrimusStoreProvider>
          </AetherStoreProvider>
        </main>

        {/* Luxurious Footer (Genmax agency routes only) */}
        {!isStandaloneProjectRoute && <Footer onOpenVerify={handleOpenVerify} />}

        {/* Floating controls share a layer behind open navigation. */}
        {!isStandaloneProjectRoute && (
          <div className="site-floating-controls contents">
            <FloatingActions />
            <GenmaxAiChatbot onOpenAudit={handleOpenAudit} />
          </div>
        )}

        {/* Themed "Verify Your Details" Popup with Duplicate Email Prevention & Company Email Dispatch */}
        {!isStandaloneProjectRoute && (
          <VerifyDetailsModal
            isOpen={isVerifyModalOpen}
            onClose={() => setIsVerifyModalOpen(false)}
          />
        )}

        {/* Global Free Consultation & SEO Audit Modal */}
        <FreeAuditModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          defaultService={auditDefaultService}
        />
      </div>
    </>
  );
}

function MainApp() {
  return (
    <Router>
      <AppLayout />
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
