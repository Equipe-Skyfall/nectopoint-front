
import React, { useEffect, useState } from 'react';
import api from '../hooks/api';
import useHistorico from '../hooks/useHistorico';

interface Ponto {
    tipo_ponto: string; // "ENTRADA" ou "SAIDA"
    data_hora: string;
}

interface Turno {
    id_colaborador: number;
    nome_colaborador: string;
    id_registro: string;
    inicio_turno: string;
    pontos_marcados: Ponto[];
}

interface ApiResponse {
    content: Turno[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    numberOfElements: number;
    empty: boolean;

interface HistoricoParams {
    page?: number;
    size?: number;
    startDate?: string;
    endDate?: string;
    status_turno?: string;
    id_colaborador?: number;

}

export default function ConteudoHistorico() {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 9;

    const params: HistoricoParams = {
        page: paginaAtual,
        size: itensPorPagina,
    };

    const { historico, erro, totalPaginas } = useHistorico(params);


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
        if (pontos_marcados.length === 0) return 'N/A';
        const ultimoPonto = pontos_marcados[pontos_marcados.length - 1];
        return formatarDataHora(ultimoPonto.data_hora);
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

    return (
        <div className="flex flex-col items-center justify-center p-4 my-8 w-full overflow-y-hidden overflow-x-hidden">
            <h2 className="poppins-semibold text-blue-600 mb-5 my-10">Histórico de Pontos</h2>

            {erro ? (
                <p className="text-red-600">{erro}</p>
            ) : historico.length === 0 ? (
                <p>Nenhum registro encontrado.</p>
            ) : (
                <>
                    <div className="w-[95vw] rounded-md !overflow-x-hidden shadow-md">
                        <table className="w-full border border-gray-300 bg-[#f1f1f1] text-center">
                            <thead>
                                <tr className="bg-blue-800 text-white ">
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Nome</th>
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Status</th>
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Início do Turno</th>
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Fim do Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historico.map((item, index) => (
                                    <tr key={`${item.id_registro}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-1 sm:p-3 poppins text-xs border-r sm:text-base text-black">{item.nome_colaborador}</td>
                                        <td className="p-1 sm:p-3 poppins text-xs border-r sm:text-base text-black">
                                            {traduzirStatusTurno(item.status_turno)}
                                        </td>
                                        <td className="p-1 sm:p-3 poppins text-xs border-r sm:text-base text-black">
                                            {formatarDataHora(item.inicio_turno)}
                                        </td>
                                        <td className="p-1 sm:p-3 poppins text-xs border-r sm:text-base text-black">
                                            {obterFimTurno(item.pontos_marcados)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <div className="mt-6 flex items-center gap-4">
                        <button
                            onClick={retrocederPagina}
                            disabled={paginaAtual === 0}
                            className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${
                                paginaAtual === 0
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
                            onClick={avancarPagina}
                            disabled={paginaAtual === totalPaginas - 1}
                            className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${
                                paginaAtual === totalPaginas - 1
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