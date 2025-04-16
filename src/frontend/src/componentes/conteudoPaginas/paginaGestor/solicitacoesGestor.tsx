import { useState, useRef, useEffect, useCallback } from "react";
import axios, { AxiosError } from 'axios';
<<<<<<< Updated upstream
import useSolicitacoes from '../../hooks/useSolicitacoes';
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

<<<<<<< Updated upstream
type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO';
=======
type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO' | 'SOLICITAR_FOLGA' | 'SOLICITAR_HORA_EXTRA' | 'CORRECAO_TURNO';
>>>>>>> Stashed changes
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

interface DayOffTicket extends BaseTicket {
  tipo_ticket: 'SOLICITAR_FOLGA';
  data_inicio?: string;
  data_fim?: string;
}

interface OvertimeTicket extends BaseTicket {
  tipo_ticket: 'SOLICITAR_HORA_EXTRA';
  data?: string;
  horas?: number;
}

interface ShiftCorrectionTicket extends BaseTicket {
  tipo_ticket: 'CORRECAO_TURNO';
  data_correcao?: string;
  pontos_anterior?: string[];
  pontos_ajustado?: string[];
}

type Solicitacao = VacationTicket | AbsenceTicket | DayOffTicket | OvertimeTicket | ShiftCorrectionTicket;

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
=======
import { FaArrowRight, FaCheck, FaUser } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useSolicitacoes, { Solicitacao, TicketStatus } from '../../hooks/useSolicitacoes';

>>>>>>> Stashed changes

export default function SolicitacoesGestor() {
  const [pagina, setPagina] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<TicketStatus[]>(['EM_AGUARDO']);
  const [scrollPosition, setScrollPosition] = useState(0);

  const itensPorPagina = 5;
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    solicitacoes,
    loading,
    error,
    modalAberto,
    justificativa,
    mostrarJustificativa,
    loadingResposta,
    setModalAberto,
    setJustificativa,
    setMostrarJustificativa,
    formatarData,
    formatarStatus,
    formatarTipoTicket,
    formatarMotivoAbono,
    enviarResposta,
    atualizarSolicitacoes
  } = useSolicitacoes(pagina, itensPorPagina, filtroStatus);

  // Efeito para controlar o scroll da página quando o modal abre/fecha
  useEffect(() => {
    if (modalAberto) {
      // Salva a posição do scroll e desabilita
      setScrollPosition(window.scrollY);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      // Restaura o scroll
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }

    return () => {
      // Limpeza para garantir que o scroll seja restaurado
      document.body.style.overflow = 'auto';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
      }
    };
  }, [modalAberto, scrollPosition]);

  const totalPaginas = solicitacoes?.totalPages || 1;
  const paginaAtual = solicitacoes?.number || 0;
  const temProximaPagina = paginaAtual < totalPaginas - 1;
  const temPaginaAnterior = paginaAtual > 0;

  const podeAprovarOuReprovar = (status: TicketStatus) => status === 'EM_AGUARDO';

<<<<<<< Updated upstream
  const formatarTipoTicket = useCallback((tipo: TicketType): string => {
    switch (tipo) {
      case 'PEDIR_FERIAS': return 'Férias';
      case 'PEDIR_ABONO': return 'Abono';
      case 'SOLICITAR_FOLGA': return 'Folga';
      case 'SOLICITAR_HORA_EXTRA': return 'Hora Extra';
      case 'CORRECAO_TURNO': return 'Correção de Turno';
      default: return tipo;
    }
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
=======
  const toggleFiltroStatus = (status: TicketStatus) => {
>>>>>>> Stashed changes
    setFiltroStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPagina(0);
  };

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
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalAberto, setModalAberto]);

<<<<<<< Updated upstream
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalAberto]);

  return (
    <div className="p-6 flex flex-col items-center poppins mt-16">
      <div className="w-full max-w-3xl z-10 relative">
        <h1 className="mb-6 text-2xl font-semibold text-blue-600 poppins text-center">Solicitações</h1>
        <div className="flex flex-col gap-6">
=======
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
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
        >
          Solicitações
        </motion.h1>

        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {Object.keys(TicketStatus).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFiltroStatus(status as TicketStatus)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                filtroStatus.includes(status as TicketStatus)
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {formatarStatus(status)}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
>>>>>>> Stashed changes
          {loading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : solicitacoes?.content.length === 0 ? (
            <p>Nenhuma solicitação encontrada</p>
          ) : (
            solicitacoes?.content.map((solicitacao) => (
              <div key={solicitacao.id_ticket} className="bg-gray-200 p-4 rounded-md w-full shadow-md flex justify-between items-center">
                <div className="text-left">
                  <p className="poppins-semibold text-blue-600">{solicitacao.nome_colaborador}</p>
                  <p className="poppins text-sm ">{formatarTipoTicket(solicitacao.tipo_ticket)}</p>
                  {solicitacao.tipo_ticket === 'PEDIR_ABONO' && (
                    <p className="poppins text-xs">Motivo: {formatarMotivoAbono(solicitacao.motivo_abono)}</p>
                  )}
                  <p className="poppins text-xs text-gray-600 truncate">{truncarTexto(solicitacao.mensagem, 20)}</p>
                  <p className="poppins text-sm">
                    Status: {formatarStatus(solicitacao.status_ticket)}
                  </p>
                </div>
                <button
                  className=" text-blue-600 text-lg px-3 py-1 rounded-md poppins hover:text-blue-800 transition-colors"
                  onClick={() => setModalAberto(solicitacao)}
                >
<<<<<<< Updated upstream
                  <FaArrowRight />
                </button>
              </div>
            ))
          )}
        </div>
=======
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
                          <span className="text-sm text-gray-600 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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
                          {formatarData(solicitacao.data_ticket)}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: podeAprovarOuReprovar(solicitacao.status_ticket) ? 1.1 : 1 }}
                      whileTap={{ scale: podeAprovarOuReprovar(solicitacao.status_ticket) ? 0.9 : 1 }}
                      className={`text-blue-600 text-lg ml-60 px-3 py-2 rounded-md poppins transition-colors ${
                        podeAprovarOuReprovar(solicitacao.status_ticket)
                          ? 'hover:text-blue-800 cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={() => podeAprovarOuReprovar(solicitacao.status_ticket) && setModalAberto(solicitacao)}
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
                className={`flex items-center px-3 sm:px-6 py-3 rounded-xl ${
                  !temPaginaAnterior
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                }`}
              >
                <FiChevronLeft className="mr-2" />
                Anterior
              </motion.button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let pageNum;
                  if (totalPaginas <= 5) pageNum = i;
                  else if (paginaAtual <= 2) pageNum = i;
                  else if (paginaAtual >= totalPaginas - 3) pageNum = totalPaginas - 5 + i;
                  else pageNum = paginaAtual - 2 + i;

                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPagina(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paginaAtual === pageNum
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
                className={`flex items-center px-3 sm:px-6 py-3 rounded-xl ${
                  !temProximaPagina
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                }`}
              >
                Próxima
                <FiChevronRight className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

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
                    <p className="text-sm"><span className="font-medium">Data:</span> {formatarData(modalAberto.data_ticket)}</p>
                  </div>
                </div>

                <div className="mb-2 sm:mb-6">
                  {modalAberto.tipo_ticket === 'PEDIR_FERIAS' ? (
                    <div className="bg-blue-50 p-2 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-600 mb-2">Detalhes das Férias</h3>
                      <p className="text-sm">
                        <span className="font-medium">Data de Início:</span>
                        {formatarData(modalAberto.data_inicio_ferias)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Duração:</span>
                        {modalAberto.dias_ferias ? `${modalAberto.dias_ferias} dias` : 'Não informado'}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-purple-50 p-2 sm:p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-600 mb-2">Detalhes do Abono</h3>
                      <p className="text-sm">
                        <span className="font-medium">Motivo:</span>
                        {formatarMotivoAbono(modalAberto.motivo_abono)}
                      </p>
                      {modalAberto.abono_inicio && (
                        <p className="text-sm">
                          <span className="font-medium">Período:</span>
                          {formatarData(modalAberto.abono_inicio)}
                          {modalAberto.abono_final && ` a ${formatarData(modalAberto.abono_final)}`}
                        </p>
                      )}
                      {modalAberto.dias_abono?.length && (
                        <p className="text-sm">
                          <span className="font-medium">Dias selecionados:</span>
                          {modalAberto.dias_abono.map(formatarData).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-2 sm:mb-6 bg-gray-50 p-2 sm:p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Mensagem</h3>
                  <p className="text-gray-700 whitespace-pre-line">{modalAberto.mensagem}</p>
                </div>

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

                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2 sm:mt-6">
                  <div className="flex gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        try {
                          await enviarResposta('APROVADO');
                          setModalAberto(null);
                        } catch (error) {
                          alert(error);
                        }
                      }}
                      className="flex items-center text-sm sm:text-base justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-600 transition-all"
                      disabled={loadingResposta}
                    >
                      <FaCheck className="mr-2" />
                      {loadingResposta ? 'Processando...' : 'Aprovar'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={async () => {
                        if (mostrarJustificativa && justificativa.trim()) {
                          try {
                            await enviarResposta('REPROVADO');
                            setModalAberto(null);
                          } catch (error) {
                            alert(error);
                          }
                        } else {
                          setMostrarJustificativa(true);
                        }
                      }}
                      className={`flex items-center text-sm sm:text-base justify-center px-6 py-3 rounded-xl shadow-md transition-all ${
                        mostrarJustificativa && justificativa.trim()
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-700 text-white'
                          : 'bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white'
                      }`}
                      disabled={loadingResposta}
                    >
                      <FaX className="mr-2" />
                      {loadingResposta ? 'Processando...' : mostrarJustificativa ? 'Confirmar Reprovação' : 'Reprovar'}
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setModalAberto(null)}
                    className="bg-gray-500 text-sm sm:text-base text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition-all"
                  >
                    Fechar
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
>>>>>>> Stashed changes
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          className={`px-4 py-2 rounded-lg ${!temPaginaAnterior
            ? "bg-gray-300 text-gray-500 poppins cursor-not-allowed"
            : "bg-blue-600 poppins text-white hover:bg-blue-800"
            }`}
          onClick={() => setPagina(p => Math.max(p - 1, 0))}
          disabled={!temPaginaAnterior}
        >
          Anterior
        </button>
        <span className="text-sm md:text-lg poppins text-gray-700">
          Página {paginaAtual + 1} de {totalPaginas}
        </span>
        <button
          className={`px-4 py-2 rounded-lg ${!temProximaPagina
            ? "poppins bg-gray-300 text-gray-500 cursor-not-allowed"
            : "poppins bg-blue-600 text-white hover:bg-blue-800"
            }`}
          onClick={() => setPagina(p => Math.min(p + 1, totalPaginas - 1))}
          disabled={!temProximaPagina}
        >
          Próximo
        </button>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-4">
          <div ref={modalRef} className="bg-white p-6 poppins rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/3 text-center relative">
            <h2 className="text-xl poppins mb-10 text-blue-600">Detalhes da Solicitação</h2>
            <p className="text-left poppins">Colaborador: <span className="text-gray-700">{modalAberto.nome_colaborador}</span></p>
            <p className="text-left poppins">CPF: <span className="text-gray-700">{modalAberto.cpf_colaborador}</span></p>
            <p className="text-left poppins">Tipo: <span className="text-gray-700">{formatarTipoTicket(modalAberto.tipo_ticket)}</span></p>
            
            {modalAberto.tipo_ticket === 'PEDIR_ABONO' && (
              <p className="text-left poppins">Motivo Abono: <span className="text-gray-700">{formatarMotivoAbono(modalAberto.motivo_abono)}</span></p>
            )}
            
            {modalAberto.tipo_ticket === 'SOLICITAR_FOLGA' && (
              <p className="text-left poppins">
                Período: {modalAberto.data_inicio} até {modalAberto.data_fim}
              </p>
            )}
            
            {modalAberto.tipo_ticket === 'SOLICITAR_HORA_EXTRA' && (
              <p className="text-left poppins">
                Data: {modalAberto.data} - Horas: {modalAberto.horas}
              </p>
            )}
            
            {modalAberto.tipo_ticket === 'CORRECAO_TURNO' && (
              <div className="text-left">
                <p className="poppins">Data Correção: {modalAberto.data_correcao}</p>
                <p className="poppins">Pontos Ajustados: {modalAberto.pontos_ajustado?.join(', ')}</p>
              </div>
            )}

            <p className="text-left poppins">Mensagem: <span className="text-gray-700">{modalAberto.mensagem}</span></p>
            <p className="text-left poppins">Status: <span className="text-gray-700">{formatarStatus(modalAberto.status_ticket)}</span></p>
            <p className="text-left poppins">Data: <span className="text-gray-700">{new Date(modalAberto.data_ticket).toLocaleString()}</span></p>

            {mostrarJustificativa && (
              <div className="mt-4">
                <textarea
                  placeholder="Insira a justificativa aqui (Máximo 500 caracteres)"
                  value={justificativa}
                  maxLength={500}
                  onChange={(e) => setJustificativa(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg "
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between mt-10 gap-2">
              <div className="flex sm:flex-none sm:flex-0 gap-2 justify-center">
                <button
                  className="bg-green-500 poppins text-white sm:px-4 px-14 py-4 rounded-full  hover:bg-green-600 transition-colors"
                  onClick={() => enviarResposta('APROVADO')}
                >
                  <FaCheck className="" />
                </button>

                <button
                  className={`poppins text-white sm:!px-4 !px-14 py-4 rounded-full transition-colors  ${mostrarJustificativa && justificativa.trim()
                    ? 'bg-red-600 hover:bg-red-700 '
                    : 'bg-red-500 hover:bg-red-600 px-2 !py-1 '
                    }`}
                  onClick={() => {
                    if (mostrarJustificativa && justificativa.trim()) {
                      enviarResposta('REPROVADO');
                    } else {
                      setMostrarJustificativa(true);
                    }
                  }}
                >
                  {mostrarJustificativa ? <span className="flex sm:-mr-0 sm:-ml-0 sm:flex-none -mr-10 -ml-10 sm:text-base text-xs">Confirmar Reprova</span> : <FaX />}
                </button>
              </div>
              <button
                className="bg-gray-400 poppins text-white px-2 py-3 sm:py-2 rounded-full flex-1 hover:bg-gray-500 transition-colors"
                onClick={() => setModalAberto(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}