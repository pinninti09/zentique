import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Palette, Shield, Menu, X, Heart, Building2, LogIn, LogOut, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useApp();
  
  // Authentication state
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check for stored user data on mount
    const checkUserAuth = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUserAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkUserAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when user state changes in same tab
    const handleUserChange = () => {
      checkUserAuth();
    };
    
    window.addEventListener('userStateChanged', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChanged', handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMobileMenuOpen(false);
    
    // Dispatch custom event to update navigation state
    window.dispatchEvent(new CustomEvent('userStateChanged'));
    
    // Redirect to home page
    window.location.href = "/";
  };

  const navItems = [
    { path: '/corporate', label: 'Corporate Gifting', icon: Building2, isBrand: true },
    { path: '/', label: 'Gallery', icon: Palette, isBrand: true },
    { path: '/wishlist', label: 'Wishlist', icon: Heart, isBrand: true },
    { path: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined, isBrand: true },
  ];

  return (
    <nav className="bg-white/98 backdrop-blur-sm shadow-sm border-b border-soft-taupe/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <h1 className="text-2xl font-brand font-semibold text-rich-brown cursor-pointer flex items-center uppercase tracking-wide">
              <div className="w-8 h-8 bg-elegant-gold rounded-md flex items-center justify-center mr-3 group-hover:bg-rich-brown transition-colors duration-200">
                <Palette className="text-white" size={16} />
              </div>
              Zentique
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
                  } ${item.isBrand ? "font-brand font-semibold uppercase tracking-wide" : ""}`}
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
            
            {/* Authentication Controls */}
            {user ? (
              <div className="flex items-center space-x-2 ml-4">
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sophisticated-gray hover:text-rich-brown"
                    >
                      <Shield className="mr-1" size={14} />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sophisticated-gray hover:text-rich-brown cursor-default"
                  disabled
                >
                  <User className="mr-1" size={14} />
                  {user.username}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-sophisticated-gray hover:text-rich-brown"
                  title="Logout"
                >
                  <LogOut size={14} />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sophisticated-gray hover:text-rich-brown ml-4"
                >
                  <LogIn className="mr-1" size={14} />
                  Login
                </Button>
              </Link>
            )}
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
                    className={`w-full justify-start relative ${item.isBrand ? "font-brand font-semibold uppercase tracking-wide" : ""}`}
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
              
              {/* Mobile Authentication Controls */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {user ? (
                  <div className="space-y-2">
                    {user.role === 'admin' && (
                      <Link href="/admin">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Shield className="mr-2" size={16} />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <div className="px-3 py-2 text-sm text-sophisticated-gray flex items-center">
                      <User className="mr-2" size={14} />
                      {user.username}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2" size={16} />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="mr-2" size={16} />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
