import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import api from './api';
import SessaoUsuario from '../../interfaces/interfaceSessaoUsuario';


interface UserData {
  nome: string | null; 
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
  tipo_ponto: string; 
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
  nome: string | null; 
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


  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<SessaoUsuario>('/usuario/auth', credentials);
      return response;
    },
    onSuccess: (response) => {
      const responseData = response.data;


      const userData: SessaoUsuario = {
        id_sessao: responseData.id_sessao, // Corrected to match 'id_sessao'
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
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    isSuccess: loginMutation.isSuccess,
  };
};

export default useAuth;
export type { User };