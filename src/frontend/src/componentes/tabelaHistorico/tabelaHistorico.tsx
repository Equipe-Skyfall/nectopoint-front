import React, { useCallback, useEffect, useState } from 'react';
import useHistorico from '../hooks/useHistorico';
import { useQueryClient } from '@tanstack/react-query';

export default function ConteudoHistorico() {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [itensPorPagina, setItensPorPagina] = useState(12);
    const queryClient = useQueryClient();

    //Ajusta o número de itens por página com base na largura da tela (9 para telas grandes, 12 para telas pequenas). Esta função é usada para responsividade.
    const atualizarItensPorPagina = useCallback(() => {
        const novosItens = window.innerWidth >= 640 ? 9 : 9;
        if (novosItens !== itensPorPagina) {
            setItensPorPagina(novosItens);
            // Invalida a query quando os itens por página mudam
            queryClient.invalidateQueries({ queryKey: ['historico'] });
        }
    }, [itensPorPagina, queryClient]);
    //Executa o atualizarItensPorPagina sempre que a largura da tela mudar
    useEffect(() => {
        atualizarItensPorPagina();
        window.addEventListener('resize', atualizarItensPorPagina);
        return () => {
            window.removeEventListener('resize', atualizarItensPorPagina);
        };
    }, [atualizarItensPorPagina]);

    //useMemo memoriza os parametros (page e size) para otimizar o hook, evita re-renderizações a cada mudança
    const params = {
        page: paginaAtual,
        size: itensPorPagina,
    };


    const { historico, erro, totalPaginas, isLoading } = useHistorico(params); //aqui estou passando o params para o useHistorico

    //Essa const formata uma string de data e hora para o formato local ("pt-BR") e vai retornar data invalida se não puder ser convertida
    const formatarDataHora = useCallback((dataHora: string) => {
        const data = new Date(dataHora);
        if (isNaN(data.getTime())) {
            return 'Data inválida';
        }
        return data.toLocaleString('pt-BR');
    }, []);

    // Traduz o status do turno (por exemplo, "TRABALHANDO" para "Trabalhando").
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

    //Obtém e formata a data e hora do ultimo ponto marcado no turno. Se não tiver nada, retorna N/A
    const obterFimTurno = useCallback((pontos_marcados: { data_hora: string }[]) => {
        if (pontos_marcados?.length > 0) {
            return formatarDataHora(pontos_marcados[pontos_marcados.length - 1].data_hora);
        }
        return 'N/A';
    }, [formatarDataHora]);

    //Incrementa o paginaAtual para exibir a proxima pagina
    const avancarPagina = useCallback(() => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual(paginaAtual + 1);
        }
    }, [paginaAtual, totalPaginas]);

    //Decrementa o paginaAtual para exibir a pagina anterior
    const retrocederPagina = useCallback(() => {
        if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
        }
    }, [paginaAtual]);

    return (
        <div className="flex flex-col items-center justify-center p-4 my-8 w-full overflow-y-hidden overflow-x-hidden">
            <h2 className="mb-6 text-2xl font-semibold text-blue-600 poppins text-center mt-10">Histórico de Pontos</h2>

            {isLoading ? (
                <p>Carregando...</p>
            ) : erro ? (
                <p className="text-red-600">{erro}</p>
            ) : historico.length === 0 ? (
                <p>Nenhum registro encontrado.</p>
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