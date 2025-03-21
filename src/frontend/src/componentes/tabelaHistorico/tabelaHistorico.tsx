import React, { useEffect, useState } from 'react';
import api from '../hooks/axios';

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
}

export default function ConteudoHistorico() {
    const [historico, setHistorico] = useState<Array<Ponto & { id_colaborador: number; nome_colaborador: string; status_turno: string }>>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 9;

    // Busca o histórico de pontos
    const buscarHistorico = async () => {
        try {
            setCarregando(true);
            setErro(null);

            const response = await api.get<ApiResponse>('/turno/historico');

            if (response.data && Array.isArray(response.data.content)) {
                // Combina todos os pontos de todos os turnos
                const todosPontos = response.data.content.flatMap((turno) =>
                    turno.pontos_marcados.map((ponto) => ({
                        ...ponto,
                        id_colaborador: turno.id_colaborador,
                        nome_colaborador: turno.nome_colaborador,
                    }))
                );

                // Ordena os pontos por data_hora em ordem decrescente
                todosPontos.sort((a, b) => {
                    const dataA = new Date(a.data_hora).getTime();
                    const dataB = new Date(b.data_hora).getTime();
                    return dataB - dataA; // Ordem decrescente
                });

                setHistorico(todosPontos);
            } else {
                setErro('Dados inválidos recebidos da API. A estrutura não é a esperada.');
            }
        } catch (error) {
            setErro('Erro ao carregar o histórico. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarHistorico();
    }, []);

    // Formata a data e hora para o formato brasileiro
    const formatarDataHora = (dataHora: string) => {
        const data = new Date(dataHora);
        return data.toLocaleString('pt-BR');
    };

    // Calcula o total de páginas
    const totalPaginas = Math.ceil(historico.length / itensPorPagina);

    // Obtém os itens da página atual
    const obterItensPaginaAtual = () => {
        const inicio = paginaAtual * itensPorPagina;
        const fim = inicio + itensPorPagina;
        return historico.slice(inicio, fim);
    };

    // Avança para a próxima página
    const avancarPagina = () => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    // Retrocede para a página anterior
    const retrocederPagina = () => {
        if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 my-8 w-full overflow-y-hidden overflow-x-hidden">
            <h2 className="poppins-semibold text-blue-600 mb-5 my-10">Histórico de Pontos</h2>

            {erro ? (
                <p className="text-red-600">{erro}</p>
            ) : carregando ? (
                <p>Carregando...</p>
            ) : historico.length === 0 ? (
                <p>Nenhum registro encontrado.</p>
            ) : (
                <>
                    <div className="w-[95vw] rounded-md !overflow-x-hidden shadow-md">
                        <table className="w-full border border-gray-300 bg-[#f1f1f1] text-center">
                            <thead>
                                <tr className="bg-blue-800 text-white ">
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">ID Colaborador</th>
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Nome</th>
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Tipo</th>
                                    <th className="p-1 sm:p-3 poppins text-xs sm:text-lg">Data e Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {obterItensPaginaAtual().map((item, index) => (
                                    <tr key={`${item.id_colaborador}-${index}`} className="border-b border-gray-200  hover:bg-gray-50">
                                        <td className="p-1 sm:p-3 poppins text-xs border-r sm:text-base text-black">{item.id_colaborador}</td>
                                        <td className="p-1 sm:p-3 poppins text-xs border-r sm:text-base text-black">{item.nome_colaborador}</td>
                                        <td className="p-1 sm:p-3 poppins text-xs  border-r sm:text-base text-black">
                                            {item.tipo_ponto === 'ENTRADA' ? (
                                                <span className="text-green-600">Entrada</span>
                                            ) : (
                                                <span className="text-red-600">Saída</span>
                                            )}
                                        </td>
                                        <td className="p-1 sm:p-3 poppins text-xs  border-r sm:text-base text-black">
                                            {formatarDataHora(item.data_hora)}
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