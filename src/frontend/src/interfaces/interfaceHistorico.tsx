// InterfaceHistorico.ts

// Define a estrutura dos parâmetros de entrada para o hook
export interface HistoricoParams {
    page?: number;
    size?: number;
    startDate?: string; 
    endDate?: string;
    lista_status_turno?: string; 
    id_colaborador?: number;
    nome_colaborador?: string;
}

// Define a estrutura de cada registro de ponto retornado pela API
export interface PointRegistryEntity {
    id_ponto: string;
    id_colaborador: number;
    nome_colaborador: string;
    tipo_ponto: string; 
    data_hora: string; 
    status_turno: string; 
}

// Estrutura completa da resposta da API
export interface ApiResponse {
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