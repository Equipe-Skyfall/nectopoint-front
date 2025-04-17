import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

export type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO';
export type AbsenceReason = 'ATESTADO_MEDICO' | null;

export interface BaseTicket {
  id_ticket: string;
  id_colaborador: number;
  nome_colaborador: string;
  cpf_colaborador: string;
  tipo_ticket: TicketType;
  mensagem: string;
  status_ticket: TicketStatus;
  data_ticket: string;
  aviso_atrelado?: string;
}

export interface VacationTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_FERIAS';
  data_inicio_ferias?: string;
  dias_ferias?: number;
}

export interface AbsenceTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_ABONO';
  motivo_abono: AbsenceReason;
  dias_abono?: string[];
  abono_inicio?: string;
  abono_final?: string;
}

export type Solicitacao = VacationTicket | AbsenceTicket;

export const TicketStatus = {
  EM_AGUARDO: 'EM_AGUARDO',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
} as const;

export type TicketStatus = keyof typeof TicketStatus;

interface PageData {
  content: Solicitacao[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ResponsePayload {
  novo_status: TicketStatus;
  justificativa?: string;
  ticket: Solicitacao;
}

const useSolicitacoes = (page: number, size: number, statusTicket?: TicketStatus[]) => {
  const [solicitacoes, setSolicitacoes] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);
  const [justificativa, setJustificativa] = useState('');
  const [mostrarJustificativa, setMostrarJustificativa] = useState(false);
  const [loadingResposta, setLoadingResposta] = useState(false);

  // Funções de formatação
  const formatarData = useCallback((dataUTC: string | null | undefined): string => {
    return dataUTC ? new Date(dataUTC).toLocaleDateString('pt-BR') : 'Não informado';
  }, []);

  const formatarStatus = useCallback((status: string): string => {
    return status.replace(/_/g, ' ');
  }, []);

  const formatarTipoTicket = useCallback((tipo: TicketType): string => {
    return tipo === 'PEDIR_FERIAS' ? 'Férias' : 'Abono';
  }, []);

  const formatarMotivoAbono = useCallback((motivo: AbsenceReason): string => {
    if (!motivo) return '';
    return motivo === 'ATESTADO_MEDICO' ? 'Atestado Médico' : motivo;
  }, []);

  // Busca principal
  const fetchSolicitacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<PageData>('/tickets/listar', {
        params: {
          page,
          size,
          lista_status_ticket: statusTicket?.join(','),
        },
        paramsSerializer: { indexes: null },
        withCredentials: true,
      });
      setSolicitacoes(response.data);
    } catch (err) {
      const error = err as AxiosError;
      setError(error.message || 'Erro ao buscar solicitações');
    } finally {
      setLoading(false);
    }
  }, [page, size, statusTicket]);

  // Atualização da lista
  const atualizarSolicitacoes = useCallback((id_ticket: string) => {
    setSolicitacoes(prev => {
      if (!prev) return prev;
      
      const novasSolicitacoes = prev.content.filter(
        solicitacao => solicitacao.id_ticket !== id_ticket
      );

      return {
        ...prev,
        content: novasSolicitacoes,
        totalElements: prev.totalElements - 1,
        numberOfElements: novasSolicitacoes.length,
      };
    });
  }, []);

  // Envio de resposta
  const enviarResposta = useCallback(async (status_novo: TicketStatus) => {
    if (!modalAberto) return;

    if (status_novo === 'REPROVADO' && !justificativa.trim()) {
      throw new Error('Por favor, insira uma justificativa para reprovar a solicitação.');
    }

    setLoadingResposta(true);
    try {
      const payload: ResponsePayload = {
        novo_status: status_novo,
        ...(status_novo === 'REPROVADO' && { justificativa }),
        ticket: { ...modalAberto, status_ticket: status_novo }
      };

      await axios.post('/tickets/responder', payload);
      await fetchSolicitacoes();
      return true;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      throw new Error(error.response?.data?.message || 'Erro ao enviar resposta');
    } finally {
      setLoadingResposta(false);
    }
  }, [modalAberto, justificativa, fetchSolicitacoes]);

  useEffect(() => {
    fetchSolicitacoes();
  }, [fetchSolicitacoes]);

  return {
    // Estado
    solicitacoes,
    loading,
    error,
    modalAberto,
    justificativa,
    mostrarJustificativa,
    loadingResposta,

    // Setters
    setModalAberto,
    setJustificativa,
    setMostrarJustificativa,

    // Funções
    fetchSolicitacoes,
    atualizarSolicitacoes,
    enviarResposta,

    // Formatadores
    formatarData,
    formatarStatus,
    formatarTipoTicket,
    formatarMotivoAbono
  };
};

export default useSolicitacoes;