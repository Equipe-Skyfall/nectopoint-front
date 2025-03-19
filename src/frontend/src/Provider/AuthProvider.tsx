/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext } from 'react';
import { UseMutateFunction } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import useAuth from '../componentes/hooks/useAuth';


interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: UseMutateFunction<AxiosResponse<any, any>, Error, any, unknown>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

// Create Auth Context with a proper initial value that matches the type
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const logout = async () => {
    await auth.logout(); 
    sessionStorage.removeItem("sessionAuth"); 
    localStorage.removeItem("sessionAuth"); 
  };
  
  return (
    <AuthContext.Provider value={ {...auth, logout}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};