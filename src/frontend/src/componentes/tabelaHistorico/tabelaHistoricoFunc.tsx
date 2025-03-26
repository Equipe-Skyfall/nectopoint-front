import React, { useEffect, useState } from 'react';

import api from '../hooks/api';

import SessaoUsuario from '../../interfaces/interfaceSessaoUsuario';


interface HistoricoJornada {
    data: string;
    inicioTurno: string;
    fimTurno: string;
    statusTurno: string;
}

export default function ConteudoHistoricoFunc() {
    const [historicoJornadas, setHistoricoJornadas] = useState<HistoricoJornada[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 9;

    const buscarHistoricoJornadas = async () => {
        try {
            setCarregando(true);
            setErro(null);


            const response = await api.get<SessaoUsuario>('/sessao/usuario/me');
            console.log('Resposta da API:', response.data);

            if (response.data && Array.isArray(response.data.jornadas_historico)) {
                const historicoFormatado = response.data.jornadas_historico
                    .map(jornada => {
                        const dataInicio = new Date(jornada.inicio_turno);
                        const dataFim = jornada.fim_turno ? new Date (jornada.fim_turno) : null
                        
                        return {
                            data: dataInicio.toLocaleDateString('pt-BR'),
                            inicioTurno: dataInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                            fimTurno: dataFim ? dataFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                            statusTurno: formatarStatus(jornada.status_turno),
                            dataOriginal: dataInicio
                        };
                    })
                    .sort((a, b) => {
                        // Ordena do mais recente para o mais antigo
                        return b.dataOriginal.getTime() - a.dataOriginal.getTime();
                    })
                    .map(item => {
                        const {dataOriginal, ...rest } = item
                        return rest
                    });

                setHistoricoJornadas(historicoFormatado);
=
            } else {
                setErro('Dados inválidos recebidos da API ou nenhum histórico encontrado.');
            }
        } catch (error) {
            setErro('Erro ao carregar o histórico de jornadas. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    const formatarStatus = (status: string) => {
        switch(status) {
            case 'ENCERRADO':
                return 'Encerrado';
            case 'EM_ANDAMENTO':
                return 'Em Andamento';
            case 'NAO_INICIADO':
                return 'Não Iniciado';
            case 'PAUSADO':
                return 'Pausado';
            default:
                return status;
        }
    };

    useEffect(() => {
        buscarHistoricoJornadas();
    }, []);

    const totalPaginas = Math.ceil(historicoJornadas.length / itensPorPagina);
    const obterItensPaginaAtual = () => {
        const inicio = paginaAtual * itensPorPagina;
        const fim = inicio + itensPorPagina;
        return historicoJornadas.slice(inicio, fim);
    };

    const avancarPagina = () => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const retrocederPagina = () => {
        if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 my-4 w-full overflow-y-hidden overflow-x-hidden">
            <h2 className="poppins-semibold text-blue-600 mb-5 my-10">Histórico de Jornadas</h2>

            {erro ? (
                <p className="text-red-600">{erro}</p>
            ) : carregando ? (
                <p>Carregando...</p>
            ) : historicoJornadas.length === 0 ? (
                <p>Nenhum registro encontrado.</p>
            ) : (
                <>
                    <div className="w-[94vw] rounded-md !overflow-x-hidden bg-[#F1F1F1]">
                        <table className="w-full border border-gray-300 text-center">
                            <thead>
                                <tr className="bg-blue-800 text-white">
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Data</th>
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Início do Turno</th>
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Fim do Turno</th>
                                    <th className="p-2 sm:p-3 poppins text-sm sm:text-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className='text-center justify-center'>
                                {obterItensPaginaAtual().map((jornada, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {jornada.data}
                                        </td>
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {jornada.inicioTurno}
                                        </td>
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {jornada.fimTurno}
                                        </td>
                                        <td className="p-2 px-5 md:p-3 poppins text-sm md:text-base text-black">
                                            {jornada.statusTurno}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginação */}
                    <div className="mt-3 -mb-4 flex items-center gap-4">
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