import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateSessionId } from '@/lib/utils';

interface AppContextType {
  sessionId: string;
  cartCount: number;
  setCartCount: (count: number) => void;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const [cartCount, setCartCount] = useState(0);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);

    const storedAdminToken = localStorage.getItem('adminToken');
    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AppContext.Provider value={{
      sessionId,
      cartCount,
      setCartCount,
      adminToken,
      setAdminToken,
      showToast
    }}>
      {children}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
