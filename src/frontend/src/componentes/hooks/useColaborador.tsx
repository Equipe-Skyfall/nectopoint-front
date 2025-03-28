// src/hooks/useEmployees.js
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

    const fetchEmployees = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/sessao/usuario/todos');
            setEmployees(response.data.content);
            setFilteredEmployees(response.data.content);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

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
        refreshEmployees: fetchEmployees
    };
};

export default useColaborador;