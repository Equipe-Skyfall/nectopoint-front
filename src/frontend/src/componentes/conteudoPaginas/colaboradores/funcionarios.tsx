import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useEdit } from '../../hooks/useEdit';
import api from '../../hooks/api';
import { toast } from 'react-toastify';
import ConteudoFunc from './conteudoFuncionarios';
import useAuth from '../../hooks/useAuth';

const Funcionarios = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { navigateToEdit } = useEdit();

  // State for employee data and filters
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [jornadaSelecionada, setJornadaSelecionada] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Additional state for employee details and deactivation
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<any>({});
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Fetch employees
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
          tipo_escala: jornadaSelecionada || undefined,
          lista_status: statusSelecionado || undefined
        }
      });
      const employeesData = Array.isArray(response.data.content) ? response.data.content : [];
      setEmployees(employeesData);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      console.error('Erro ao buscar colaboradores:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao carregar colaboradores');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage, searchQuery, jornadaSelecionada, statusSelecionado]);

  // Fetch employees on mount and when dependencies change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle status from URL query parameter or route state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    const stateStatus = location.state?.statusSelecionado;

    if (stateStatus && stateStatus !== statusSelecionado) {
      console.log('Setting statusSelecionado from route state:', stateStatus);
      setStatusSelecionado(stateStatus);
    } else if (statusParam && statusParam !== statusSelecionado) {
      console.log('Setting statusSelecionado from URL query:', statusParam);
      setStatusSelecionado(statusParam);
    }
  }, [location.state, setStatusSelecionado]);

  // Update URL query parameter when statusSelecionado changes
  useEffect(() => {
    if (statusSelecionado) {
      navigate(`/colaboradores?status=${statusSelecionado}`, {
        replace: true,
        state: { statusSelecionado }
      });
    }
  }, [statusSelecionado, navigate]);

  // Toggle employee details
  const toggleExpand = async (id: number) => {
    if (expandedEmployee === id) {
      setExpandedEmployee(null);
    } else {
      try {
        const response = await api.get(`/usuario/${id}`);
        setEmployeeDetails((prev: any) => ({ ...prev, [id]: response.data }));
        setExpandedEmployee(id);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes:', err);
        toast.error('Erro ao carregar detalhes do colaborador');
      }
    }
  };

  // Deactivate employee
  const handleDeactivate = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm('Tem certeza que deseja desativar este colaborador?')) {
      return;
    }

    setIsDeleting(id);
    try {
      await api.delete(`/usuario/${id}`, { data: { status: 'INATIVO' } });
      toast.success('Colaborador desativado com sucesso!');
      fetchEmployees();
      if (expandedEmployee === id) setExpandedEmployee(null);
    } catch (err: any) {
      console.error('Erro ao desativar colaborador:', err);
      toast.error('Erro ao desativar colaborador');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <ConteudoFunc
      employeesToShow={employees}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      jornadaSelecionada={jornadaSelecionada}
      setJornadaSelecionada={setJornadaSelecionada}
      statusSelecionado={statusSelecionado}
      setStatusSelecionado={setStatusSelecionado}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
      expandedEmployee={expandedEmployee}
      employeeDetails={employeeDetails}
      isDeleting={isDeleting}
      navigateToEdit={navigateToEdit}
      toggleExpand={toggleExpand}
      handleDeactivate={handleDeactivate}
    />
  );
};

export default Funcionarios;