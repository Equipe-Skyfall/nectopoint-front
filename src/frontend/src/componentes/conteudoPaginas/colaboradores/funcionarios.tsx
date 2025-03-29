import React, { useState } from 'react';
import useColaborador from '../../hooks/useColaborador';
import { useEdit } from '../../hooks/useEdit';
import { FaUser, FaSearch, FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../../hooks/api';
import { toast } from 'react-toastify';

const EmployeeList = () => {
    const {
        filteredEmployees,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        refreshEmployees,
        currentPage,
        totalPages,
        setCurrentPage,
    } = useColaborador();
    const formatarDataNascimento = (data: string) => {
        if (!data) return 'N/A';

        try {

            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        } catch {
            return data;
        }
    };

    const { navigateToEdit } = useEdit();
    const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<any>({});
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

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
            }
        }
    };

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

            if (expandedEmployee === id) {
                setExpandedEmployee(null);
            }
        } catch (err) {
            console.error('Erro ao excluir colaborador:', err);
            toast.error('Erro ao excluir colaborador');
        } finally {
            setIsDeleting(null);
        }
    };

    const avancarPagina = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const retrocederPagina = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="mt-16 md:mt-16 min-h-screen p-4 md:p-6 poppins">
            <div className="max-w-6xl mx-auto">
                <h2 className="mb-6 text-2xl font-semibold text-blue-600 poppins  text-center">Colaboradores</h2>

                <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-3 md:gap-4">
                    <div className="relative w-full md:flex-grow">
                        <label className="block text-center sm:text-left poppins font-medium text-gray-600 mb-2">Buscar Colaboradores pelo CPF:</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Digite o CPF para pesquisar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-4 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <a
                        href="/cadastrar"
                        className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition duration-200"
                    >
                        <FaPlus className="mr-2" />
                        Cadastrar
                    </a>
                </div>

                {loading && <p className="text-center text-gray-500">Carregando...</p>}
                {error && <p className="text-center text-red-500">Erro: {error}</p>}


                <div className="space-y-4">
                    {filteredEmployees.length > 0 ? (
                        filteredEmployees.map(emp => (
                            <div key={emp.id_colaborador} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200">
                                <div
                                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer  hover:bg-gray-50 transition-colors duration-300"
                                    onClick={() => toggleExpand(emp.id_colaborador)}
                                >
                                    <div className="flex items-center w-full sm:w-auto">
                                        <div className="bg-blue-100 p-3 rounded-full flex-shrink-0 mr-4">
                                            <FaUser className="text-blue-600 text-xl" />
                                        </div>

                                        <div className="text-left">
                                            <h3 className="text-lg font-semibold text-gray-800">{emp.nome}</h3>
                                            <p className='text-sm text-gray-600'>ID: {emp.id_colaborador}</p>
                                            <p className="text-sm text-gray-600">CPF: {emp.cpf}</p>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-auto flex sm:absolute sm:right-60 right-6 relative justify-end mt-4 sm:mt-0 ml-auto">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigateToEdit(emp.id_colaborador);
                                            }}
                                            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition duration-200"
                                            title="Editar"
                                        >
                                            <span className="mr-2">Editar</span>
                                            <FaEdit className="text-lg" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(emp.id_colaborador, e)}
                                            disabled={isDeleting === emp.id_colaborador}
                                            className={`flex items-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition duration-300 ${isDeleting === emp.id_colaborador
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "text-red-600 hover:text-red-800 hover:bg-red-50"
                                                }`}
                                            title="Excluir"
                                        >
                                            {isDeleting === emp.id_colaborador ? (
                                                <span className="mr-2">Excluindo...</span>
                                            ) : (
                                                <>
                                                    <span className="mr-2">Deletar</span>
                                                    <FaTrash className="text-lg" />
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="sm:ml-auto justify-center flex w-full sm:w-auto ">
                                        {expandedEmployee === emp.id_colaborador ? (
                                            <FaChevronUp className="text-gray-500" />
                                        ) : (
                                            <FaChevronDown className="text-gray-500" />
                                        )}
                                    </div>
                                </div>

                                {expandedEmployee === emp.id_colaborador && (
                                    <div className="px-6 pb-52 sm:pb-6 pt-0 mt-5  overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-slide-down">

                                            <div className="p-4 rounded-lg shadow-md border hover:bg-gray-100 transition-colors duration-300 border-gray-100">
                                                <h4 className="font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">Informações Pessoais</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Email</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.email || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Data de Nascimento</p>
                                                        <p className="text-sm font-medium">{formatarDataNascimento(employeeDetails[emp.id_colaborador]?.birthDate) || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="hover:bg-gray-100 p-4 rounded-lg shadow-md border transition-colors duration-300 border-gray-100">
                                                <h4 className="font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">Informações Profissionais</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Cargo</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.title || emp.cargo}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Departamento</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.department || emp.departamento}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Número</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.employeeNumber || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Jornada</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.workJourneyType || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="hover:bg-gray-100 shadow-md p-4 rounded-lg  border transition-colors duration-300 border-gray-100">
                                                <h4 className="font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">Horas</h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Banco de Horas</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.bankOfHours ?? emp.banco_de_horas}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Horas Diárias</p>
                                                        <p className="text-sm font-medium">{employeeDetails[emp.id_colaborador]?.dailyHours ?? emp.horas_diarias}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">
                            {searchQuery ? 'Nenhum funcionário encontrado com este CPF' : 'Nenhum funcionário cadastrado'}
                        </p>
                    )}
                </div>


                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button
                            onClick={retrocederPagina}
                            disabled={currentPage === 0}
                            className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${currentPage === 0
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-800"
                                }`}
                        >
                            Anterior
                        </button>

                        <span className="text-sm md:text-lg poppins text-gray-700">
                            Página {currentPage + 1} de {totalPages}
                        </span>

                        <button
                            onClick={avancarPagina}
                            disabled={currentPage === totalPages - 1}
                            className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${currentPage === totalPages - 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-800"
                                }`}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeList;