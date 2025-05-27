import { useState, useRef, useEffect } from "react";
import { FaArrowRight, FaUser, FaFilePdf, FaFileImage, FaDownload, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FiltrosSoli from '../../filtros/filtroSoli';
import useHistoricoSolicitacoes from '../../hooks/useHistoricoSolicitacoes';
import useUserData from '../../hooks/userData';
import recarregar from "../../hooks/hooksChamarBackend/recarregar";

const TicketStatus = {
  EM_AGUARDO: 'EM_AGUARDO',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
} as const;

type TicketStatus = keyof typeof TicketStatus;
type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO' | 'PEDIR_HORA_EXTRA' | 'SOLICITAR_FOLGA' | 'ALTERAR_PONTOS';
type AbsenceReason = 'ATESTADO_MEDICO' | null;

interface Solicitacao {
  id_ticket: string;
  id_colaborador: number;
  nome_colaborador: string;
  cpf_colaborador: string;
  tipo_ticket: TicketType;
  mensagem: string;
  status_ticket: TicketStatus;
  data_ticket: string;
  id_gerente?: number | null;
  nome_gerente?: string | null;
  justificativa?: string | null;
  data_inicio_ferias?: string;
  dias_ferias?: number;
  motivo_abono?: AbsenceReason;
  dias_abono?: string[];
  id_registro?: string;
  id_aviso?: string;
  pontos_anterior?: any[];
  pontos_ajustado?: any[];
  lista_horas?: string[];
  filePath?: string;
}

export default function HistoricoSolicitacoes() {
  const userData = useUserData();
  const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);
  const [ticketDetalhado, setTicketDetalhado] = useState<Solicitacao | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [filtroStatus, setFiltroStatus] = useState<TicketStatus[]>(['EM_AGUARDO', 'APROVADO', 'REPROVADO']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const itensPorPagina = 5;
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    solicitacoes,
    loading,
    error,
    formatarDataBrasil,
    formatarDiasAbono,
    formatarStatus,
    formatarTipoTicket,
    formatarMotivoAbono,
    abrirModalDetalhes,
    toggleFiltroStatus,
    limparFiltros,
    getFileDownloadUrl
  } = useHistoricoSolicitacoes({
    ticketsUsuario: userData.tickets_usuario || [],
    page: pagina,
    size: itensPorPagina,
    statusTicket: filtroStatus,
    startDate,
    endDate
  });
  useEffect(() => {
    const handleSSEUpdate = (event) => {
      console.log('🎯 SSE update received - calling fetchSolicitacoes');
      
      // Call the fetch function directly with a delay
      setTimeout(() => {
        console.log('🔄 Calling fetchSolicitacoes after delay');
        recarregar();
      }, 0);
    };

    // Listen for SSE events
    window.addEventListener('sseDataUpdate', handleSSEUpdate);

    return () => {
      window.removeEventListener('sseDataUpdate', handleSSEUpdate);
    };
  }, [recarregar]);
  // Ajusta a página se não houver mais solicitações
  useEffect(() => {
    if (solicitacoes === null || (solicitacoes.content.length === 0 && pagina > 0)) {
      setPagina(p => Math.max(p - 1, 0));
    }
  }, [solicitacoes, pagina]);

  // useEffect para fechar o modal ao clicar fora do mesmo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalAberto(null);
        setFileError(null);
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

  // Verifica se tem algum anexo no abono
  useEffect(() => {
    if (ticketDetalhado?.tipo_ticket === 'PEDIR_ABONO' && !ticketDetalhado.filePath) {
      setFileError('Nenhum anexo foi enviado com esta solicitação.');
    } else {
      setFileError(null);
    }
  }, [ticketDetalhado]);

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

  // Função para download de arquivo
  const handleDownload = async (ticketId: string, fileName: string) => {
    try {
      const downloadUrl = getFileDownloadUrl(ticketId);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName || 'anexo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Erro ao baixar arquivo:', err);
      setFileError('Não foi possível baixar o arquivo. Tente novamente.');
    }
  };

  // Paginação
  const totalPaginas = solicitacoes?.totalPages || 1;
  const paginaAtual = solicitacoes?.number || 0;
  const temProximaPagina = paginaAtual < totalPaginas - 1;
  const temPaginaAnterior = paginaAtual > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pt-2 min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cabeçalho com título */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-5 pb-4">
            Histórico de Solicitações
          </h1>
        </motion.div>

        {/* Botões de filtro por status */}
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {Object.keys(TicketStatus).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleFiltroStatus(status as TicketStatus, setFiltroStatus, setPagina)}
              className={`px-4 py-2 rounded-xl border transition-all ${filtroStatus.includes(status as TicketStatus)
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
            >
              {formatarStatus(status)}
            </motion.button>
          ))}
        </div>

        {/* Componente de filtros adicionais */}
        <FiltrosSoli
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          limparFiltros={() => limparFiltros(setStartDate, setEndDate, setPagina)}
        />

        {/* Container do conteúdo */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Lista de solicitações ou mensagens de estado */}
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
                    <div className="bg-gray-50 p-8 rounded-xl text-center max-w-md">
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
                        className="bg-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-100 mb-4"
                      >
                        <motion.div
                          whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                          className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors"
                        >
                          {/* Informações da solicitação */}
                          <div className="flex items-center w-full sm:w-auto flex-1 min-w-0">
                            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-3 rounded-full flex-shrink-0 mr-4">
                              <FaUser className="text-blue-600 text-xl" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-gray-800 text-start truncate">
                                {formatarTipoTicket(solicitacao.tipo_ticket)}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {solicitacao.tipo_ticket === 'PEDIR_ABONO' && solicitacao.motivo_abono && (
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {formatarMotivoAbono(solicitacao.motivo_abono)}
                                  </span>
                                )}
                                <StatusBadge status={solicitacao.status_ticket} />
                              </div>
                              <p className="poppins text-xs text-gray-600 mt-1 text-start">
                                {formatarDataBrasil(solicitacao.data_ticket)}
                              </p>
                            </div>
                          </div>
                          {/* Botão para abrir detalhes */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-blue-600 text-lg px-3 py-2 rounded-md poppins transition-colors"
                            onClick={() => {
                              abrirModalDetalhes(solicitacao, setTicketDetalhado, setLoadingModal, setModalAberto);
                            }}
                            title="Visualizar detalhes da solicitação"
                          >
                            <FaArrowRight />
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Navegação de páginas */}
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
                            className={`sm:w-10 sm:h-10 w-5 h-10 rounded-full flex items-center justify-center ${paginaAtual === pageNum
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
            </div>
          </div>
        </motion.div>

        {/* Modal de detalhes da solicitação */}
        <AnimatePresence>
          {modalAberto && (
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
                {loadingModal ? (
                  <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  ticketDetalhado && (
                    <>
                      {/* Título do modal */}
                      <h2 className="sm:text-2xl text-xl font-bold mb-2 sm:mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center">
                        Detalhes da Solicitação
                      </h2>
                      
                      {/* Informações da solicitação */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 sm:mb-6">
                        <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-600 mb-2">Informações Básicas</h3>
                          <p className="text-sm"><span className="font-medium">Tipo:</span> {formatarTipoTicket(ticketDetalhado.tipo_ticket)}</p>
                          <p className="text-sm"><span className="font-medium">Data:</span> {formatarDataBrasil(ticketDetalhado.data_ticket)}</p>
                        </div>
                        <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                          <h3 className="font-semibold text-blue-600 mb-2">Status</h3>
                          <p className="text-sm p-1"><StatusBadge status={ticketDetalhado.status_ticket} /></p>
                          {ticketDetalhado.nome_gerente && (
                            <p className="text-sm">
                              <span className="font-medium">
                                {ticketDetalhado.status_ticket === 'APROVADO' ? 'Aprovado por:' : 'Reprovado por:'}
                              </span> {ticketDetalhado.nome_gerente}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Detalhes específicos por tipo de ticket */}
                      {ticketDetalhado.tipo_ticket === 'PEDIR_FERIAS' && (
                        
                        
                        <div className="bg-blue-50 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6">
                          <h3 className="font-semibold text-blue-600 mb-2">Detalhes das Férias</h3>
                          <p className="text-sm"><span className="font-medium">Data de Início:</span> { formatarDataBrasil(ticketDetalhado.data_ticket)}</p>
                            
                        </div>
                      )}

                      {ticketDetalhado.tipo_ticket === 'PEDIR_ABONO' && (
                        <div className="bg-purple-50 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6">
                          <h3 className="font-semibold text-purple-600 mb-2">Detalhes do Abono</h3>
                          <p className="text-sm"><span className="font-medium">Motivo:</span> {formatarMotivoAbono(ticketDetalhado.motivo_abono) || 'Não informado'}</p>
                          {ticketDetalhado.dias_abono?.length ? (
                            <p className="text-sm">
                              <span className="font-medium">Dias selecionados:</span> {formatarDiasAbono(ticketDetalhado.dias_abono)}
                            </p>
                          ) : null}
                        </div>
                      )}

                      {ticketDetalhado.tipo_ticket === 'SOLICITAR_FOLGA' && ticketDetalhado.id_registro && (
                        <div className="bg-green-50 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6">
                          <h3 className="font-semibold text-green-600 mb-2">Detalhes da Folga</h3>
                          <p className="text-sm">
                            <span className="font-medium">ID do Registro:</span> {ticketDetalhado.id_registro}
                          </p>
                        </div>
                      )}

                      {ticketDetalhado.tipo_ticket === 'ALTERAR_PONTOS' && ticketDetalhado.id_registro && (
                        <div className="bg-yellow-50 p-2 sm:p-4 rounded-lg mb-2 sm:mb-6">
                          <h3 className="font-semibold text-yellow-600 mb-2">Detalhes do Ajuste</h3>
                          <p className="text-sm">
                            <span className="font-medium">ID do Registro:</span> {ticketDetalhado.id_registro}
                          </p>
                          {ticketDetalhado.id_aviso && (
                            <p className="text-sm">
                              <span className="font-medium">ID do Aviso:</span> {ticketDetalhado.id_aviso}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Mensagem da solicitação */}
                      <div className="mb-2 sm:mb-6 bg-gray-50 p-2 sm:p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Mensagem</h3>
                        <p className="text-gray-700 whitespace-pre-line">{ticketDetalhado.mensagem}</p>
                      </div>

                      {/* Anexo para abonos */}
                      {ticketDetalhado.tipo_ticket === 'PEDIR_ABONO' && (
                        <div className="mb-2 sm:mb-6 bg-gray-50 p-2 sm:p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-700 mb-2">Anexo</h3>
                          {fileError ? (
                            <p className="text-red-600 text-sm flex items-center">
                              <FaExclamationTriangle className="mr-2" />
                              {fileError}
                            </p>
                          ) : ticketDetalhado.filePath ? (
                            <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                {ticketDetalhado.filePath.match(/\.(pdf)$/i) ? (
                                  <FaFilePdf className="text-red-500 text-xl" />
                                ) : (
                                  <FaFileImage className="text-green-500 text-xl" />
                                )}
                                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                  {ticketDetalhado.filePath.split('/').pop() || 'Anexo sem nome'}
                                </span>
                              </div>
                              <button
                                onClick={() => handleDownload(ticketDetalhado.id_ticket, ticketDetalhado.filePath.split('/').pop() || 'anexo')}
                                className="flex items-center text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
                              >
                                <FaDownload className="mr-2" />
                                Baixar
                              </button>
                            </div>
                          ) : (
                            <p className="text-gray-600 text-sm flex items-center">
                              <FaExclamationTriangle className="mr-2 text-yellow-500" />
                              Nenhum anexo foi enviado com esta solicitação.
                            </p>
                          )}
                        </div>
                      )}

                      {/* Justificativa para reprovação */}
                      {ticketDetalhado.justificativa && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-700 mb-2">Justificativa</h3>
                          <p className="text-sm text-gray-600 whitespace-pre-line">{ticketDetalhado.justificativa}</p>
                        </div>
                      )}

                      {/* Botão para fechar */}
                      <div className="flex justify-center mt-2 sm:mt-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setModalAberto(null);
                            setFileError(null);
                          }}
                          className="bg-gray-500 text-sm sm:text-base text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-600 transition-all"
                        >
                          Fechar
                        </motion.button>
                      </div>
                    </>
                  )
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}