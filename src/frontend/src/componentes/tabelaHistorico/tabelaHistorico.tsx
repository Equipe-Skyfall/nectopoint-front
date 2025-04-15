import React, { useCallback, useEffect, useState } from 'react';
import useHistorico from '../hooks/useHistorico';
import { useQueryClient } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import FiltrosHistorico from '../filtros/filtroHistorico';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

export default function ConteudoHistorico() {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [itensPorPagina, setItensPorPagina] = useState(9);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusTurno, setStatusTurno] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const queryClient = useQueryClient();
    const location = useLocation();

    const atualizarItensPorPagina = useCallback(() => {
        const novosItens = window.innerWidth >= 640 ? 5 : 5;
        if (novosItens !== itensPorPagina) {
            setItensPorPagina(novosItens);
            queryClient.invalidateQueries({ queryKey: ['historico'] });
        }
    }, [itensPorPagina, queryClient]);

    useEffect(() => {
        atualizarItensPorPagina();
        window.addEventListener('resize', atualizarItensPorPagina);
        return () => {
            window.removeEventListener('resize', atualizarItensPorPagina);
        };
    }, [atualizarItensPorPagina]);
    useEffect(() => {
        if (location.state?.statusTurno) {
            setStatusTurno(location.state.statusTurno);
        }
        if (location.state?.startDate) {
            setStartDate(new Date(location.state.startDate));
        }
        if (location.state?.endDate) {
            setEndDate(new Date(location.state.endDate));
        }
    }, [location.state]);
    useEffect(() => {
        setPaginaAtual(0);
    }, [searchQuery, statusTurno, startDate, endDate]);

    const params = {
        page: paginaAtual,
        size: itensPorPagina,
        nome_colaborador: searchQuery,
        lista_status_turno: statusTurno,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
    };

    const { historico, erro, totalPaginas, isLoading } = useHistorico(params);
    
    const formatarDataHora = useCallback((dataHora: string) => {
        const data = new Date(dataHora);
        if (isNaN(data.getTime())) {
            return 'Data inválida';
        }
        return data.toLocaleString('pt-BR');
    }, []);

    const traduzirStatusTurno = useCallback((status: string) => {
        const statusStyles = {
            'TRABALHANDO': { text: 'Trabalhando', color: 'bg-green-100 text-green-800' },
            'INTERVALO': { text: 'Intervalo', color: 'bg-yellow-100 text-yellow-800' },
            'ENCERRADO': { text: 'Encerrado', color: 'bg-blue-100 text-blue-800' },
            'NAO_COMPARECEU': { text: 'Não Compareceu', color: 'bg-red-100 text-red-800' },
            'IRREGULAR': { text: 'Irregular', color: 'bg-purple-100 text-purple-800' }
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]?.color || 'bg-gray-100 text-gray-800'}`}>
                {statusStyles[status]?.text || status}
            </span>
        );
    }, []);

    const obterFimTurno = useCallback((pontos_marcados: { data_hora: string }[]) => {
        if (pontos_marcados?.length > 0) {
            return formatarDataHora(pontos_marcados[pontos_marcados.length - 1].data_hora);
        }
        return 'N/A';
    }, [formatarDataHora]);

    const avancarPagina = useCallback(() => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual(paginaAtual + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [paginaAtual, totalPaginas]);

    const retrocederPagina = useCallback(() => {
        if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [paginaAtual]);

    const limparFiltros = useCallback(() => {
        setSearchQuery('');
        setStatusTurno('');
        setStartDate(null);
        setEndDate(null);
        setPaginaAtual(0);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-4 my-8 w-full overflow-y-hidden overflow-x-hidden"
        >
            <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="overflow-hidden text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent poppins text-center mt-10"
            >
                Histórico de Pontos
            </motion.h2>

            <FiltrosHistorico
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusTurno={statusTurno}
                setStatusTurno={setStatusTurno}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                limparFiltros={limparFiltros}
            />

            {isLoading ? (
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="flex items-center justify-center p-8"
                >
                    <FiRefreshCw className="text-4xl text-blue-600" />
                </motion.div>
            ) : erro ? (
                <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded shadow-lg"
                >
                    <p className="font-medium">{erro}</p>
                </motion.div>
            ) : historico.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pb-96 text-center"
                >
                    <div className="inline-block p-6 bg-white rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum registro encontrado</h3>
                        <p className="text-gray-500">Tente ajustar os filtros ou verifique os dados</p>
                    </div>
                </motion.div>
            ) : (
                <>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-[96vw] sm:w-[75vw] rounded-xl overflow-hidden shadow-2xl border border-gray-100"
                    >
                        <div className="overflow-x-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                                        <th className="p-2 sm:p-4 poppins text-xs sm:text-lg text-center">Nome</th>
                                        <th className="p-2 sm:p-4 poppins text-xs sm:text-lg text-center">Status</th>
                                        <th className="p-2 sm:p-4 poppins text-xs sm:text-lg text-center">Início do Turno</th>
                                        <th className="p-2 sm:p-4 poppins text-xs sm:text-lg text-center">Fim do Turno</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {historico.map((item, index) => (
                                            <motion.tr
                                                key={`${item.id_registro}-${index}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                exit={{ opacity: 0 }}
                                                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            >
                                                <td className="p-2 sm:p-4 poppins text-xs sm:text-base text-gray-800 font-medium">
                                                    {item.nome_colaborador}
                                                </td>
                                                <td className="p-2 sm:p-4 poppins text-xs sm:text-base text-center">
                                                    {traduzirStatusTurno(item.status_turno)}
                                                </td>
                                                <td className="p-2 sm:p-4 poppins text-xs sm:text-base text-center text-gray-600">
                                                    {formatarDataHora(item.inicio_turno)}
                                                </td>
                                                <td className="p-2 sm:p-4 poppins text-xs sm:text-base text-center text-gray-600">
                                                    {obterFimTurno(item.pontos_marcados)}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex items-center gap-6"
                    >
                        <motion.button
                            whileHover={{ scale: paginaAtual === 0 ? 1 : 1.05 }}
                            whileTap={{ scale: paginaAtual === 0 ? 1 : 0.95 }}
                            onClick={retrocederPagina}
                            disabled={paginaAtual === 0}
                            className={`flex items-center px-3 sm:px-6 py-3 rounded-xl transition-all ${paginaAtual === 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                }`}
                        >
                            <FiChevronLeft className="mr-2" />
                            Anterior
                        </motion.button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPaginas }, (_, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                        setPaginaAtual(i);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${paginaAtual === i
                                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {i + 1}
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: paginaAtual === totalPaginas - 1 ? 1 : 1.05 }}
                            whileTap={{ scale: paginaAtual === totalPaginas - 1 ? 1 : 0.95 }}
                            onClick={avancarPagina}
                            disabled={paginaAtual === totalPaginas - 1}
                            className={`flex items-center px-3 sm:px-6 py-3 rounded-xl transition-all ${paginaAtual === totalPaginas - 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                }`}
                        >
                            Próxima
                            <FiChevronRight className="ml-2" />
                        </motion.button>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}