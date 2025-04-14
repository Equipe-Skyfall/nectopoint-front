// hooks/useSolicitacoes.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Solicitacao {
    id_ticket: string;
    id_colaborador: number;
    nome_colaborador: string;
    cpf_colaborador: string;
    tipo_ticket: 'PEDIR_FERIAS' | 'PEDIR_ABONO' | 'SOLICITAR_FOLGA' | 'SOLICITAR_HORA_EXTRA' | 'CORRECAO_TURNO';
    data_ticket: string;
    status_ticket: string;
    id_gerente: number | null;
    nome_gerente: string | null;
    justificativa: string | null;
    // Campos específicos para cada tipo
    data_inicio_ferias?: string;
    dias_ferias?: number;
    motivo_abono?: 'ATESTADO_MEDICO' | null;
    dias_abono?: string[];
    abono_inicio?: string;
    abono_final?: string;
    data_inicio?: string;
    data_fim?: string;
    data?: string;
    horas?: number;
    data_correcao?: string;
    pontos_anterior?: string[];
    pontos_ajustado?: string[];
    mensagem: string;
}

interface PageData<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

const useSolicitacoes = (page: number, size: number, statusTicket?: string[]) => {
    const [solicitacoes, setSolicitacoes] = useState<PageData<Solicitacao> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSolicitacoes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/tickets/listar', {
                params: {
                    page,
                    size,
                    lista_status_ticket: statusTicket?.join(','),
                },
                paramsSerializer: {
                    indexes: null
                }
            });
            
            const adaptedData: PageData<Solicitacao> = {
                ...response.data,
                content: response.data.content.map((ticket: any) => ({
                    ...ticket,
                    data_ticket: new Date(ticket.data_ticket).toISOString(),
                    data_inicio_ferias: ticket.data_inicio_ferias ? new Date(ticket.data_inicio_ferias).toISOString() : undefined,
                    abono_inicio: ticket.abono_inicio ? new Date(ticket.abono_inicio).toISOString() : undefined,
                    abono_final: ticket.abono_final ? new Date(ticket.abono_final).toISOString() : undefined,
                    data_inicio: ticket.data_inicio ? new Date(ticket.data_inicio).toISOString() : undefined,
                    data_fim: ticket.data_fim ? new Date(ticket.data_fim).toISOString() : undefined,
                    data: ticket.data ? new Date(ticket.data).toISOString() : undefined,
                    data_correcao: ticket.data_correcao ? new Date(ticket.data_correcao).toISOString() : undefined
                }))
            };
            
            setSolicitacoes(adaptedData);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar solicitações');
        } finally {
            setLoading(false);
        }
    };

    const atualizarSolicitacoes = (id_ticket: string) => {
        if (solicitacoes) {
            const novasSolicitacoes = {
                ...solicitacoes,
                content: solicitacoes.content.filter(
                    solicitacao => solicitacao.id_ticket !== id_ticket
                ),
                totalElements: solicitacoes.totalElements - 1,
                numberOfElements: solicitacoes.numberOfElements - 1
            };

            setSolicitacoes(novasSolicitacoes);

            if (novasSolicitacoes.content.length === 0 && page > 0) {
                setPagina(prev => prev - 1);
            }
        }
    };

    const setPagina = (novaPagina: number) => {
        setSolicitacoes(prev => prev ? {
            ...prev,
            number: novaPagina
        } : null);
    };

    useEffect(() => {
        fetchSolicitacoes();
    }, [page, size, statusTicket]);

    return { 
        solicitacoes, 
        loading, 
        error, 
        fetchSolicitacoes, 
        atualizarSolicitacoes,
        setPagina
    };
};

export default useSolicitacoes;