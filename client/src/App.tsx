import { Switch, Route, useLocation } from "wouter";
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
import Admin from "./pages/Admin";
import PaintingDetail from "./pages/PaintingDetail";
import CorporateGifting from "./pages/CorporateGifting";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/corporate" component={CorporateGifting} />
      <Route path="/" component={Gallery} />
      <Route path="/painting/:id" component={PaintingDetail} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/cart" component={Cart} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Footer() {
  const [location] = useLocation();
  const isCorporatePage = location === '/corporate';

  if (isCorporatePage) {
    return (
      <footer className="bg-charcoal text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-4">
                <span className="text-elegant-gold">🏢</span> Corporate Gifting
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Elevating business relationships through thoughtfully curated corporate gifts. Making every business gesture meaningful.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Corporate Solutions</a></li>
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Custom Branding</a></li>
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Business Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Volume Pricing</a></li>
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Corporate Returns</a></li>
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Customization</a></li>
                <li><a href="#" className="hover:text-elegant-gold transition-colors">Account Manager</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">
                  📷
                </a>
                <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">  
                  🐦
                </a>
                <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">
                  📌
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Corporate Gifting Solutions. All rights reserved. Crafted for meaningful business connections.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Gallery/Art focused footer
  return (
    <footer className="bg-charcoal text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">
              <span className="text-elegant-gold">🎨</span> Atelier
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Curating exceptional art from talented artists worldwide. Each piece tells a unique story.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Artists</a></li>
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-elegant-gold transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Care Instructions</a></li>
              <li><a href="#" className="hover:text-elegant-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">
                📷
              </a>
              <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">
                📘
              </a>
              <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">  
                🐦
              </a>
              <a href="#" className="text-gray-300 hover:text-elegant-gold transition-colors">
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
