import React, { createContext, useContext, useEffect, useState } from 'react';

import SessaoUsuario from '../interfaces/interfaceSessaoUsuario';
import useAuth from '../componentes/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../componentes/hooks/api';
import { SessionExpiredModal } from '../componentes/conteudoPaginas/login/conexaoExpiradaModal';

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
  const navigate = useNavigate();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    // Interceptor de resposta para lidar com erros 403
    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 403) {
          setShowSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );

    // Função para verificar a sessão do usuário
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, navigate]);
  const handleSessionExpiredClose = () => {
    setShowSessionExpired(false);
    auth.logout();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
      <SessionExpiredModal 
        isOpen={showSessionExpired}
        onClose={handleSessionExpiredClose}
      />
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};