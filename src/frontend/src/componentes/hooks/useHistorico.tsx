import { useState, useEffect } from 'react';
import api from '../hooks/api';


// Define a estrutura dos parâmetros de entrada para o hook, incluindo paginação e filtros (startDate e etc)
interface HistoricoParams {
    page?: number;
    size?: number;
    startDate?: string; 
    endDate?: string;
    status_turno?: string; 
    id_colaborador?: number;
}

// Define a estrutura de cada registro de ponto retornado pela API
interface PointRegistryEntity {
    id_ponto: string;
    id_colaborador: number;
    nome_colaborador: string;
    tipo_ponto: string; 
    data_hora: string; 
    status_turno: string; 
}

// Estrutura completa da resposta da API, incluindo os dados (content), informações de paginação (pageable, totalPages, etc.).
interface ApiResponse {
    content: PointRegistryEntity[];
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

const useHistorico = (params: HistoricoParams) => {
    const [historico, setHistorico] = useState<PointRegistryEntity[]>([]); // Armazena os dados do histórico de pontos recuperados da API
    const [erro, setErro] = useState<string | null>(null); // Armazena uma mensagem de erro, caso ocorra algum problema durante a busca dos dados
    const [totalPaginas, setTotalPaginas] = useState(0); //  Armazena o número total de páginas disponíveis na API

    useEffect(() => {
        const buscarHistorico = async () => {
            //Lógica para buscar os dados
            try {
                setErro(null); //Define erro como null para limpar qualquer erro anterior

                //Define as data para ISO 8601, caso seja fornecido os dados
                const startDateISO = params.startDate ? new Date(params.startDate).toISOString() : undefined;
                const endDateISO = params.endDate ? new Date(params.endDate).toISOString() : undefined; 

                const response = await api.get<ApiResponse>('/turno/historico', {
                    //Utilizo a rota /turno/historico usando um api.get (api===axios) utilizando os parametros de paginação e filtros
                    params: {
                        page: params.page,
                        size: params.size,
                        startDate: startDateISO,
                        endDate: endDateISO,
                        status_turno: params.status_turno,
                        id_colaborador: params.id_colaborador,
                    },
                });

                //Verifica se a resposta da API tem dados que são considerados válidos
                if (response.data && Array.isArray(response.data.content)) {
                    //Ordena os registros de pontos por data_hora decrescente
                    const pontosOrdenados = response.data.content.sort((a, b) => {
                        const dataA = new Date(a.data_hora).getTime();
                        const dataB = new Date(b.data_hora).getTime();
                        return dataB - dataA
                    })

                    //Atualiza com os dados recebidos na API
                    //Caso de erro informa a mensagem de erro
                    setHistorico(pontosOrdenados);
                    setTotalPaginas(response.data.totalPages);
                } else {
                    setErro('Dados inválidos recebidos da API.');
                }
            } catch (error) {
                setErro('Erro ao carregar o histórico. Tente novamente mais tarde.');
                //O finally garante que o carregamento termine, independente do resultado da requisição
            } finally {
            }
        };
        console.log("Puxando dados com params")
        buscarHistorico();
    }, [params]);

    //O hook retorna um objeto com os dados do historico, mensagem de erro e numero total de páginas
    return { historico, erro, totalPaginas };
};

export default useHistorico;