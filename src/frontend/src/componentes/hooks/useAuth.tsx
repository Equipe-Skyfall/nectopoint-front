import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from './api';
import SessaoUsuario from '../../interfaces/interfaceSessaoUsuario';

interface LoginCredentials {
  cpf: string;
  password: string;
}

interface VerificationCredentials {
  userId: string;
  verificationCode: string;
}

const useAuth = () => {
  const [user, setUser] = useState<SessaoUsuario | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erro ao analisar usuário do localStorage:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Mutation para o primeiro passo de login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      try {
        // Ensure credentials are properly formatted
        const formattedCredentials = {
          cpf: credentials.cpf.replace(/\D/g, ""),
          password: credentials.password.trim()
        };
        
        const response = await api.post('/usuario/auth', formattedCredentials);
        return response;
      } catch (error) {
        console.error('Erro na autenticação:', error);
        // Log detailed error information
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
        throw error;
      }
    }
  });

  // Mutation para o segundo passo de verificação
  const verifyMutation = useMutation({
    mutationFn: async (verification: VerificationCredentials) => {
      try {
        const response = await api.post<SessaoUsuario>('/usuario/verify', verification);
        return response;
      } catch (error) {
        console.error('Erro na verificação:', error);
        throw error;
      }
    },
    onSuccess: (response) => {
      const responseData = response.data;

      // Verificando se os dados esperados estão presentes
      if (!responseData || !responseData.dados_usuario) {
        console.error('Resposta de verificação incompleta:', responseData);
        throw new Error('Dados de usuário incompletos na resposta');
      }

      const userData: SessaoUsuario = {
        id_sessao: responseData.id_sessao,
        id_colaborador: responseData.id_colaborador,
        dados_usuario: {
            nome: responseData.dados_usuario.nome,
            cpf: responseData.dados_usuario.cpf,
            cargo: responseData.dados_usuario.cargo,
            departamento: responseData.dados_usuario.departamento,
            status: responseData.dados_usuario.status,
        },
        jornada_trabalho: responseData.jornada_trabalho,
        jornada_atual: responseData.jornada_atual,
        alertas_usuario: responseData.alertas_usuario,
        jornadas_historico: responseData.jornadas_historico,
        jornadas_irregulares: responseData.jornadas_irregulares,
        tickets_usuario: responseData.tickets_usuario,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Erro após verificação:', error);
    }
  });

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('sessionAuth');
      queryClient.clear();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    verifyCode: verifyMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || verifyMutation.isPending,
    error: loginMutation.error || verifyMutation.error,
    isSuccess: loginMutation.isSuccess || verifyMutation.isSuccess,
  };
};

export default useAuth;