import { useState } from 'react';
import api from '../hooks/api';
import { ApiResponse, HistoricoParams } from '../../interfaces/interfaceHistorico';

const useExportacaoHistorico = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTodosRegistros = async (filtros: Omit<HistoricoParams, 'page' | 'size'>) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await api.get<ApiResponse>('/turno/historico', {
                params: {
                    ...filtros,
                    page: 0,
                    size: 100000 
                }
            });

            return response.data.content;
        } catch (err) {
            setError('Erro ao buscar dados para exportação');
            console.error('Erro na exportação:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fetchTodosRegistros,
        isLoading,
        error
    };
};

export default useExportacaoHistorico;