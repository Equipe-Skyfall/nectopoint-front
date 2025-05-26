import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiChevronRight, FiChevronLeft, FiTrash2, FiSearch, FiX, FiUser, FiUsers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

import api from "../../hooks/api";
import axios from "axios";
const DefinirFolga = () => {
  // Form state
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    repeatsYearly: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(false);

  // User selection state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);


  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/sessao/usuario/todos', {
        params: {
          page: 0,
          size: 100,
        }
      });
      const usersData = Array.isArray(response.data.content) ? response.data.content : [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch holidays
  const fetchHolidays = async (pageNumber = 0, pageSize = 6) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/feriados/listar?page=${pageNumber}&size=${pageSize}`);
      setHolidays(response.data.content);
      setPage(response.data.number);
      setTotalPages(response.data.totalPages);
      
      // If we're on a page that doesn't exist anymore, go to the last valid page
      if (response.data.content.length === 0 && response.data.totalPages > 0 && pageNumber > 0) {
        const lastValidPage = Math.max(0, response.data.totalPages - 1);
        fetchHolidays(lastValidPage);
        return;
      }
      
    } catch (error) {
      console.error("Erro ao buscar feriados:", error);
      alert('Erro ao carregar feriados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchUsers();
    }
  }, [showModal, fetchUsers]);

  // Filter users based on search term
  useEffect(() => {
    if (userSearchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.nome.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.cpf.includes(userSearchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [userSearchTerm, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    const isAlreadySelected = selectedUsers.some(selected => selected.id_colaborador === user.id_colaborador);
    
    if (!isAlreadySelected) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setUserSearchTerm('');
    setShowUserDropdown(false);
  };

  // Remove selected user
  const removeSelectedUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id_colaborador !== userId));
  };

  // Clear all selected users
  const clearAllUsers = () => {
    setSelectedUsers([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: form.name,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
      repeatsYearly: form.repeatsYearly,
      userIds: selectedUsers.map(user => user.id_colaborador)
    };

    try {
      await axios.post("http://localhost:8080/feriados/", payload);
      alert("Feriado cadastrado com sucesso!");
      setShowModal(false);
      fetchHolidays(page);
      resetForm();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Erro ao enviar feriado:", error);
      alert("Erro ao cadastrar feriado");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/feriados/${id}`);
      
      // Check if current page will be empty after deletion
      const currentPageItems = holidays.length;
      const willBeEmptyPage = currentPageItems === 1 && page > 0;
      
      // If current page will be empty, go to previous page
      if (willBeEmptyPage) {
        const newPage = Math.max(0, page - 1);
        fetchHolidays(newPage);
      } else {
        // Otherwise, just refresh current page
        fetchHolidays(page);
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao deletar feriado:", error);
      throw error;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchHolidays(newPage);
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };

  const resetForm = () => {
    setForm({
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      repeatsYearly: false,
    });
    setSelectedUsers([]);
    setUserSearchTerm('');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      resetForm();
    }
  };

  // Componente de card de feriado
  const HolidayCard = ({ holiday, onDelete }) => {
    const isSingleDay = holiday.startDate === holiday.endDate;
    const dateText = isSingleDay
      ? formatShortDate(holiday.startDate)
      : `${formatShortDate(holiday.startDate)} - ${formatShortDate(holiday.endDate)}`;

    const handleDeleteClick = async (e) => {
      e.stopPropagation();
      if (window.confirm(`Tem certeza que deseja deletar o feriado "${holiday.name}"?`)) {
        try {
          await onDelete(holiday.id);
        } catch (error) {
          alert("Erro ao deletar feriado");
        }
      }
    };

    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white text-center relative">
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 bg-red-100 text-red-500 rounded p-1 hover:bg-red-500 hover:text-white transition-colors"
            title="Deletar feriado"
          >
            <FiTrash2 size={16} />
          </button>
          <h3 className="font-bold text-lg truncate">{holiday.name}</h3>
          <p className="mt-2 text-sm text-blue-600 bg-white rounded-md border border-blue-100 px-3 py-1 shadow-sm opacity-90 w-fit mx-auto">
            {dateText}
          </p>
        </div>

        <div className="p-4 flex flex-col items-center justify-between flex-grow">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {holiday.description || "Sem descrição"}
            </p>

            <div className="flex justify-center items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs ${holiday.repeatsYearly
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
                }`}>
                {holiday.repeatsYearly ? "Anual" : "Não repete"}
              </span>

              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {holiday.userIds && holiday.userIds.length > 0
                  ? `${holiday.userIds.length} usuário(s)`
                  : "Todos"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const PaginationControls = () => {
    const maxVisibleButtons = 5;

    const getVisiblePages = () => {
      let startPage = Math.max(0, page - Math.floor(maxVisibleButtons / 2));
      let endPage = startPage + maxVisibleButtons - 1;

      if (endPage >= totalPages - 1) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - maxVisibleButtons + 1);
      }

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const visiblePages = getVisiblePages();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex justify-center items-center gap-7 sm:gap-6"
      >
        <motion.button
          whileHover={{ scale: page === 0 ? 1 : 1.05 }}
          whileTap={{ scale: page === 0 ? 1 : 0.95 }}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className={`flex items-center text-sm sm:text-base px-2 sm:px-6 py-3 rounded-xl transition-all ${page === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
        >
          <FiChevronLeft className="mr-2" />
          Anterior
        </motion.button>

        <div className="flex items-center gap-2">
          {visiblePages.map((pageNum) => (
            <motion.button
              key={pageNum}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(pageNum)}
              className={`sm:w-10 w-8 h-10 sm:h-10 rounded-full flex items-center justify-center ${page === pageNum
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {pageNum + 1}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: page === totalPages - 1 ? 1 : 1.05 }}
          whileTap={{ scale: page === totalPages - 1 ? 1 : 0.95 }}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          className={`flex items-center px-2 text-sm sm:text-base sm:px-6 py-3 rounded-xl transition-all ${page === totalPages - 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
        >
          Próxima
          <FiChevronRight className="ml-2" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-6 font-sans"
    >
      <div className="mt-[5%] max-w-7xl mx-auto">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
        >
          Calendário de Folgas
        </motion.h2>

        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleModal}
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus className="mr-2" />
            Nova Folga
          </motion.button>
        </div>

        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="flex justify-center p-12"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </motion.div>
        ) : holidays.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nenhuma folga cadastrada
              </h3>
              <p className="text-gray-600 mb-4">
                Cadastre sua primeira folga para começar
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {holidays.map((holiday, index) => (
                  <motion.div
                    key={holiday.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                  >
                    <HolidayCard
                      holiday={holiday}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {totalPages > 1 && <PaginationControls />}
          </>
        )}
      </div>

      {/* Modal de cadastro */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 relative">
                <button
                  onClick={() => {
                    toggleModal();
                    setSelectedUsers([]);
                    setUserSearchTerm('');
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>

                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                  Cadastrar Folga
                </h3>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* User Selection Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Usuários (deixe vazio para aplicar a todos)
                      </label>
                      {selectedUsers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {selectedUsers.length} selecionado(s)
                          </span>
                          <button
                            type="button"
                            onClick={clearAllUsers}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Limpar todos
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User search input */}
                    <div className="relative">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={userSearchTerm}
                          onChange={(e) => {
                            setUserSearchTerm(e.target.value);
                            setShowUserDropdown(true);
                          }}
                          onFocus={() => setShowUserDropdown(true)}
                          placeholder="Buscar usuário por nome ou CPF..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* User dropdown */}
                      {showUserDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {loadingUsers ? (
                            <div className="p-4 text-center text-gray-500">
                              Carregando usuários...
                            </div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              Nenhum usuário encontrado
                            </div>
                          ) : (
                            filteredUsers.map((user) => (
                              <button
                                key={user.id_colaborador}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                                disabled={selectedUsers.some(selected => selected.id_colaborador === user.id_colaborador)}
                              >
                                <FiUser className="text-gray-400" />
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{user.nome}</div>
                                  <div className="text-sm text-gray-500">CPF: {user.cpf}</div>
                                </div>
                                {selectedUsers.some(selected => selected.id_colaborador === user.id_colaborador) && (
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                    Selecionado
                                  </span>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected users */}
                    {selectedUsers.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map((user) => (
                            <div
                              key={user.id_colaborador}
                              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              <FiUser size={12} />
                              <span>{user.nome}</span>
                              <button
                                type="button"
                                onClick={() => removeSelectedUser(user.id_colaborador)}
                                className="hover:text-blue-900"
                              >
                                <FiX size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                   <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="repeatsYearly"
                      checked={form.repeatsYearly}
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-600 bg-gray-400 rounded-full ml-2 mr-2"
                    />
                    <label className="ml-2 text-sm text-gray-700 cursor-pointer">Repete anualmente</label>
                  </div>

                  <div className="pt-4">
                    <motion.button
             
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Cadastrar Folga
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </motion.div>
  );
};

export default DefinirFolga;