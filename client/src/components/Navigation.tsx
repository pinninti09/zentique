import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Palette, Shield, Menu, X, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useApp();

  const navItems = [
    { path: '/', label: 'Gallery', icon: Palette },
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { path: '/admin', label: 'Admin', icon: Shield },
  ];

  return (
    <nav className="bg-white/98 backdrop-blur-sm shadow-sm border-b border-soft-taupe/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <h1 className="text-2xl font-serif font-light text-rich-brown cursor-pointer flex items-center">
              <div className="w-8 h-8 bg-elegant-gold rounded-md flex items-center justify-center mr-3 group-hover:bg-rich-brown transition-colors duration-200">
                <Palette className="text-white" size={16} />
              </div>
              Atelier
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`relative px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm ${
                    location === item.path 
                      ? "bg-elegant-gold/20 text-rich-brown" 
                      : "text-sophisticated-gray hover:bg-elegant-gold/10 hover:text-rich-brown"
                  }`}
                >
                  <item.icon className="mr-2" size={16} />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="text-elegant-gold font-medium">
                      ({item.badge})
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-2" size={16} />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-2">({item.badge})</span>
                    )}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
