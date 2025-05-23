import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiRefreshCw, FiFilter, FiX, FiUpload } from 'react-icons/fi';
import FiltrosHistoricoFunc from '../filtros/filtroHistoricoFunc';
import { HistoricoJornada } from '../../interfaces/interfaceHistoricoFunc';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';



export default function ConteudoHistoricoFunc() {
    const [dadosOriginais, setDadosOriginais] = useState<HistoricoJornada[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [itensPorPagina, setItensPorPagina] = useState(8);
    const [statusTurno, setStatusTurno] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // Filtra os dados com base nos filtros selecionados
    const historicoJornadas = useMemo(() => {
        return dadosOriginais.filter(jornada => {
            // Filtro por status
            const statusMatch = !statusTurno ||
                (statusTurno === 'ENCERRADO' && (jornada as any).statusText === 'Encerrado') ||
                (statusTurno === 'NAO_COMPARECEU' && (jornada as any).statusText === 'Não Compareceu') ||
                (statusTurno === 'IRREGULAR' && (jornada as any).statusText === 'Irregular');

            // Filtro por data
            const [dia, mes, ano] = jornada.data.split('/');
            const dataJornada = new Date(`${ano}-${mes}-${dia}`);
            dataJornada.setHours(0, 0, 0, 0); // Normaliza para início do dia

            const start = startDate ? new Date(startDate) : null;
            if (start) start.setHours(0, 0, 0, 0);

            const end = endDate ? new Date(endDate) : null;
            if (end) end.setHours(23, 59, 59, 999);

            const dataMatch = (!start || dataJornada >= start) &&
                (!end || dataJornada <= end);

            return statusMatch && dataMatch;
        });
    }, [dadosOriginais, statusTurno, startDate, endDate]);


    const buscarHistoricoJornadas = () => {
        try {
            setCarregando(true);
            setErro(null);

            const userDataString = localStorage.getItem('user');
            if (!userDataString) {
                setErro('Nenhum dado de usuário encontrado no localStorage.');
                return;
            }

            const userData = JSON.parse(userDataString);

            const formatarJornada = (jornada: any) => {
                const dataInicio = new Date(jornada.inicio_turno);
                const dataFim = jornada.fim_turno ? new Date(jornada.fim_turno) : null;

                const pontosFormatados = jornada.pontos_marcados?.map((ponto: any) => ({
                    tipo: ponto.tipo_ponto === 'ENTRADA' ? 'Entrada' : 'Saída',
                    horario: new Date(ponto.data_hora).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                })) || [];

                return {
                    data: dataInicio.toLocaleDateString('pt-BR'),
                    inicioTurno: dataInicio.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    fimTurno: dataFim ? dataFim.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'N/A',
                    statusTurno: formatarStatus(jornada.status_turno).component,
                    statusText: formatarStatus(jornada.status_turno).text,
                    pontos: pontosFormatados,
                    dataOriginal: dataInicio
                };
            };

            const formatarStatus = (status: string) => {
                const statusStyles = {
                    'ENCERRADO': { text: 'Encerrado', shortText: 'Encerrado', color: 'bg-green-100 text-green-800' },
                    'NAO_COMPARECEU': { text: 'Não Compareceu', shortText: 'N/Compareceu', color: 'bg-red-100 text-red-800' },
                    'IRREGULAR': { text: 'Irregular', shortText: 'Encerrado', color: 'bg-yellow-100 text-yellow-800' },
                    default: { text: status, shortText: status, color: 'bg-gray-100 text-gray-800' }
                };
                const style = statusStyles[status] || statusStyles.default;

                return {
                    component: (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.color}`}>
                            {/* Texto completo em telas médias para cima */}
                            <span className="hidden sm:inline">{style.text}</span>
                            {/* Texto abreviado em telas pequenas */}
                            <span className="sm:hidden">{style.shortText}</span>
                        </span>
                    ),
                    text: style.text
                }
            };

            const historicoFormatado = userData.jornadas_historico?.map(formatarJornada) || [];
            const irregularFormatado = userData.jornadas_irregulares?.map(formatarJornada) || [];

            const todosRegistros = [...historicoFormatado, ...irregularFormatado]
                .sort((a, b) => b.dataOriginal.getTime() - a.dataOriginal.getTime())
                .map(({ dataOriginal, ...rest }) => rest);

            setDadosOriginais(todosRegistros);
        } catch (error) {
            console.error('Erro ao processar dados:', error);
            setErro('Erro ao carregar o histórico. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };
    const limparFiltros = useCallback(() => {
        setStatusTurno('');
        setStartDate(null);
        setEndDate(null);
        setPaginaAtual(0);
    }, []);
    useEffect(() => {
        buscarHistoricoJornadas();
    }, []);

    const totalPaginas = Math.ceil(historicoJornadas.length / itensPorPagina);
    const obterItensPaginaAtual = () => {
        const inicio = paginaAtual * itensPorPagina;
        const fim = inicio + itensPorPagina;
        return historicoJornadas.slice(inicio, fim);
    };

    const PaginationControls = () => {
        const maxVisibleButtons = 5; // Máximo de botões numéricos visíveis

        // Calcula quais botões mostrar
        const getVisiblePages = () => {
            let startPage = Math.max(0, paginaAtual - Math.floor(maxVisibleButtons / 2));
            let endPage = startPage + maxVisibleButtons - 1;

            if (endPage >= totalPaginas - 1) {
                endPage = totalPaginas - 1;
                startPage = Math.max(0, endPage - maxVisibleButtons + 1);
            }

            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
        };

        const visiblePages = getVisiblePages();


        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex sm:flex-row items-center justify-center sm:gap-4 gap-2 w-full"
            >
                {/* Botão Anterior */}
                <motion.button
                    whileHover={{ scale: paginaAtual === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: paginaAtual === 0 ? 1 : 0.95 }}
                    onClick={() => {
                        if (paginaAtual > 0) {
                            setPaginaAtual(paginaAtual - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    disabled={paginaAtual === 0}
                    className={`flex items-center text-sm sm:text-base px-4 py-2 rounded-lg ${paginaAtual === 0
                        ? "bg-gray-200 text-gray-500 border-gray-500 border cursor-not-allowed"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                        }`}
                >
                    <FiChevronLeft className="mr-1" />
                    Anterior
                </motion.button>

                {/* Botões numéricos (limitados a 5) */}
                <div className="flex items-center gap-2">
                    {visiblePages.map((page) => (
                        <motion.button
                            key={page}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setPaginaAtual(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`sm:w-10 h-9 w-5 sm:h-10 rounded-full flex items-center justify-center text-sm ${paginaAtual === page
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {page + 1}
                        </motion.button>
                    ))}
                </div>

                {/* Botão Próximo */}
                <motion.button
                    whileHover={{ scale: paginaAtual === totalPaginas - 1 ? 1 : 1.05 }}
                    whileTap={{ scale: paginaAtual === totalPaginas - 1 ? 1 : 0.95 }}
                    onClick={() => {
                        if (paginaAtual < totalPaginas - 1) {
                            setPaginaAtual(paginaAtual + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    disabled={paginaAtual === totalPaginas - 1}
                    className={`flex items-center  text-sm sm:text-base px-4 py-2 rounded-lg ${paginaAtual === totalPaginas - 1
                        ? "bg-gray-200 text-gray-500 border-gray-500 border cursor-not-allowed"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                        }`}
                >
                    Próxima
                    <FiChevronRight className="ml-1" />
                </motion.button>
            </motion.div>
        );
    };

    const exportarParaPDF = () => {
        setIsExporting(true);
        setExportError(null);

        try {
            // Cria o documento PDF
            const doc = new jsPDF();

            // Configura o cabeçalho
            doc.setFontSize(18);
            doc.text('Histórico de Jornadas', 14, 22);
            doc.setFontSize(12);
            doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 30);

            // Adiciona informações de filtros
            let filtersText = 'Filtros aplicados: ';
            if (statusTurno) filtersText += `Status: ${statusTurno}, `;
            if (startDate) filtersText += `Data inicial: ${startDate.toLocaleDateString('pt-BR')}, `;
            if (endDate) filtersText += `Data final: ${endDate.toLocaleDateString('pt-BR')}, `;

            if (filtersText !== 'Filtros aplicados: ') {
                doc.setFontSize(10);
                doc.text(filtersText.slice(0, -2), 14, 38);
            }

            // Função para extrair o texto do status
            // Prepara os dados da tabela
            const dadosTabela = historicoJornadas.map(jornada => [
                jornada.data,
                jornada.inicioTurno,
                jornada.fimTurno,
                (jornada as any).statusText
            ]);

            // Adiciona a tabela ao PDF
            autoTable(doc, {
                head: [['Data', 'Início', 'Fim', 'Status']],
                body: dadosTabela,
                startY: 45,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                    halign: 'center'
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [240, 240, 240]
                }
            });

            // Salva o PDF
            doc.save(`historico_jornadas_${new Date().toISOString().slice(0, 10)}.pdf`);

        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            setExportError('Erro ao gerar o PDF. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-4 my-8 w-full poppins"
        >
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 text-3xl mt-10 poppins-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
            >
                Histórico de Jornadas
            </motion.h2>
            <FiltrosHistoricoFunc
                statusTurno={statusTurno}
                setStatusTurno={setStatusTurno}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                limparFiltros={limparFiltros}
            />
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportarParaPDF}
                disabled={isExporting || historicoJornadas.length === 0}
                className="flex items-center bg-gradient-to-r mb-3 -mt-3 from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
                {isExporting ? (
                    <FiRefreshCw className="animate-spin mr-2" />
                ) : (
                    <FiUpload />
                )}
                {isExporting ? 'Exportando...' : ''}
            </motion.button>

            {exportError && (
                <div className="mt-2 text-red-600 text-sm">
                    {exportError}
                </div>
            )}
            {erro ? (
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg shadow-md"
                >
                    <p className="font-medium">{erro}</p>
                </motion.div>
            ) : carregando ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="flex justify-center p-12"
                >
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                </motion.div>
            ) : historicoJornadas.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                >
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Nenhuma jornada registrada
                        </h3>
                        <p className="text-gray-600">
                            Seu histórico de jornadas aparecerá aqui quando disponível
                        </p>
                    </div>
                </motion.div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="sm:w-full w-[95vw] max-w-4xl rounded-xl overflow-hidden shadow-lg border border-gray-100"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                        <th className="p-4 text-center font-medium">Data</th>
                                        <th className="p-4 text-center font-medium">Início</th>
                                        <th className="p-4 text-center font-medium">Fim</th>
                                        <th className="p-4 text-center font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {obterItensPaginaAtual().map((jornada, index) => (
                                            <motion.tr
                                                key={`${jornada.data}-${index}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            >
                                                <td className="p-2sm:p-4 text-sm font-medium text-gray-800">
                                                    {jornada.data}
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-center text-gray-600">
                                                    {jornada.inicioTurno}
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-center text-gray-600">
                                                    {jornada.fimTurno}
                                                </td>
                                                <td className="p-2 sm:p-4 text-center">
                                                    {jornada.statusTurno}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {totalPaginas >= 1 && <PaginationControls />}

                </>
            )}
        </motion.div>
    );
}