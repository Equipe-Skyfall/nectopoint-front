import { useQuery } from '@tanstack/react-query';
import api from '../hooks/api';
import { HistoricoParams, ApiResponse } from '../../interfaces/interfaceHistorico';

const useHistorico = (params: HistoricoParams) => {
    const queryKey = ['historico', params]; // Chave única para a query

    const { data, error, isLoading } = useQuery<ApiResponse, Error>({
        queryKey,
        queryFn: async () => {
            console.log('Enviando para API:', params); 
            const startDateISO = params.startDate ? new Date(params.startDate).toISOString() : undefined;
            const endDateISO = params.endDate ? new Date(params.endDate).toISOString() : undefined;

            const response = await api.get<ApiResponse>('/turno/historico', {
                params: {
                    //Utilizo todos os parâmetros que vem do back
                    page: params.page,
                    size: params.size,
                    startDate: startDateISO,
                    endDate: endDateISO,
                    lista_status: params.lista_status,
                    nome_colaborador: params.nome_colaborador, 
                },
            });
            console.log('Resposta da API:', response)

            if (response.data && Array.isArray(response.data.content)) {
                // Ordena os registros por data decrescente
                const pontosOrdenados = response.data.content.sort((a, b) => {
                    const dataA = new Date(a.data_hora).getTime();
                    const dataB = new Date(b.data_hora).getTime();
                    return dataB - dataA;
                });

                return {
                    ...response.data,
                    content: pontosOrdenados,
                };
            }
            throw new Error('Dados inválidos recebidos da API.');
        },
        staleTime: 1000, 
        refetchOnWindowFocus: true, 
    });

    return {
        historico: data?.content || [],
        erro: error?.message || null,
        totalPaginas: data?.totalPages || 0,
        isLoading,
    };
};

export default useHistorico;