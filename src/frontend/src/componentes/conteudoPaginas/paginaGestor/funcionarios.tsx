import React, { useEffect, useState, useCallback } from 'react';
import api from '../../hooks/api';
import { useAuthContext } from '../../../Provider/AuthProvider';
import { FaUser, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const EmployeeList = () => {
    const { isAuthenticated } = useAuthContext();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Busca os funcionários da API
    useEffect(() => {
        if (isAuthenticated) {
            const fetchEmployees = async () => {
                try {
                    const response = await api.get('/sessao/usuario/todos');
                    console.log(response.data);
                    setEmployees(response.data.content);
                    setFilteredEmployees(response.data.content); // Inicializa com todos os funcionários
                } catch (error) {
                    console.error('Error fetching employees:', error);
                    if (error.response) {
                        console.error('Response data:', error.response.data);
                        console.error('Response status:', error.response.status);
                    }
                }
            };
            fetchEmployees();
        }
    }, [isAuthenticated]);

    // Filtra os funcionários pelo CPF
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

    // Atualiza a lista filtrada quando a query muda
    useEffect(() => {
        filterEmployees(searchQuery);
    }, [searchQuery, filterEmployees]);

    return (
        <div>
            <div className="mt-16 md:mt-16 min-h-screen p-4 md:p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Título */}
                    <h2 className="mb-6 text-2xl font-semibold text-blue-600 poppins text-center">Colaboradores</h2>

                    {/* Barra de pesquisa e botão de cadastro */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-3 md:gap-4">
                        <div className="relative w-full md:flex-grow">
                            <label className="block text-left poppins font-medium text-gray-600 mb-2">Buscar Colaboradores pelo CPF:</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Digite o CPF para pesquisar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Botão de Cadastrar */}
                        <a
                            href="/cadastrar"
                            className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200"
                        >
                            <FaPlus className="mr-2" />
                            Cadastrar
                        </a>
                    </div>

                    {/* Lista de funcionários */}
                    <div className="space-y-4">
                        {isAuthenticated ? (
                            filteredEmployees.length > 0 ? (
                                filteredEmployees.map(emp => (
                                    <div key={emp.id_colaborador} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Informações do colaborador */}
                                        <div className="flex items-center w-full sm:w-auto">
                                            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0 mr-4">
                                                <FaUser className="text-blue-600 text-xl" />
                                            </div>

                                            <div className="text-left">
                                                <h3 className="text-lg font-semibold text-gray-800">{emp.nome}</h3>
                                                <p className='text-sm text-gray-600'>ID:{emp.id_colaborador}</p>
                                                <p className="text-sm text-gray-600">CPF: {emp.cpf} </p>
                                            </div>
                                        </div>

                                        {/* Botões de ação alinhados à direita */}
                                        <div className="w-full sm:w-auto flex justify-end space-x-4 mt-4 sm:mt-0 ml-auto">
                                            <button
                                                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition duration-200"
                                                title="Editar"
                                            >
                                                <a href="/editar" className="mr-2">Editar</a>
                                                <FaEdit className="text-lg" />
                                            </button>
                                            <button
                                                className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition duration-200"
                                                title="Excluir"
                                            >
                                                <span className="mr-2">Deletar</span>
                                                <FaTrash className="text-lg" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">
                                    {searchQuery ? 'Nenhum funcionário encontrado com este CPF' : 'Nenhum funcionário cadastrado'}
                                </p>
                            )
                        ) : (
                            <p className="text-center text-gray-500">Not authenticated. Please log in first.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
