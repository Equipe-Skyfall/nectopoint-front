import { useState, useEffect, useCallback, useMemo } from 'react';

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

interface UseHistoricoSolicitacoesParams {
    ticketsUsuario: Solicitacao[];
    page: number;
    size: number;
    statusTicket?: TicketStatus[];
    startDate?: Date | null;
    endDate?: Date | null;
    tipoTicket?: TicketType;
}

const useHistoricoSolicitacoes = ({
    ticketsUsuario,
    page,
    size,
    statusTicket,
    startDate,
    endDate,
    tipoTicket
}: UseHistoricoSolicitacoesParams) => {
    const [loading, setLoading] = useState(false);

    // Formata uma data ISO para o padrão brasileiro (dd/mm/aaaa hh:mm)
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

    // Formata uma lista de dias de abono para exibição
    const formatarDiasAbono = useCallback((dias: string[] | null | undefined) => {
        if (!dias || dias.length === 0) return null;
        return dias.map(dia => formatarDataBrasil(dia)).join(', ');
    }, [formatarDataBrasil]);

    // Converte o status do ticket para um formato legível
    const formatarStatus = useCallback((status: string): string => {
        return status.replace(/_/g, ' ');
    }, []);

    // Traduz o tipo de ticket para uma descrição amigável
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

    // Formata o motivo do abono para exibição
    const formatarMotivoAbono = useCallback((motivo: AbsenceReason): string => {
        if (!motivo) return '';
        switch (motivo) {
            case 'ATESTADO_MEDICO': return 'Atestado Médico';
            default: return motivo;
        }
    }, []);

    // Gera a URL para download de um arquivo associado ao ticket
    const getFileDownloadUrl = useCallback((ticketId: string): string => {
        return `http://localhost:3000/tickets/files/${ticketId}`;
    }, []);

    // Filtra e pagina os tickets do usuário
    const solicitacoesFiltradas = useMemo(() => {
        if (!ticketsUsuario || ticketsUsuario.length === 0) {
            return {
                content: [],
                totalPages: 0,
                totalElements: 0,
                size,
                number: page,
                first: true,
                last: true,
                empty: true
            };
        }

        let ticketsFiltrados = [...ticketsUsuario];

        // Filtro por status
        if (statusTicket && statusTicket.length > 0) {
            ticketsFiltrados = ticketsFiltrados.filter(ticket => 
                statusTicket.includes(ticket.status_ticket)
            );
        }

        // Filtro por tipo de ticket
        if (tipoTicket) {
            ticketsFiltrados = ticketsFiltrados.filter(ticket => 
                ticket.tipo_ticket === tipoTicket
            );
        }

        // Filtro por data de início
        if (startDate) {
            ticketsFiltrados = ticketsFiltrados.filter(ticket => {
                const dataTicket = new Date(ticket.data_ticket);
                return dataTicket >= startDate;
            });
        }

        // Filtro por data de fim
        if (endDate) {
            ticketsFiltrados = ticketsFiltrados.filter(ticket => {
                const dataTicket = new Date(ticket.data_ticket);
                return dataTicket <= endDate;
            });
        }

        // Ordenar por data mais recente
        ticketsFiltrados.sort((a, b) => 
            new Date(b.data_ticket).getTime() - new Date(a.data_ticket).getTime()
        );

        // Paginação
        const totalElements = ticketsFiltrados.length;
        const totalPages = Math.ceil(totalElements / size);
        const startIndex = page * size;
        const endIndex = startIndex + size;
        const content = ticketsFiltrados.slice(startIndex, endIndex);

        return {
            content,
            totalPages,
            totalElements,
            size,
            number: page,
            first: page === 0,
            last: page >= totalPages - 1,
            empty: content.length === 0
        };
    }, [ticketsUsuario, page, size, statusTicket, startDate, endDate, tipoTicket]);

    // Busca os detalhes de um ticket específico pelo ID (do array local)
    const fetchTicketDetails = useCallback((id: string) => {
        const ticket = ticketsUsuario.find(t => t.id_ticket === id);
        if (!ticket) {
            throw new Error('Ticket não encontrado');
        }
        return Promise.resolve(ticket);
    }, [ticketsUsuario]);

    // Função para abrir modal de detalhes (apenas visualização)
    const abrirModalDetalhes = useCallback(async (
        ticket: Solicitacao,
        setTicketDetalhado: (ticket: Solicitacao | null) => void,
        setLoadingModal: (loading: boolean) => void,
        setModalAberto: (ticket: Solicitacao | null) => void
    ) => {
        console.log(ticket)
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

    // Alterna a inclusão/exclusão de um status nos filtros
    const toggleFiltroStatus = useCallback((status: TicketStatus, setFiltroStatus: (f: TicketStatus[] | ((prev: TicketStatus[]) => TicketStatus[])) => void, setPagina: (p: number) => void) => {
        setFiltroStatus(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
        setPagina(0);
    }, []);

    // Limpa os filtros de data e reseta a página
    const limparFiltros = useCallback((setStartDate: (date: Date | null) => void, setEndDate: (date: Date | null) => void, setPagina: (p: number) => void) => {
        setStartDate(null);
        setEndDate(null);
        setPagina(0);
    }, []);

    return {
        solicitacoes: solicitacoesFiltradas,
        loading,
        error: null,
        fetchTicketDetails,
        formatarDataBrasil,
        formatarDiasAbono,
        formatarStatus,
        formatarTipoTicket,
        formatarMotivoAbono,
        abrirModalDetalhes,
        toggleFiltroStatus,
        limparFiltros,
        getFileDownloadUrl
    };
};

export default useHistoricoSolicitacoes;