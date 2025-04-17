// hooks/useSolicitacoes.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Solicitacao {
    id_ticket: string;
    id_colaborador: number;
    nome_colaborador: string;
    cpf_colaborador: string;
    tipo_ticket: string;
    data_ticket: string;
    status_ticket: string;
    id_gerente: number | null;
    nome_gerente: string | null;
    justificativa: string | null;
    horario_saida: string | null;
    inicio_intervalo: string | null;
    fim_intervalo: string | null;
    data_inicio_ferias: string | null;
    dias_ferias: number | null;
    motivo_abono: string | null;
    dias_abono: string[] | null;
    abono_inicio: string | null;
    abono_final: string | null;
    mensagem: string;
    id_registro: number | null;
    id_aviso: number | null;
}

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

interface UseSolicitacoesParams {
    page: number;
    size: number;
    statusTicket?: string[];
    startDate?: Date | null;
    endDate?: Date | null;
}


const useSolicitacoes = ({ page, size, statusTicket, startDate, endDate }: UseSolicitacoesParams) => {
    const [solicitacoes, setSolicitacoes] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSolicitacoes = async () => {
        setLoading(true);
        setError(null);
        try {

            const params: any = {
                page,
                size,
                lista_status: statusTicket?.join(','),
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString()
            };

            const response = await axios.get('/tickets/listar', {
                params,
                paramsSerializer: {
                    indexes: null
                },
                withCredentials: true,
            });

            setSolicitacoes(response.data);
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar solicitações');
        } finally {
            setLoading(false);
        }
    };

    const atualizarSolicitacoes = (id_ticket: string) => {
        if (solicitacoes) {
            const novasSolicitacoes = solicitacoes.content.filter(
                (solicitacao) => solicitacao.id_ticket !== id_ticket
            );

            setSolicitacoes({
                ...solicitacoes,
                content: novasSolicitacoes,
                totalElements: solicitacoes.totalElements - 1,
                numberOfElements: novasSolicitacoes.length,
            });

            if (novasSolicitacoes.length === 0 && page > 0) {
                fetchSolicitacoes();
            }
        }
    };

    useEffect(() => {
        fetchSolicitacoes();
    }, [page, size, statusTicket,  startDate, endDate]);

    return { solicitacoes, loading, error, fetchSolicitacoes, atualizarSolicitacoes };
};

export default useSolicitacoes;