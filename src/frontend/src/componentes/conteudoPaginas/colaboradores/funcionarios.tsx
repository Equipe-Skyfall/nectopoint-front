import React, { useState } from 'react';
import useColaborador from '../../hooks/useColaborador';
import { useEdit } from '../../hooks/useEdit';
import { FaUser, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FiPlus, FiFilter, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../hooks/api';
import { toast } from 'react-toastify';
import FiltrosColaborador from '../../filtros/filtoColaborador';
import formatarMinutosEmHorasEMinutos from '../../hooks/formatarHoras';

// Componente para traduzir o tipo de jornada com estilo visual
const JornadaBadge = ({ jornada }: { jornada: string }) => {
  const jornadaStyles = {
    'CINCO_X_DOIS': { text: '5 x 2', color: 'bg-blue-100 text-blue-800' },
    'SEIS_X_UM': { text: '6 x 1', color: 'bg-purple-100 text-purple-800' },
    default: { text: jornada, color: 'bg-gray-100 text-gray-800' }
  };

  const style = jornadaStyles[jornada] || jornadaStyles.default;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.color}`}>
      {style.text}
    </span>
  );
};

// Formata a data de nascimento com tratamento de erros
const formatarDataNascimento = (data: string) => {
  if (!data) return 'N/A';
  try {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch {
    return data;
  }
};

const EmployeeList = () => {
  const {
    employees,
    loading,
    error,
    searchQuery,
    jornadaSelecionada,
    setJornadaSelecionada,
    setSearchQuery,
    refreshEmployees,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useColaborador();

  const { navigateToEdit } = useEdit();
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<any>({});
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Expande/contrai os detalhes do colaborador
  const toggleExpand = async (id: number) => {
    if (expandedEmployee === id) {
      setExpandedEmployee(null);
    } else {
      try {
        const response = await api.get(`/usuario/${id}`);
        setEmployeeDetails(prev => ({ ...prev, [id]: response.data }));
        setExpandedEmployee(id);
      } catch (err) {
        console.error('Erro ao buscar detalhes:', err);
        toast.error('Erro ao carregar detalhes do colaborador');
      }
    }
  };

  // Exclui um colaborador com confirmação
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      return;
    }

    setIsDeleting(id);
    try {
      await api.delete(`/usuario/${id}`);
      toast.success('Colaborador excluído com sucesso!');
      refreshEmployees();
      if (expandedEmployee === id) setExpandedEmployee(null);
    } catch (err) {
      console.error('Erro ao excluir colaborador:', err);
      toast.error('Erro ao excluir colaborador');
    } finally {
      setIsDeleting(null);
    }
  };

  // Navegação entre páginas
  const avancarPagina = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const retrocederPagina = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-16 min-h-screen p-4 md:p-6 poppins"
    >
      <div className="max-w-7xl mx-auto">
        {/* Título com gradiente */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
        >
          Colaboradores
        </motion.h2>

        {/* Barra de ferramentas com filtros e botão de cadastro */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <FiltrosColaborador
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              jornadaSelecionada={jornadaSelecionada}
              setJornadaSelecionada={setJornadaSelecionada}
              limparFiltros={() => {
                setSearchQuery('');
                setJornadaSelecionada('');
                setCurrentPage(0);
              }}
            />
          </div>

          {/* Botão de cadastro com animação */}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/cadastrar"
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 mt-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus className="mr-2" />
            Cadastrar Colaborador
          </motion.a>
        </div>

        {/* Estados de carregamento e erro */}
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="flex justify-center p-12"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg shadow-md"
          >
            <p className="font-medium">Erro: {error}</p>
          </motion.div>
        ) : employees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchQuery || jornadaSelecionada ? 'Nenhum resultado encontrado' : 'Nenhum colaborador cadastrado'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || jornadaSelecionada 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Cadastre seu primeiro colaborador'}
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Lista de colaboradores */}
            <div className="space-y-4">
              <AnimatePresence>
                {employees.map((emp, index) => (
                  <motion.div
                    key={emp.id_colaborador}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                  >
                    {/* Cabeçalho do card do colaborador */}
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(emp.id_colaborador)}
                    >
                      {/* Avatar e informações básicas */}
                      <div className="flex items-center w-full sm:w-auto flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full flex-shrink-0 mr-4">
                          <FaUser className="text-blue-600 text-xl" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 text-start truncate">{emp.nome}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-sm text-gray-600">ID: {emp.id_colaborador}</span>
                            <span className="text-sm text-gray-600">CPF: {emp.cpf}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToEdit(emp.id_colaborador);
                          }}
                          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Editar"
                        >
                          <FaEdit className="mr-2" />
                          <span className="hidden sm:inline">Editar</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleDelete(emp.id_colaborador, e)}
                          disabled={isDeleting === emp.id_colaborador}
                          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                            isDeleting === emp.id_colaborador
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                          title="Excluir"
                        >
                          <FaTrash className="mr-2" />
                          <span className="hidden sm:inline">
                            {isDeleting === emp.id_colaborador ? 'Excluindo...' : 'Excluir'}
                          </span>
                        </motion.button>

                        <div className="ml-2 text-gray-400">
                          {expandedEmployee === emp.id_colaborador ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Detalhes expandidos do colaborador */}
                    <AnimatePresence>
                      {expandedEmployee === emp.id_colaborador && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              {/* Informações Pessoais */}
                              <motion.div 
                                whileHover={{ y: -2 }}
                                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                              >
                                <h4 className="font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200 flex items-center">
                                  <span className="bg-blue-100 p-1 rounded mr-2">
                                    <FaUser className="text-blue-600" />
                                  </span>
                                  Informações Pessoais
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-sm text-gray-800">
                                      {employeeDetails[emp.id_colaborador]?.email || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Data de Nascimento</p>
                                    <p className="text-sm text-gray-800">
                                      {formatarDataNascimento(employeeDetails[emp.id_colaborador]?.birthDate) || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Informações Profissionais */}
                              <motion.div 
                                whileHover={{ y: -2 }}
                                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                              >
                                <h4 className="font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200 flex items-center">
                                  <span className="bg-blue-100 p-1 rounded mr-2">
                                    <FaUser className="text-blue-600" />
                                  </span>
                                  Informações Profissionais
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Cargo</p>
                                    <p className="text-sm text-gray-800">
                                      {employeeDetails[emp.id_colaborador]?.title || emp.cargo || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Departamento</p>
                                    <p className="text-sm text-gray-800">
                                      {employeeDetails[emp.id_colaborador]?.department || emp.departamento || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Jornada</p>
                                    <div className="text-sm">
                                      {employeeDetails[emp.id_colaborador]?.workJourneyType ? (
                                        <JornadaBadge jornada={employeeDetails[emp.id_colaborador].workJourneyType} />
                                      ) : (
                                        'N/A'
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Horas */}
                              <motion.div 
                                whileHover={{ y: -2 }}
                                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                              >
                                <h4 className="font-semibold text-blue-600 mb-4 pb-2 border-b border-gray-200 flex items-center">
                                  <span className="bg-blue-100 p-1 rounded mr-2">
                                    <FaUser className="text-blue-600" />
                                  </span>
                                  Horas
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Banco de Horas</p>
                                    <p className="text-sm text-gray-800">
                                      {formatarMinutosEmHorasEMinutos(employeeDetails[emp.id_colaborador]?.bankOfHours) ?? emp.banco_de_horas ?? 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Horas Diárias</p>
                                    <p className="text-sm text-gray-800">
                                      {employeeDetails[emp.id_colaborador]?.dailyHours ?? emp.horas_diarias ?? 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="text-sm text-gray-600">
                  Mostrando página {currentPage + 1} de {totalPages}
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: currentPage === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === 0 ? 1 : 0.95 }}
                    onClick={retrocederPagina}
                    disabled={currentPage === 0}
                    className={`flex items-center px-4 py-2 rounded-xl ${
                      currentPage === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Anterior
                  </motion.button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i;
                      } else if (currentPage <= 2) {
                        pageNum = i;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum + 1}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: currentPage === totalPages - 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === totalPages - 1 ? 1 : 0.95 }}
                    onClick={avancarPagina}
                    disabled={currentPage === totalPages - 1}
                    className={`flex items-center px-4 py-2 rounded-xl ${
                      currentPage === totalPages - 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Próxima
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default EmployeeList;