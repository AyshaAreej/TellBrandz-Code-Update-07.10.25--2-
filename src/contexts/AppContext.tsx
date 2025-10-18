import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type ViewType = 'home' | 'tell-form' | 'auth' | 'profile' | 'admin';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  user: any;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const { user, loading, signUp, signIn, signOut } = useAuth();

  // Auto-navigate to home when user logs in
  React.useEffect(() => {
    if (user && currentView === 'auth') {
      setCurrentView('home');
    }
  }, [user, currentView]);

  const logout = async () => {
    await signOut();
    setCurrentView('home');
  };

  const value = {
    currentView,
    setCurrentView,
    user,
    loading,
    signUp,
    signIn,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
