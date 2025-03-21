import React, { useEffect, useState } from 'react';
import api from '../hooks/axios';

interface Ponto {
    tipo_ponto: string; // "ENTRADA" ou "SAIDA"
    data_hora: string;
    tempo_entre_pontos: number | null;
}

interface JornadaAtual {
    id_colaborador: number;
    nome_colaborador: string;
    id_registro: string;
    inicio_turno: string;
    status_turno: string;
    tempo_trabalhado_min: number;
    tempo_intervalo_min: number;
    pontos_marcados: Ponto[];
}

interface ApiResponse {
    id_colaborador: number;
    nome: string;
    id_sessao: string;
    dados_usuario: {
        cpf: string;
        cargo: string;
        departamento: string;
        status: string | null;
    };
    jornada_trabalho: {
        tipo_jornada: string;
        banco_de_horas: number;
        horas_diarias: number;
    };
    jornada_atual: JornadaAtual;
    jornadas_historico: JornadaAtual[];
    jornadas_irregulares: any[];
    alertas_usuario: any[];
}

export default function ConteudoHistoricoFunc() {
    const [pontosMarcados, setPontosMarcados] = useState<Ponto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 9;

    // Busca os pontos marcados do usuário logado
    const buscarPontosMarcados = async () => {
        try {
            setCarregando(true);
            setErro(null);

            const response = await api.get<ApiResponse>('/sessao/usuario/me');
            console.log('Resposta da API:', response.data); // Log da resposta

            if (response.data) {
                let pontosMarcados: Ponto[] = [];

                // Usa jornadas_historico se estiver disponível e não estiver vazio
                // Adiciona pontos de jornada_atual
                if (response.data.jornada_atual) {
                    pontosMarcados = pontosMarcados.concat(
                        response.data.jornada_atual.pontos_marcados.map((ponto) => ({
                            ...ponto,
                            tipo_jornada:"Atual"
                        }))
                    );
                }
                if (Array.isArray(response.data.jornadas_historico)) {
                    pontosMarcados = pontosMarcados.concat(
                        response.data.jornadas_historico.flatMap(
                            (jornada) => jornada.pontos_marcados.map((ponto) => ({
                                ...ponto,
                                tipo_jornada:"Histórica"
                            }))
                        )
                    );
                }

                // Adiciona pontos de jornadas_irregulares
                if (Array.isArray(response.data.jornadas_irregulares)) {
                    pontosMarcados = pontosMarcados.concat(
                        response.data.jornadas_irregulares.flatMap(
                            (jornada) => jornada.pontos_marcados.map((ponto) => ({
                                ...ponto,
                                tipo_jornada:"Irregular"
                            }))
                        )
                    );
                }
                pontosMarcados.sort((a, b) => {
                    const dataA = new Date(a.data_hora).getTime();
                    const dataB = new Date(b.data_hora).getTime();
                    return dataB - dataA; // Ordem decrescente
                });
                setPontosMarcados(pontosMarcados);
            } else {
                setErro('Dados inválidos recebidos da API. A estrutura não é a esperada.');
            }
        } catch (error) {
            setErro('Erro ao carregar os pontos marcados. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarPontosMarcados();
    }, []);

    const formatarDataHora = (dataHora: string) => {
        const data = new Date(dataHora);
        return data.toLocaleString('pt-BR');
    };


    const totalPaginas = Math.ceil(pontosMarcados.length / itensPorPagina);
    const obterItensPaginaAtual = () => {
        const inicio = paginaAtual * itensPorPagina;
        const fim = inicio + itensPorPagina;
        return pontosMarcados.slice(inicio, fim);
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
        <div className="flex flex-col items-center justify-center p-4 my-4 w-full overflow-y-hidden overflow-x-hidden">
            <h2 className="poppins-semibold text-blue-600 mb-5 my-10">Histórico de Pontos</h2>

            {erro ? (
                <p className="text-red-600">{erro}</p>
            ) : carregando ? (
                <p>Carregando...</p>
            ) : pontosMarcados.length === 0 ? (
                <p>Nenhum registro encontrado.</p>
            ) : (
                <>
                    <div className="w-[94vw] rounded-md !overflow-x-hidden bg-[#F1F1F1]">
                        <table className="w-full border border-gray-300 text-center ">
                            <thead>
                                <tr className="bg-blue-800 text-white">
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Tipo</th>
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Data e Hora</th>
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Tempo entre Pontos (min)</th>
                                </tr>
                            </thead>
                            <tbody className='text-center justify-center'>
                                {obterItensPaginaAtual().map((ponto, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {ponto.tipo_ponto === 'ENTRADA' ? (
                                                <span className="text-green-600">Entrada</span>
                                            ) : (
                                                <span className="text-red-600">Saída</span>
                                            )}
                                        </td>
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {formatarDataHora(ponto.data_hora)}
                                        </td>
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {ponto.tempo_entre_pontos !== null ? ponto.tempo_entre_pontos : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <div className="mt-3 -mb-4  flex items-center gap-4">
                        <button
                            onClick={retrocederPagina}
                            disabled={paginaAtual === 0}
                            className={`px-4 py-3 rounded-lg transition poppins text-sm md:text-base ${paginaAtual === 0
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
                            className={`px-4 py-3 rounded-lg transition poppins text-sm md:text-base ${paginaAtual === totalPaginas - 1
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