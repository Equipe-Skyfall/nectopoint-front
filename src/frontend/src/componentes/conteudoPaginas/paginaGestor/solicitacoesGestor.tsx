import { useState, useRef, useEffect, useCallback } from "react";
import axios, { AxiosError } from 'axios';
import useSolicitacoes from '../../hooks/useSolicitacoes';
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";


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


  return (
    <div className="p-6 flex flex-col items-center poppins">
      <div className="w-full max-w-3xl mt-16 z-20 ">
        <h1 className="mb-6 text-2xl font-semibold text-blue-600 poppins text-center mt-10">Solicitações</h1>

        <div className="flex flex-col gap-6">
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
                  <FaArrowRight />
                </button>
              </div>
            ))
          )}
        </div>
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