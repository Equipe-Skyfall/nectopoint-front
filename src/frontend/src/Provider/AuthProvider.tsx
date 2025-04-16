import React, { createContext, useContext } from 'react';

import SessaoUsuario from '../interfaces/interfaceSessaoUsuario';
import useAuth from '../componentes/hooks/useAuth';

interface AuthContextType {
  user: SessaoUsuario | null;
  isAuthenticated: boolean;
  login: (credentials: { cpf: string; password: string }, options?: any) => void;
  verifyCode: (verification: { userId: string; verificationCode: string }, options?: any) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: any;
  isSuccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};