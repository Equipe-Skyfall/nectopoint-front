import { useState, useEffect, useCallback } from 'react';
import api from './api';
import { useAuthContext } from '../../Provider/AuthProvider';

const useColaborador = () => {
    const { isAuthenticated } = useAuthContext();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [jornadaSelecionada, setJornadaSelecionada] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const fetchEmployees = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/sessao/usuario/todos', {
                params: {
                    page: currentPage,
                    size: pageSize,
                    nome_colaborador: searchQuery || undefined,
                    workJourneyType: jornadaSelecionada || undefined 
                }
            });
            const employeesData = Array.isArray(response.data.content) ? response.data.content : [];
            setEmployees(employeesData);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Erro ao buscar colaboradores:', err);
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentPage, pageSize, searchQuery, jornadaSelecionada]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return {
        employees,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        jornadaSelecionada, 
        setJornadaSelecionada,
        currentPage,
        totalPages,
        setCurrentPage,
        refreshEmployees: fetchEmployees
    };
};

export default useColaborador;