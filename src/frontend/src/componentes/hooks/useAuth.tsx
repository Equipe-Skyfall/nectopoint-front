import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from './axios';

// Definição das interfaces com base no novo JSON
interface UserData {
  nome: string | null; // Nome pode ser null
  cpf: string;
  cargo: string;
  departamento: string;
  status: string | null;
}

interface JornadaTrabalho {
  tipo_jornada: string;
  banco_de_horas: number;
  horas_diarias: number;
}

interface Ponto {
  tipo_ponto: string; // "ENTRADA" ou "SAIDA"
  data_hora: string;
  tempo_entre_pontos: number | null;
}

interface JornadaAtual {
  id_colaborador: number;
  nome_colaborador: string;
  id_registro: string;
  inicio_turno: string;
  status_turno: string;
  tempo_trabalhado_min: number;
  tempo_intervalo_min: number;
  pontos_marcados: Ponto[];
}

interface LoginResponse {
  id_sessao: string;
  id_colaborador: number;
  dados_usuario: UserData;
  jornada_trabalho: JornadaTrabalho;
  jornada_atual: JornadaAtual;
  jornadas_historico: any[];
  jornadas_irregulares: any[];
  alertas_usuario: any[];
}

interface User {
  id: number;
  nome: string | null; // Nome pode ser null
  cpf: string;
  cargo: string;
  departamento: string;
  status: string | null;
  jornada_trabalho: JornadaTrabalho;
  jornada_atual: JornadaAtual;
  alertas_usuario: any[];
}

interface LoginCredentials {
  cpf: string;
  password: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Verifica se há um usuário armazenado no localStorage ao inicializar o hook
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

  // Mutação para o login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<LoginResponse>('/usuario/auth', credentials);
      return response;
    },
    onSuccess: (response) => {
      const responseData = response.data;

      // Extrai os dados do usuário do novo JSON
      const userData: User = {
        id: responseData.id_colaborador,
        nome: responseData.dados_usuario.nome, // Nome pode ser null
        cpf: responseData.dados_usuario.cpf,
        cargo: responseData.dados_usuario.cargo,
        departamento: responseData.dados_usuario.departamento,
        status: responseData.dados_usuario.status, // Status pode ser null
        jornada_trabalho: responseData.jornada_trabalho,
        jornada_atual: responseData.jornada_atual,
        alertas_usuario: responseData.alertas_usuario,
      };

      // Atualiza o estado do usuário
      setUser(userData);

      // Armazena os dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Invalida quaisquer queries que dependam da autenticação
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Função para logout
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('sessionAuth');

      // Limpa o cache de queries
      queryClient.clear();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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