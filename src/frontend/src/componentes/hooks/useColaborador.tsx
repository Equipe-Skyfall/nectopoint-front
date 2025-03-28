import { useState, useEffect, useCallback } from 'react';
import api from './api';
import { useAuthContext } from '../../Provider/AuthProvider';

const useColaborador = () => {
    const { isAuthenticated } = useAuthContext();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5; // Fixando 5 itens por página

    const fetchEmployees = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/sessao/usuario/todos', {
                params: {
                    page: currentPage,
                    size: pageSize
                }
            });
            setEmployees(response.data.content);
            setFilteredEmployees(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentPage, pageSize]);

    const filterEmployees = useCallback((query) => {
        if (!query) {
            setFilteredEmployees(employees);
            return;
        }

        const filtered = employees.filter(emp => 
            emp.cpf.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [employees]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        filterEmployees(searchQuery);
    }, [searchQuery, filterEmployees]);

    return {
        employees,
        filteredEmployees,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        currentPage,
        totalPages,
        setCurrentPage,
        refreshEmployees: fetchEmployees
    };
};

export default useColaborador;