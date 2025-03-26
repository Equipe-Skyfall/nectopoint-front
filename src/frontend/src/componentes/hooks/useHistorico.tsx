import { useState, useEffect } from 'react';
import api from '../hooks/api';

interface HistoricoParams {
    page?: number;
    size?: number;
    startDate?: string; 
    endDate?: string;
    status_turno?: string; 
    id_colaborador?: number;
}

interface PointRegistryEntity {
    id_ponto: string;
    id_colaborador: number;
    nome_colaborador: string;
    tipo_ponto: string; 
    data_hora: string; 
    status_turno: string; 
}

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
    const [historico, setHistorico] = useState<PointRegistryEntity[]>([]);
    const [erro, setErro] = useState<string | null>(null);
    const [totalPaginas, setTotalPaginas] = useState(0);

    useEffect(() => {
        const buscarHistorico = async () => {
            try {
                setErro(null);


                const startDateISO = params.startDate ? new Date(params.startDate).toISOString() : undefined;
                const endDateISO = params.endDate ? new Date(params.endDate).toISOString() : undefined;

                const response = await api.get<ApiResponse>('/turno/historico', {
                    params: {
                        page: params.page,
                        size: params.size,
                        startDate: startDateISO,
                        endDate: endDateISO,
                        status_turno: params.status_turno,
                        id_colaborador: params.id_colaborador,
                    },
                });

                if (response.data && Array.isArray(response.data.content)) {
                    const pontosOrdenados = response.data.content.sort((a, b) => {
                        const dataA = new Date(a.data_hora).getTime();
                        const dataB = new Date(b.data_hora).getTime();
                        return dataB - dataA
                    })
                    setHistorico(pontosOrdenados);
                    setTotalPaginas(response.data.totalPages);
                } else {
                    setErro('Dados inválidos recebidos da API.');
                }
            } catch (error) {
                setErro('Erro ao carregar o histórico. Tente novamente mais tarde.');
            } finally {
            }
        };

        buscarHistorico();
    }, [params]);

    return { historico, erro, totalPaginas };
};

export default useHistorico;