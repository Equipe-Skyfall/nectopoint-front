import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../hooks/api';
import recarregar from './hooksChamarBackend/recarregar';

interface EmployeeData {
    id?: number;
    name: string;
    email: string;
    password?: string;
    cpf: string;
    title: 'GERENTE' | 'COLABORADOR';
    department: string;
    workJourneyType: string;
    employeeNumber: string;
    dailyHours: number;
    bankOfHours: number;
    birthDate: string;
}

export const useEdit = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const getEmployeeById = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/usuario/${id}`);
            return response.data as EmployeeData;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar funcionário';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateEmployee = async (id: string, data: Partial<EmployeeData>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/usuario/${id}`, data);

           
                
            
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 
                              err.response?.data?.error || 
                              JSON.stringify(err.response?.data) || 
                              err.message || 
                              'Erro ao atualizar funcionário';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const navigateToEdit = (id: string) => {
        navigate(`/editar/${id}`);
    };

    return {
        loading,
        error,
        getEmployeeById,
        updateEmployee,
        navigateToEdit,
        clearError: () => setError(null)
    };
};