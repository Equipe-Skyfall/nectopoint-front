import { useState } from 'react';
import api from './api';

interface UseUpdateUserWarningsReturn {
    updateUserWarnings: (id: number) => Promise<boolean>;
    loading: boolean;
    error: string | null;
    clearError: () => void;
}

const useUpdateUserWarnings = (): UseUpdateUserWarningsReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateUserWarnings = async (id: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            // Obter dados completos e JÁ ATUALIZADOS do localStorage
            const userData = JSON.parse(localStorage.getItem("user") || '{}');
            
            // Enviar todos os dados para o backend
            const requestData = userData;

            console.log('Enviando UserSession completa para backend:', requestData);

            const response = await api.put(`/sessao/usuario/alertas/${id}`, requestData);
            
            if (response.status === 200) {
                // Atualizar localStorage com resposta do backend (dados frescos)
                localStorage.setItem('user', JSON.stringify(response.data));
                console.log('Alertas atualizados com sucesso:', response.data);
                return true;
            }

            throw new Error('Falha ao atualizar alertas');

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar alertas';
            setError(errorMessage);
            console.error('Erro ao atualizar alertas:', errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        updateUserWarnings,
        loading,
        error,
        clearError
    };
};

export default useUpdateUserWarnings;