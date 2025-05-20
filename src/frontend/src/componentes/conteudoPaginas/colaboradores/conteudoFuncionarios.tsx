import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEdit, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import JornadaBadge from '../../badges/jornadaBadge';
import StatusBadge from '../../badges/statusBadge';
import FiltrosColaborador from '../../filtros/filtoColaborador';
import formatarMinutosEmHorasEMinutos from '../../hooks/formatarHoras';
import PaginationControls from '../../paginacao/paginationControls';

// Format date function
const formatarDataNascimento = (data: string) => {
  if (!data) return 'N/A';
  try {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch {
    return data;
  }
};

interface ConteudoFuncProps {
  employeesToShow: any[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  jornadaSelecionada: string;
  setJornadaSelecionada: (jornada: string) => void;
  statusSelecionado: string;
  setStatusSelecionado: (status: string) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  expandedEmployee: number | null;
  employeeDetails: any;
  isDeleting: number | null;
  navigateToEdit: (id: number) => void;
  toggleExpand: (id: number) => void;
  handleDeactivate: (id: number, e: React.MouseEvent) => void;
}

export default function ConteudoFunc({
  employeesToShow,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  jornadaSelecionada,
  setJornadaSelecionada,
  statusSelecionado,
  setStatusSelecionado,
  currentPage,
  totalPages,
  setCurrentPage,
  expandedEmployee,
  employeeDetails,
  isDeleting,
  navigateToEdit,
  toggleExpand,
  handleDeactivate
}: ConteudoFuncProps) {
    
    
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-16 min-h-screen p-4 md:p-6 poppins"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
        >
          Colaboradores
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <FiltrosColaborador
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusSelecionado={statusSelecionado}
              setStatusSelecionado={setStatusSelecionado}
              jornadaSelecionada={jornadaSelecionada}
              setJornadaSelecionada={setJornadaSelecionada}
              limparFiltros={() => {
                setSearchQuery('');
                setJornadaSelecionada('');
                setStatusSelecionado('');
                setCurrentPage(0);
              }}
            />
          </div>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/cadastrar"
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 mt-10 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus className="" />
            Cadastrar Colaborador
          </motion.a>
        </div>

        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
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
        ) : employeesToShow.length === 0 ? (
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
            <div className="space-y-4">
              <AnimatePresence>
                {employeesToShow.map((emp, index) => (
                  <motion.div
                    key={emp.id_colaborador}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                    className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                      emp.status === 'INATIVO' ? 'border-gray-300 bg-gray-50' : 'border-gray-100'
                    }`}
                  >
                    <motion.div
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                      className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer transition-colors"
                      onClick={() => toggleExpand(emp.id_colaborador)}
                    >
                      <div className="flex items-center w-full sm:w-auto flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full flex-shrink-0 mr-4">
                          <FaUser className="text-blue-600 text-xl" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 text-start truncate">{emp.nome}</h3>
                          <div className="text-start">
                            <StatusBadge status={emp.status} />
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-sm text-gray-600">ID: {emp.id_colaborador}</span>
                            <span className="text-sm text-gray-600">CPF: {emp.cpf}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {emp.status !== 'INATIVO' && (
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
                        )}

                        <motion.button
                          whileHover={{ scale : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleDeactivate(emp.id_colaborador, e)}
                          disabled={isDeleting === emp.id_colaborador || emp.status === 'INATIVO'}
                          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                            isDeleting === emp.id_colaborador
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : emp.status === 'INATIVO'
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-orange-50 text-red-600 hover:bg-orange-100'
                          }`}
                          title={emp.status === 'INATIVO' ? 'Usuário inativo' : 'Desativar'}
                        >
                          <FaTrash className="mr-2" />
                          <span className="hidden sm:inline">
                            {isDeleting === emp.id_colaborador
                              ? 'Desativando...'
                              : emp.status === 'INATIVO'
                              ? 'Desativado'
                              : 'Desativar'}
                          </span>
                        </motion.button>

                        <div className="ml-2 text-gray-400">
                          {expandedEmployee === emp.id_colaborador ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>
                    </motion.div>

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
                                      {formatarMinutosEmHorasEMinutos(employeeDetails[emp.id_colaborador]?.bankOfHours) ??
                                        emp.banco_de_horas ??
                                        'N/A'}
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

            {totalPages > 1 && (
              <PaginationControls
                totalPaginas={totalPages}
                paginaAtual={currentPage}
                setPaginaAtual={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}