import React, { useCallback, useEffect, useState } from 'react';
import useHistorico from '../hooks/useHistorico';
import { useQueryClient } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import FiltrosHistorico from '../filtros/filtroHistorico';

export default function ConteudoHistorico() {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [itensPorPagina, setItensPorPagina] = useState(9);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusTurno, setStatusTurno] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const queryClient = useQueryClient();

    const atualizarItensPorPagina = useCallback(() => {
        const novosItens = window.innerWidth >= 640 ? 9 : 9;
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

    useEffect(() => {
        console.log('Params atual:', params);
    }, [params]);

    const { historico, erro, totalPaginas, isLoading } = useHistorico(params);
    

    const formatarDataHora = useCallback((dataHora: string) => {
        const data = new Date(dataHora);
        if (isNaN(data.getTime())) {
            return 'Data inválida';
        }
        return data.toLocaleString('pt-BR');
    }, []);

    const traduzirStatusTurno = useCallback((status: string) => {
        switch (status) {
            case 'TRABALHANDO':
                return 'Trabalhando';
            case 'INTERVALO':
                return 'Intervalo';
            case 'ENCERRADO':
                return 'Encerrado';
            case 'NAO_COMPARECEU':
                return 'Não Compareceu';
            case 'IRREGULAR':
                return 'Irregular';
            default:
                return status;
        }
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
        }
    }, [paginaAtual, totalPaginas]);

    const retrocederPagina = useCallback(() => {
        if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
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
        <div className="flex flex-col items-center justify-center p-4 my-8 w-full overflow-y-hidden overflow-x-hidden">
            <h2 className="mb-6 text-2xl font-semibold text-blue-600 poppins text-center mt-10">Histórico de Pontos</h2>

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
                <p>Carregando...</p>
            ) : erro ? (
                <p className="text-red-600">{erro}</p>
            ) : historico.length === 0 ? (
                <p className='pb-96'>Nenhum registro encontrado com os filtros atuais</p>
            ) : (
                <>
                    <div className="w-[95vw] sm:w-[65vw] rounded-md !overflow-x-hidden shadow-md">
                        <table className="w-full border border-gray-300 bg-[#f1f1f1] text-center">
                            <thead>
                                <tr className="bg-blue-700 text-white ">
                                    <th className="p-1 sm:p-2 poppins text-xs sm:text-lg">Nome</th>
                                    <th className="p-1 sm:p-2 poppins text-xs sm:text-lg">Status</th>
                                    <th className="p-1 sm:p-2 poppins text-xs sm:text-lg">Início do Turno</th>
                                    <th className="p-1 sm:p-2 poppins text-xs sm:text-lg">Fim do Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Referencia o item com base no id de registro do colaborador, assim para buscar seu nome se usa item.nome_colaborador por exemplo */}
                                {historico.map((item, index) => (
                                    <tr key={`${item.id_registro}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-1 sm:p-2 poppins text-[0.65rem] border-r sm:text-base text-black">{item.nome_colaborador}</td>
                                        <td className="p-1 sm:p-2 poppins text-[0.65rem] border-r sm:text-base text-black">
                                            {traduzirStatusTurno(item.status_turno)}
                                        </td>
                                        <td className="p-1 sm:p-2 poppins text-[0.65rem] border-r sm:text-base text-black">
                                            {formatarDataHora(item.inicio_turno)}
                                        </td>
                                        <td className="p-1 sm:p-2 poppins text-[0.65rem] border-r sm:text-base text-black">
                                            {obterFimTurno(item.pontos_marcados)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        <button
                            // Faço uso do retrocederPagina e ainda dou um disable para que o botão não seja clicavel caso seja === 0
                            onClick={retrocederPagina}
                            disabled={paginaAtual === 0}
                            className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${paginaAtual === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-800"
                                }`}
                        >
                            Anterior
                        </button>

                        <span className="text-sm md:text-lg poppins text-gray-700">
                            Página {paginaAtual + 1} de {totalPaginas}
                        </span>

                        <button
                            // Faço uso do avancarPagina e ainda dou um disable para que o botão não seja clicavel caso seja === totalPaginas - 1
                            onClick={avancarPagina}
                            disabled={paginaAtual === totalPaginas - 1}
                            className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${paginaAtual === totalPaginas - 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-800"
                                }`}
                        >
                            Próxima
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}