import { useState, useCallback, useMemo, useEffect, JSX } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

// Interfaces e Tipos
export interface HistoricoJornada {
    data: string;
    inicioTurno: string;
    fimTurno: string;
    statusTurno: JSX.Element;
    statusText: string;
    pontos: Array<{ tipo: string; horario: string; dataOriginal: Date }>;
    idRegistro: string;
}

interface UserData {
    id_colaborador: number;
    nome: string;
    cpf: string;
    dados_usuario?: { status: string };
    jornadas_historico?: any[];
    jornadas_irregulares?: any[];
}

export enum StatusTurno {
    ENCERRADO = 'ENCERRADO',
    NAO_COMPARECEU = 'NAO_COMPARECEU',
    IRREGULAR = 'IRREGULAR',
}

interface HistoricoJornadasParams {
    itensPorPagina?: number;
    initialStatusTurno?: string;
    initialStartDate?: Date | null;
    initialEndDate?: Date | null;
}

interface HistoricoJornadasResponse {
    historicoJornadas: HistoricoJornada[];
    dadosOriginais: HistoricoJornada[];
    carregando: boolean;
    erro: string | null;
    paginaAtual: number;
    itensPorPagina: number;
    statusTurno: string;
    startDate: Date | null;
    endDate: Date | null;
    isExporting: boolean;
    exportError: string | null;
    modalAberto: boolean;
    jornadaSelecionada: HistoricoJornada | null;
    userData: UserData | null;
    totalPaginas: number;
    buscarHistoricoJornadas: () => void;
    limparFiltros: () => void;
    exportarParaPDF: () => void;
    enviarCorrecao: (pontosAjustados: Array<{ tipo: string; horario: string }>) => Promise<void>;
    obterItensPaginaAtual: () => HistoricoJornada[];
    setPaginaAtual: (page: number) => void;
    setStatusTurno: (status: string) => void;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    setModalAberto: (open: boolean) => void;
    setJornadaSelecionada: (jornada: HistoricoJornada | null) => void;
}


// Hook personalizado para gerenciar o histórico de jornadas do funcionário.
// @param params Configurações iniciais para o hook.
// @returns Objeto com estados e funções para gerenciar o histórico de jornadas.

export default function useHistoricoJornadas({
    itensPorPagina = 8,
    initialStatusTurno = '',
    initialStartDate = null,
    initialEndDate = null,
}: HistoricoJornadasParams = {}): HistoricoJornadasResponse {
    const [dadosOriginais, setDadosOriginais] = useState<HistoricoJornada[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [itensPorPaginaState, setItensPorPagina] = useState(itensPorPagina);
    const [statusTurno, setStatusTurno] = useState<string>(initialStatusTurno);
    const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [jornadaSelecionada, setJornadaSelecionada] = useState<HistoricoJornada | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);


    // Formata o status do turno para exibição.
    // @param status Status do turno.
    // @returns Objeto com componente JSX e texto do status.

    const formatarStatus = useCallback((status: string, temAbono?: boolean) => {
        const statusStyles = {
            [StatusTurno.ENCERRADO]: {
                text: 'Encerrado',
                shortText: 'Encerrado',
                color: 'bg-green-100 text-green-800',
            },
            [StatusTurno.NAO_COMPARECEU]: {
                text: temAbono ? 'Abonado' : 'Não Compareceu',
                shortText: temAbono ? 'Abonado' : 'N/Compareceu',
                color: temAbono ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            },
            [StatusTurno.IRREGULAR]: {
                text: 'Irregular',
                shortText: 'Irregular',
                color: 'bg-yellow-100 text-yellow-800',
            },
            default: { text: status, shortText: status, color: 'bg-gray-100 text-gray-800' },
        };
        const style = statusStyles[status as StatusTurno] || statusStyles.default;

        return {
            component: (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.color}`}>
                    <span className="hidden sm:inline">{style.text}</span>
                    <span className="sm:hidden">{style.shortText}</span>
                </span>
            ),
            text: style.text,
        };
    }, []);


    // Formata uma jornada bruta em um objeto HistoricoJornada.
    // @param jornada Dados brutos da jornada.
    // @returns Jornada formatada.

    const formatarJornada = useCallback(
        (jornada: any): HistoricoJornada => {
            const dataInicio = new Date(jornada.inicio_turno);
            const dataFim = jornada.fim_turno ? new Date(jornada.fim_turno) : null;
            const temAbono = !!jornada.abono;

            const pontosFormatados = jornada.pontos_marcados?.map((ponto: any) => ({
                tipo: ponto.tipo_ponto === 'ENTRADA' ? 'Entrada' : 'Saída',
                horario: new Date(ponto.data_hora).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                dataOriginal: new Date(ponto.data_hora),
            })) || [];

            return {
                data: dataInicio.toLocaleDateString('pt-BR'),
                inicioTurno: dataInicio.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                fimTurno: temAbono ? 'Abonado' :
                    (dataFim
                        ? dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        : 'N/A'),
                statusTurno: formatarStatus(jornada.status_turno, temAbono).component,
                statusText: formatarStatus(jornada.status_turno, temAbono).text,
                pontos: pontosFormatados,
                idRegistro: jornada.id_registro,
            };
        },
        [formatarStatus],
    );


    // Busca o histórico de jornadas do usuário no localStorage.

    const buscarHistoricoJornadas = useCallback(() => {
        try {
            setCarregando(true);
            setErro(null);

            const userDataString = localStorage.getItem('user');
            if (!userDataString) {
                throw new Error('Nenhum dado de usuário encontrado no localStorage.');
            }

            const parsedUserData: UserData = JSON.parse(userDataString);
            setUserData(parsedUserData);

            const historicoFormatado = parsedUserData.jornadas_historico?.map(formatarJornada) || [];
            const irregularFormatado = parsedUserData.jornadas_irregulares?.map(formatarJornada) || [];

            const todosRegistros = [...historicoFormatado, ...irregularFormatado].sort((a, b) =>
                b.data.split('/').reverse().join('-').localeCompare(a.data.split('/').reverse().join('-')),
            );

            setDadosOriginais(todosRegistros);
        } catch (error) {
            console.error('Erro ao processar dados:', error);
            setErro('Erro ao carregar o histórico. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    }, [formatarJornada]);


    // Filtra as jornadas com base nos filtros selecionados.

    const historicoJornadas = useMemo(() => {
        return dadosOriginais.filter((jornada) => {
            const statusMatch =
                !statusTurno ||
                (statusTurno === StatusTurno.ENCERRADO && jornada.statusText === 'Encerrado') ||
                (statusTurno === StatusTurno.NAO_COMPARECEU && jornada.statusText === 'Não Compareceu') ||
                (statusTurno === StatusTurno.IRREGULAR && jornada.statusText === 'Irregular');

            const [dia, mes, ano] = jornada.data.split('/');
            const dataJornada = new Date(`${ano}-${mes}-${dia}`);
            dataJornada.setHours(0, 0, 0, 0);

            const start = startDate ? new Date(startDate) : null;
            if (start) start.setHours(0, 0, 0, 0);

            const end = endDate ? new Date(endDate) : null;
            if (end) end.setHours(23, 59, 59, 999);

            const dataMatch = (!start || dataJornada >= start) && (!end || dataJornada <= end);

            return statusMatch && dataMatch;
        });
    }, [dadosOriginais, statusTurno, startDate, endDate]);


    // Obtém os itens da página atual para exibição.

    const obterItensPaginaAtual = useCallback(() => {
        const inicio = paginaAtual * itensPorPaginaState;
        const fim = inicio + itensPorPaginaState;
        return historicoJornadas.slice(inicio, fim);
    }, [historicoJornadas, paginaAtual, itensPorPaginaState]);


    // Calcula o número total de páginas.

    const totalPaginas = useMemo(
        () => Math.ceil(historicoJornadas.length / itensPorPaginaState),
        [historicoJornadas, itensPorPaginaState],
    );


    // Limpa todos os filtros e redefine a página.

    const limparFiltros = useCallback(() => {
        setStatusTurno('');
        setStartDate(null);
        setEndDate(null);
        setPaginaAtual(0);
    }, []);


    // Exporta o histórico de jornadas para PDF.

    const exportarParaPDF = useCallback(() => {
        setIsExporting(true);
        setExportError(null);

        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Histórico de Jornadas', 14, 22);
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

            let filtersText = 'Filtros aplicados: ';
            if (statusTurno) filtersText += `Status: ${statusTurno}, `;
            if (startDate) filtersText += `Data inicial: ${startDate.toLocaleDateString('pt-BR')}, `;
            if (endDate) filtersText += `Data final: ${endDate.toLocaleDateString('pt-BR')}, `;

            if (filtersText !== 'Filtros aplicados: ') {
                doc.setFontSize(10);
                doc.text(filtersText.slice(0, -2), 14, 38);
            }

            const dadosTabela = historicoJornadas.map((jornada) => [
                jornada.data,
                jornada.inicioTurno,
                jornada.fimTurno,
                jornada.statusText,
            ]);

            autoTable(doc, {
                head: [['Data', 'Início', 'Fim', 'Status']],
                body: dadosTabela,
                startY: 45,
                styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
                headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [240, 240, 240] },
            });

            doc.save(`historico_jornadas_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            setExportError('Erro ao gerar o PDF. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    }, [historicoJornadas, statusTurno, startDate, endDate]);


    //Envia solicitação de correção de pontos para a API.
    //@param pontosAjustados Lista de pontos ajustados.

    const enviarCorrecao = useCallback(
        async (pontosAjustados: Array<{ tipo: string; horario: string }>) => {
            try {
                if (!jornadaSelecionada || !userData?.id_colaborador) {
                    throw new Error('Dados incompletos para enviar a solicitação');
                }

                const formatarPontos = (ponto: { tipo: string; horario: string }) => {
                    const [hours, minutes] = ponto.horario.split(':');
                    const data = new Date(jornadaSelecionada.data.split('/').reverse().join('-'));
                    data.setHours(parseInt(hours));
                    data.setMinutes(parseInt(minutes));

                    return {
                        tipo_ponto: ponto.tipo === 'Entrada' ? 'ENTRADA' : 'SAIDA',
                        data_hora: data.toISOString(),
                    };
                };

                const ticketData = {
                    tipo_ticket: 'ALTERAR_PONTOS',
                    pontos_anterior: jornadaSelecionada.pontos.map(formatarPontos),
                    pontos_ajustado: pontosAjustados.map(formatarPontos),
                    id_registro: jornadaSelecionada.idRegistro,
                    mensagem: `Solicitação de correção para ${jornadaSelecionada.data}`,
                    status_usuario: userData.dados_usuario?.status || 'ATIVO',
                    id_colaborador: userData.id_colaborador,
                    nome_colaborador: userData.nome,
                    cpf_colaborador: userData.cpf,
                };

                const formData = new FormData();
                const ticketBlob = new Blob([JSON.stringify(ticketData)], { type: 'application/json' });
                formData.append('ticket', ticketBlob, 'ticket.json');

                if (process.env.NODE_ENV === 'development') {
                    console.log('Enviando solicitação:', {
                        ticket: ticketData,
                        formData: Array.from(formData.entries()),
                    });
                }

                const response = await axios.post('http://localhost:3000/tickets/postar', formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 30000,
                    maxContentLength: 100 * 1024 * 1024,
                    maxBodyLength: 100 * 1024 * 1024,
                });

                if (response.status === 200) {
                    setModalAberto(false);
                    buscarHistoricoJornadas();
                }
            } catch (error: any) {
                console.error('Erro detalhado:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });

                const errorMsg =
                    error.response?.data?.message ||
                    (error.response?.status === 403
                        ? 'Acesso negado. Verifique se está logado.'
                        : 'Erro ao enviar solicitação');

                alert(errorMsg);
            }
        },
        [jornadaSelecionada, userData, buscarHistoricoJornadas],
    );

    // Carrega os dados iniciais
    useEffect(() => {
        buscarHistoricoJornadas();
    }, [buscarHistoricoJornadas]);

    return {
        historicoJornadas,
        dadosOriginais,
        carregando,
        erro,
        paginaAtual,
        itensPorPagina: itensPorPaginaState,
        statusTurno,
        startDate,
        endDate,
        isExporting,
        exportError,
        modalAberto,
        jornadaSelecionada,
        userData,
        totalPaginas,
        buscarHistoricoJornadas,
        limparFiltros,
        exportarParaPDF,
        enviarCorrecao,
        obterItensPaginaAtual,
        setPaginaAtual,
        setStatusTurno,
        setStartDate,
        setEndDate,
        setModalAberto,
        setJornadaSelecionada,
    };
}