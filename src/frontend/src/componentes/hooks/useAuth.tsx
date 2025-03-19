import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';

// Update interfaces to match your actual response
interface UserData {
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  status: string | null;
}

interface JornadaTrabalho {
  tipo_jornada: string;
  banco_de_horas: number;
  horas_diarias: number;
  jornada_atual: {
    batida_atual: string;
    ultima_entrada: string | null;
  };
}

interface LoginResponse {
  id_sessao: string;
  id_colaborador: number;
  dados_usuario: UserData;
  jornada_trabalho: JornadaTrabalho;
  alertas_usuario: any[];
}

// Updated User interface to include jornada_trabalho and alertas_usuario
interface User {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  jornada_trabalho: JornadaTrabalho;
  alertas_usuario: any[];
}

interface LoginCredentials {
  cpf: string;
  password: string;
}

const api = axios.create({
  baseURL: '/', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Check for existing user on hook initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.log(e);
        localStorage.removeItem('user');
      }
    }
  }, []); 

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<LoginResponse>('/usuario/auth', credentials);
      return response;
    },
    onSuccess: (response) => {
      // Handle the response format you shared
      const responseData = response.data;
      
      // Extract user data from the response, including jornada_trabalho and alertas_usuario
      const userData: User = {
        id: responseData.id_colaborador,
        nome: responseData.dados_usuario.nome,
        cpf: responseData.dados_usuario.cpf,
        cargo: responseData.dados_usuario.cargo,
        departamento: responseData.dados_usuario.departamento,
        jornada_trabalho: responseData.jornada_trabalho,
        alertas_usuario: responseData.alertas_usuario
      };
      
      setUser(userData);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Invalidate any queries that depend on authentication
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('sessionAuth');
      
      queryClient.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
};

export default useAuth;