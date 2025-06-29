import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Palette, Shield, Menu, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useApp();

  const navItems = [
    { path: '/', label: 'Gallery', icon: Palette },
    { path: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount },
    { path: '/admin', label: 'Admin', icon: Shield },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-charcoal cursor-pointer font-serif">
              <Palette className="inline-block mr-2 text-elegant-gold" size={24} />
              Atelier
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "default" : "ghost"}
                  className="relative"
                >
                  <item.icon className="mr-2" size={16} />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-elegant-gold text-white text-xs h-5 w-5 flex items-center justify-center p-0">
                      {item.badge}
                    </Badge>
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
