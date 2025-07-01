import { Switch, Route, useLocation, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./components/Navigation";
import PromoBanner from "./components/PromoBanner";
import Gallery from "./pages/Gallery";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import AdminNew from "./pages/AdminNew";
import PaintingDetail from "./pages/PaintingDetail";
import CorporateGifting from "./pages/CorporateGifting";
import NotFound from "@/pages/not-found";

// Gallery footer pages
import About from "./pages/About";
import Artists from "./pages/Artists";
import CustomerCare from "./pages/CustomerCare";
import ShippingInfo from "./pages/ShippingInfo";
import Returns from "./pages/Returns";
import CareInstructions from "./pages/CareInstructions";
import Contact from "./pages/Contact";

// Corporate footer pages
import CorporateSolutions from "./pages/CorporateSolutions";
import BulkOrders from "./pages/BulkOrders";
import CustomBranding from "./pages/CustomBranding";
import Enterprise from "./pages/Enterprise";
import VolumePricing from "./pages/VolumePricing";
import CorporateReturns from "./pages/CorporateReturns";
import Customization from "./pages/Customization";
import AccountManager from "./pages/AccountManager";

function Router() {
  return (
    <Switch>
      <Route path="/corporate" component={CorporateGifting} />
      <Route path="/" component={Gallery} />
      <Route path="/painting/:id" component={PaintingDetail} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/cart" component={Cart} />
      <Route path="/admin" component={AdminNew} />
      
      {/* Gallery footer pages */}
      <Route path="/about" component={About} />
      <Route path="/artists" component={Artists} />
      <Route path="/customer-care" component={CustomerCare} />
      <Route path="/shipping-info" component={ShippingInfo} />
      <Route path="/returns" component={Returns} />
      <Route path="/care-instructions" component={CareInstructions} />
      <Route path="/contact" component={Contact} />
      
      {/* Corporate footer pages */}
      <Route path="/corporate-solutions" component={CorporateSolutions} />
      <Route path="/bulk-orders" component={BulkOrders} />
      <Route path="/custom-branding" component={CustomBranding} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/volume-pricing" component={VolumePricing} />
      <Route path="/corporate-returns" component={CorporateReturns} />
      <Route path="/customization" component={Customization} />
      <Route path="/account-manager" component={AccountManager} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function Footer() {
  const [location] = useLocation();
  const isCorporatePage = location === '/corporate';

  if (isCorporatePage) {
    return (
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-brand text-2xl font-bold mb-4 uppercase tracking-wide text-white">
                <span className="text-elegant-gold">🏢</span> Corporate Gifting
              </h3>
              <p className="text-gray-200 leading-relaxed">
                Elevating business relationships through thoughtfully curated corporate gifts. Making every business gesture meaningful.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2 text-gray-200">
                <li><Link href="/corporate-solutions" className="hover:text-elegant-gold transition-colors">Corporate Solutions</Link></li>
                <li><Link href="/bulk-orders" className="hover:text-elegant-gold transition-colors">Bulk Orders</Link></li>
                <li><Link href="/custom-branding" className="hover:text-elegant-gold transition-colors">Custom Branding</Link></li>
                <li><Link href="/enterprise" className="hover:text-elegant-gold transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Business Support</h4>
              <ul className="space-y-2 text-gray-200">
                <li><Link href="/volume-pricing" className="hover:text-elegant-gold transition-colors">Volume Pricing</Link></li>
                <li><Link href="/corporate-returns" className="hover:text-elegant-gold transition-colors">Corporate Returns</Link></li>
                <li><Link href="/customization" className="hover:text-elegant-gold transition-colors">Customization</Link></li>
                <li><Link href="/account-manager" className="hover:text-elegant-gold transition-colors">Account Manager</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">
                  📷
                </a>
                <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">
                  📘
                </a>
                <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">  
                  🐦
                </a>
                <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">
                  📌
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Corporate Gifting Solutions. All rights reserved. Crafted for meaningful business connections.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Gallery/Art focused footer
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-brand text-2xl font-bold mb-4 uppercase tracking-wide text-white">
              <span className="text-elegant-gold">🎨</span> Atelier
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Curating exceptional art from talented artists worldwide. Each piece tells a unique story.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-200">
              <li><Link href="/" className="hover:text-elegant-gold transition-colors">Gallery</Link></li>
              <li><Link href="/artists" className="hover:text-elegant-gold transition-colors">Artists</Link></li>
              <li><Link href="/about" className="hover:text-elegant-gold transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-elegant-gold transition-colors">Contact</Link></li>
              <li><Link href="/customer-care" className="hover:text-elegant-gold transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Customer Care</h4>
            <ul className="space-y-2 text-gray-200">
              <li><Link href="/shipping-info" className="hover:text-elegant-gold transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-elegant-gold transition-colors">Returns</Link></li>
              <li><Link href="/care-instructions" className="hover:text-elegant-gold transition-colors">Care Instructions</Link></li>
              <li><Link href="/contact" className="hover:text-elegant-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">
                📷
              </a>
              <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">
                📘
              </a>
              <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">  
                🐦
              </a>
              <a href="#" className="text-gray-200 hover:text-elegant-gold transition-colors">
                📌
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Atelier. All rights reserved. Crafted with passion for art lovers.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-warm-cream">
            <PromoBanner />
            <Navigation />
            <Router />
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
