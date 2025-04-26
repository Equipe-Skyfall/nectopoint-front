import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type TicketStatus = 'EM_AGUARDO' | 'APROVADO' | 'REPROVADO';
type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO' | 'PEDIR_HORA_EXTRA' | 'SOLICITAR_FOLGA' | 'ALTERAR_PONTOS';
type AbsenceReason = 'ATESTADO_MEDICO' | null;

interface Solicitacao {
    id_ticket: string;
    id_colaborador: number;
    nome_colaborador: string;
    cpf_colaborador: string;
    tipo_ticket: TicketType;
    data_ticket: string;
    status_ticket: TicketStatus;
    mensagem: string;
    id_gerente?: number | null;
    nome_gerente?: string | null;
    justificativa?: string | null;
    data_inicio_ferias?: string;
    dias_ferias?: number;
    motivo_abono?: AbsenceReason;
    dias_abono?: string[];
    id_registro?: string;
    id_aviso?: string;
    pontos_anterior?: any[];
    pontos_ajustado?: any[];
    lista_horas?: string[];
    filePath?: string;
}

interface PageData {
    content: Solicitacao[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

interface ResponsePayload {
    novo_status: TicketStatus;
    justificativa?: string;
    ticket: Solicitacao;
}

interface UseSolicitacoesParams {
    page: number;
    size: number;
    statusTicket?: TicketStatus[];
    startDate?: Date | null;
    endDate?: Date | null;
    tipoTicket?: TicketType;
    nomeColaborador?: string;
}

const useSolicitacoes = ({
    page,
    size,
    statusTicket,
    startDate,
    endDate,
    tipoTicket,
    nomeColaborador
}: UseSolicitacoesParams) => {
    const [solicitacoes, setSolicitacoes] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatarDataBrasil = useCallback((dataISO: string) => {
        if (!dataISO) return 'Não informado';
        const data = new Date(dataISO);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const formatarDiasAbono = useCallback((dias: string[] | null | undefined) => {
        if (!dias || dias.length === 0) return null;
        return dias.map(dia => formatarDataBrasil(dia)).join(', ');
    }, [formatarDataBrasil]);

    const formatarStatus = useCallback((status: string): string => {
        return status.replace(/_/g, ' ');
    }, []);

    const formatarTipoTicket = useCallback((tipo: TicketType): string => {
        switch (tipo) {
            case 'PEDIR_FERIAS': return 'Férias';
            case 'PEDIR_ABONO': return 'Abono';
            case 'PEDIR_HORA_EXTRA': return 'Hora Extra';
            case 'SOLICITAR_FOLGA': return 'Folga';
            case 'ALTERAR_PONTOS': return 'Ajuste de Pontos';
            default: return tipo;
        }
    }, []);

    const formatarMotivoAbono = useCallback((motivo: AbsenceReason): string => {
        if (!motivo) return '';
        switch (motivo) {
            case 'ATESTADO_MEDICO': return 'Atestado Médico';
            default: return motivo;
        }
    }, []);

    const podeAprovarOuReprovar = useCallback((status: TicketStatus) => {
        return status === 'EM_AGUARDO';
    }, []);

    const getFileDownloadUrl = useCallback((ticketId: string): string => {
        return `http://localhost:3000/tickets/files/${ticketId}`;
    }, []);

    const checkFileAccessibility = useCallback(async (ticketId: string): Promise<void> => {
        try {
            const response = await axios.head(`http://localhost:3000/tickets/files/${ticketId}`, {
                withCredentials: true
            });

            if (response.status !== 200) {
                throw new Error('Arquivo não encontrado.');
            }
        } catch (err: any) {
            console.error('Erro ao verificar arquivo:', err);
            const errorMessage = err.response?.status === 404
                ? 'Arquivo não encontrado no servidor.'
                : err.response?.status === 403
                    ? 'Acesso ao arquivo negado. Verifique suas permissões.'
                    : 'Não foi possível acessar o arquivo. Tente novamente.';
            throw new Error(errorMessage);
        }
    }, []);

    const fetchSolicitacoes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());

            if (statusTicket && statusTicket.length > 0) {
                statusTicket.forEach(status => params.append('lista_status', status));
            }

            if (startDate) {
                params.append('startDate', startDate.toISOString());
            }

            if (endDate) {
                params.append('endDate', endDate.toISOString());
            }

            if (tipoTicket) {
                params.append('tipo_ticket', tipoTicket);
            }

            if (nomeColaborador) {
                params.append('nome_colaborador', nomeColaborador);
            }

            const response = await axios.get<PageData>('http://localhost:3000/tickets/listar', {
                params,
                withCredentials: true
            });

            setSolicitacoes(response.data);
        } catch (err: any) {
            console.error('Erro ao buscar solicitações:', err);
            setError(err.response?.data?.message || err.message || 'Erro ao buscar solicitações');
        } finally {
            setLoading(false);
        }
    }, [page, size, statusTicket, startDate, endDate, tipoTicket, nomeColaborador]);

    const fetchTicketDetails = useCallback(async (id: string) => {
        try {
            const response = await axios.get<Solicitacao>(`http://localhost:3000/tickets/${id}`, {
                withCredentials: true
            });

            if (response.data.filePath && !response.data.filePath.startsWith('uploads/tickets/')) {
                console.warn('Formato inválido de filePath:', response.data.filePath);
                response.data.filePath = `uploads/tickets/${response.data.filePath.split('/').pop()}`;
            }

            return response.data;
        } catch (err: any) {
            console.error('Erro ao buscar detalhes do ticket:', err);
            throw err;
        }
    }, []);

    const atualizarSolicitacoes = useCallback(async (id_ticket: string) => {
        setSolicitacoes(prev => {
            if (!prev) return prev;

            const newContent = prev.content.filter(t => t.id_ticket !== id_ticket);
            const newTotalElements = prev.totalElements - 1;

            return {
                ...prev,
                content: newContent,
                totalElements: newTotalElements
            };
        });

        try {
            await fetchSolicitacoes();
        } catch (err) {
            console.error('Erro ao atualizar solicitações:', err);
        }
    }, [fetchSolicitacoes]);

    const abrirModalDetalhes = useCallback(async (
        ticket: Solicitacao,
        setTicketDetalhado: (ticket: Solicitacao | null) => void,
        setLoadingModal: (loading: boolean) => void,
        setModalAberto: (ticket: Solicitacao | null) => void
    ) => {
        try {
            setLoadingModal(true);
            const detalhes = await fetchTicketDetails(ticket.id_ticket);
            setTicketDetalhado(detalhes);
            setModalAberto(ticket);
        } catch (error) {
            console.error("Erro ao carregar detalhes do ticket:", error);
            alert("Não foi possível carregar os detalhes do ticket");
        } finally {
            setLoadingModal(false);
        }
    }, [fetchTicketDetails]);

    const enviarResposta = useCallback(async (
        status_novo: TicketStatus,
        ticketDetalhado: Solicitacao | null,
        justificativa: string,
        setModalAberto: (ticket: Solicitacao | null) => void,
        setJustificativa: (value: string) => void,
        setMostrarJustificativa: (value: boolean) => void
    ) => {
        if (!ticketDetalhado) return;

        if (status_novo === 'REPROVADO' && !justificativa.trim()) {
            alert('Por favor, insira uma justificativa para reprovar a solicitação.');
            return;
        }

        try {
            const payload: ResponsePayload = {
                novo_status: status_novo,
                ...(status_novo === 'REPROVADO' && { justificativa: justificativa.trim() }),
                ticket: ticketDetalhado
            };

            const response = await axios.post('http://localhost:3000/tickets/responder', payload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                await atualizarSolicitacoes(ticketDetalhado.id_ticket);
                setModalAberto(null);
                setJustificativa('');
                setMostrarJustificativa(false);
            }
        } catch (error) {
            console.error('Erro ao enviar resposta:', error);
            if (axios.isAxiosError(error)) {
                alert(`Erro: ${error.response?.data?.message || error.message}`);
            }
        }
    }, [atualizarSolicitacoes]);

    const toggleFiltroStatus = useCallback((status: TicketStatus, setFiltroStatus: (f: TicketStatus[] | ((prev: TicketStatus[]) => TicketStatus[])) => void, setPagina: (p: number) => void) => {
        setFiltroStatus(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
        setPagina(0);
    }, []);

    const limparFiltros = useCallback((setStartDate: (date: Date | null) => void, setEndDate: (date: Date | null) => void, setPagina: (p: number) => void) => {
        setStartDate(null);
        setEndDate(null);
        setPagina(0);
    }, []);

    useEffect(() => {
        fetchSolicitacoes();
    }, [fetchSolicitacoes]);

    return {
        solicitacoes,
        loading,
        error,
        fetchSolicitacoes,
        fetchTicketDetails,
        atualizarSolicitacoes,
        formatarDataBrasil,
        formatarDiasAbono,
        formatarStatus,
        formatarTipoTicket,
        formatarMotivoAbono,
        podeAprovarOuReprovar,
        abrirModalDetalhes,
        enviarResposta,
        toggleFiltroStatus,
        limparFiltros,
        getFileDownloadUrl,
        checkFileAccessibility
    };
};

export default useSolicitacoes;