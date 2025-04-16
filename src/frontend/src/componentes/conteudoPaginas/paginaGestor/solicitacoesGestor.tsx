import { useState, useRef, useEffect, useCallback } from "react";
import axios, { AxiosError } from 'axios';
import useSolicitacoes from '../../hooks/useSolicitacoes';
import { FaArrowRight, FaCheck, FaUser } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO';
type AbsenceReason = 'ATESTADO_MEDICO' | null;

interface BaseTicket {
  id_ticket: string;
  id_colaborador: number;
  nome_colaborador: string;
  cpf_colaborador: string;
  tipo_ticket: TicketType;
  mensagem: string;
  status_ticket: TicketStatus;
  data_ticket: string;
  aviso_atrelado?: string;
}

interface VacationTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_FERIAS';
  data_inicio_ferias?: string;
  dias_ferias?: number;
}

interface AbsenceTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_ABONO';
  motivo_abono: AbsenceReason;
  dias_abono?: string[];
  abono_inicio?: string;
  abono_final?: string;
}

type Solicitacao = VacationTicket | AbsenceTicket;

interface PaginatedResponse<T> {
  content: T[];
  number: number;
  totalPages: number;
}

const TicketStatus = {
  EM_AGUARDO: 'EM_AGUARDO',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
} as const;

type TicketStatus = keyof typeof TicketStatus;

interface ResponsePayload {
  novo_status: TicketStatus;
  justificativa?: string;
  ticket: Solicitacao;
}

export default function SolicitacoesGestor() {
  const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);
  const [justificativa, setJustificativa] = useState<string>('');
  const [mostrarJustificativa, setMostrarJustificativa] = useState<boolean>(false);
  const [pagina, setPagina] = useState<number>(0);
  const [filtroStatus, setFiltroStatus] = useState<TicketStatus[]>(['EM_AGUARDO']);
  const itensPorPagina = 5;
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    solicitacoes,
    loading,
    error,
    fetchSolicitacoes,
    atualizarSolicitacoes
  } = useSolicitacoes<PaginatedResponse<Solicitacao>>(
    pagina,
    itensPorPagina,
    filtroStatus
  );

  const totalPaginas = solicitacoes?.totalPages || 1;
  const paginaAtual = solicitacoes?.number || 0;
  const temProximaPagina = paginaAtual < totalPaginas - 1;
  const temPaginaAnterior = paginaAtual > 0;

  const formatarStatus = useCallback((status: string): string => {
    return status.replace(/_/g, ' ');
  }, []);

  const formatarTipoTicket = useCallback((tipo: TicketType): string => {
    switch (tipo) {
      case 'PEDIR_FERIAS': return 'Férias';
      case 'PEDIR_ABONO': return 'Abono';
      default: return tipo;
    }
  }, []);
  const podeAprovarOuReprovar = useCallback((status: TicketStatus) => {
    return status === 'EM_AGUARDO';
  }, []);

  const formatarMotivoAbono = useCallback((motivo: AbsenceReason): string => {
    if (!motivo) return '';
    switch (motivo) {
      case 'ATESTADO_MEDICO': return 'Atestado Médico';
      default: return motivo;
    }
  }, []);

  const truncarTexto = useCallback((texto: string, limite: number): string => {
    return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
  }, []);

  const enviarResposta = useCallback(async (status_novo: TicketStatus) => {
    if (!modalAberto) return;

    if (status_novo === 'REPROVADO' && !justificativa.trim()) {
      alert('Por favor, insira uma justificativa para reprovar a solicitação.');
      return;
    }

    try {
      const payload: ResponsePayload = {
        novo_status: status_novo,
        ...(status_novo === 'REPROVADO' && { justificativa }),
        ticket: {
          ...modalAberto,
          status_ticket: status_novo
        }
      };

      const response = await axios.post('/tickets/responder', payload);

      if (response.status === 200 || response.data.success) {
        await fetchSolicitacoes();
        setModalAberto(null);
        setJustificativa('');
        setMostrarJustificativa(false);
      } else {
        alert('Erro ao processar a resposta. Tente novamente.');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erro ao enviar resposta:', axiosError);
      alert(axiosError.response?.data?.message || 'Erro ao enviar resposta. Tente novamente.');
    }
  }, [modalAberto, justificativa, fetchSolicitacoes]);

  const toggleFiltroStatus = useCallback((status: TicketStatus) => {
    setFiltroStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPagina(0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalAberto(null);
        setJustificativa('');
        setMostrarJustificativa(false);
      }
    };

    if (modalAberto) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalAberto]);

  // Estilo para badges de status
  const StatusBadge = ({ status }: { status: TicketStatus }) => {
    const statusStyles = {
      EM_AGUARDO: 'bg-yellow-100 text-yellow-800',
      APROVADO: 'bg-green-100 text-green-800',
      REPROVADO: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {formatarStatus(status)}
      </span>
    );
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
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
        >
          Solicitações
        </motion.h1>

        {/* Filtros de status */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {Object.keys(TicketStatus).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFiltroStatus(status as TicketStatus)}
              className={`px-4 py-2 rounded-xl border transition-all ${filtroStatus.includes(status as TicketStatus)
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              {formatarStatus(status)}
            </motion.button>
          ))}
        </div>

        {/* Lista de solicitações */}
        <div className="space-y-4">
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
          ) : solicitacoes?.content.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-gray-600 mb-4">
                  {filtroStatus.length === 0
                    ? 'Selecione algum filtro para visualizar as solicitações'
                    : 'Não há solicitações com os filtros selecionados'}
                </p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {solicitacoes?.content.map((solicitacao, index) => (
                <motion.div
                  key={solicitacao.id_ticket}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <motion.div
                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors"
                  >
                    <div className="flex items-center w-full sm:w-auto flex-1 min-w-0">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full flex-shrink-0 mr-4">
                        <FaUser className="text-blue-600 text-xl" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 text-start truncate">
                          {solicitacao.nome_colaborador}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent  ">
                            {formatarTipoTicket(solicitacao.tipo_ticket)}
                          </span>
                          {solicitacao.tipo_ticket === 'PEDIR_ABONO' && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {formatarMotivoAbono(solicitacao.motivo_abono)}
                            </span>
                          )}
                          <StatusBadge status={solicitacao.status_ticket} />
                        </div>
                        <p className="poppins text-xs text-gray-600 mt-1 text-start">
                          {new Date(solicitacao.data_ticket).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: podeAprovarOuReprovar(solicitacao.status_ticket) ? 1.1 : 1 }}
                      whileTap={{ scale: podeAprovarOuReprovar(solicitacao.status_ticket) ? 0.9 : 1 }}
                      className={`text-blue-600 text-lg ml-60 px-3 py-2 rounded-md poppins transition-colors ${podeAprovarOuReprovar(solicitacao.status_ticket)
                          ? 'hover:text-blue-800 cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                        }`}
                      onClick={() => {
                        if (podeAprovarOuReprovar(solicitacao.status_ticket)) {
                          setModalAberto(solicitacao);
                        }
                      }}
                      title={
                        !podeAprovarOuReprovar(solicitacao.status_ticket)
                          ? 'Esta solicitação já foi processada'
                          : 'Visualizar solicitação'
                      }
                    >
                      <FaArrowRight />
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center font-normal justify-center gap-4"
          >

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: !temPaginaAnterior ? 1 : 1.05 }}
                whileTap={{ scale: !temPaginaAnterior ? 1 : 0.95 }}
                onClick={() => setPagina(p => Math.max(p - 1, 0))}
                disabled={!temPaginaAnterior}
                className={`flex items-center px-3 sm:px-6 py-3 rounded-xl ${!temPaginaAnterior
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white "
                  }`}
              >
                <FiChevronLeft className="mr-2" />
                Anterior
              </motion.button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let pageNum;
                  if (totalPaginas <= 5) {
                    pageNum = i;
                  } else if (paginaAtual <= 2) {
                    pageNum = i;
                  } else if (paginaAtual >= totalPaginas - 3) {
                    pageNum = totalPaginas - 5 + i;
                  } else {
                    pageNum = paginaAtual - 2 + i;
                  }

                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPagina(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${paginaAtual === pageNum
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
                whileHover={{ scale: !temProximaPagina ? 1 : 1.05 }}
                whileTap={{ scale: !temProximaPagina ? 1 : 0.95 }}
                onClick={() => setPagina(p => Math.min(p + 1, totalPaginas - 1))}
                disabled={!temProximaPagina}
                className={`flex items-center px-3 sm:px-6 py-3 rounded-xl ${!temProximaPagina
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white "
                  }`}
              >
                
                Próxima
                <FiChevronRight className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Modal de detalhes */}
        <AnimatePresence>
          {modalAberto && podeAprovarOuReprovar(modalAberto.status_ticket) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                ref={modalRef}
                className="bg-white p-6 poppins rounded-xl shadow-xl md:w-2/3 lg:w-1/2 max-w-2xl relative"
              >
                <h2 className="sm:text-2xl text-xl font-bold mb-2 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center">
                  Detalhes da Solicitação
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 sm:mb-6">
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-600 mb-2">Informações do Colaborador</h3>
                    <p className="text-sm"><span className="font-medium">Nome:</span> {modalAberto.nome_colaborador}</p>
                    <p className="text-sm"><span className="font-medium">CPF:</span> {modalAberto.cpf_colaborador}</p>
                  </div>

                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-600 mb-2">Detalhes da Solicitação</h3>
                    <p className="text-sm"><span className="font-medium">Tipo:</span> {formatarTipoTicket(modalAberto.tipo_ticket)}</p>
                    <p className="text-sm p-1"><span className="font-medium">Status:</span> <StatusBadge status={modalAberto.status_ticket} /></p>
                    <p className="text-sm"><span className="font-medium">Data:</span> {new Date(modalAberto.data_ticket).toLocaleString()}</p>
                  </div>
                </div>

                {/* Detalhes específicos por tipo */}
                <div className="mb-2 sm:mb-6">
                  {modalAberto.tipo_ticket === 'PEDIR_FERIAS' && (
                    <div className="bg-blue-50 p-2 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-600 mb-2">Detalhes das Férias</h3>
                      <p className="text-sm"><span className="font-medium">Data de Início:</span> {modalAberto.data_inicio_ferias || 'Não informado'}</p>
                      <p className="text-sm"><span className="font-medium">Duração:</span> {modalAberto.dias_ferias ? `${modalAberto.dias_ferias} dias` : 'Não informado'}</p>
                    </div>
                  )}

                  {modalAberto.tipo_ticket === 'PEDIR_ABONO' && (
                    <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-600 mb-2">Detalhes do Abono</h3>
                      <p className="text-sm"><span className="font-medium">Motivo:</span> {formatarMotivoAbono(modalAberto.motivo_abono) || 'Não informado'}</p>
                      {modalAberto.abono_inicio && (
                        <p className="text-sm"><span className="font-medium">Período:</span> {modalAberto.abono_inicio} {modalAberto.abono_final && `a ${modalAberto.abono_final}`}</p>
                      )}
                      {modalAberto.dias_abono?.length ? (
                        <p className="text-sm"><span className="font-medium">Dias selecionados:</span> {modalAberto.dias_abono.join(', ')}</p>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Mensagem */}
                <div className="mb-2 sm:mb-6 bg-gray-50 p-2 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Mensagem</h3>
                  <p className="text-gray-700 whitespace-pre-line">{modalAberto.mensagem}</p>
                </div>

                {/* Justificativa */}
                {mostrarJustificativa && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mb-2 sm:mb-6 overflow-hidden"
                  >
                    <div className="bg-yellow-50 p-2 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-700 mb-1 sm:mb-2">Justificativa para Reprovação</h3>
                      <textarea
                        placeholder="Insira a justificativa aqui (Máximo 500 caracteres)"
                        value={justificativa}
                        maxLength={500}
                        onChange={(e) => setJustificativa(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2 sm:mt-6">
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => enviarResposta('APROVADO')}
                      className="flex items-center text-sm sm:text-base justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-600 transition-all"
                    >
                      <FaCheck className="mr-2" />
                      Aprovar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (mostrarJustificativa && justificativa.trim()) {
                          enviarResposta('REPROVADO');
                        } else {
                          setMostrarJustificativa(true);
                        }
                      }}
                      className={`flex items-center text-sm sm:text-base justify-center px-6 py-3 rounded-xl shadow-md transition-all ${mostrarJustificativa && justificativa.trim()
                          ? ' bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-700 text-white'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white'
                        }`}
                    >
                      <FaX className="mr-2" />
                      {mostrarJustificativa ? 'Confirmar Reprovação' : 'Reprovar'}
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setModalAberto(null);
                      setJustificativa('');
                      setMostrarJustificativa(false);
                    }}
                    className="bg-gray-500 text-sm sm:text-base text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition-all"
                  >
                    Fechar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}