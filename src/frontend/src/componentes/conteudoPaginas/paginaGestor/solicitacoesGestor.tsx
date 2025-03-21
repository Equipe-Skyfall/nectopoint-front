import { useState, useRef, useEffect } from "react";
import axios from 'axios';

interface Solicitacao {
    id_ticket: string;
    id_colaborador: number;
    tipo_ticket: string;
    mensagem: string;
    aviso_atrelado?: string;
    status_ticket: string;
}

const TipoStatus = {
    EM_AGUARDO: 'EM_AGUARDO',
    APROVADO: 'APROVADO',
    REPROVADO: 'REPROVADO',
    RESOLVIDO: 'RESOLVIDO',
} as const;

type TipoStatus = keyof typeof TipoStatus;

export default function SolicitacoesGestor() {
    const [pagina, setPagina] = useState(1);
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const itensPorPagina = 5;
    const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);
    const [justificativa, setJustificativa] = useState<string>('');
    const [mostrarJustificativa, setMostrarJustificativa] = useState<boolean>(false);

    const modalRef = useRef<HTMLDivElement | null>(null);

    // Busca as solicitações ao carregar o componente ou mudar a página
    const fetchSolicitacoes = async () => {
        try {
            const response = await axios.get('/tickets/listar', {
                params: {
                    page: pagina - 1,
                    size: itensPorPagina,
                    statusTicket: TipoStatus.EM_AGUARDO,
                },
            });
            setSolicitacoes(response.data.content);
            setTotalPaginas(response.data.totalPages);
        } catch (error) {
            console.error('Erro ao buscar solicitações:', error);
        }
    };

    useEffect(() => {
        fetchSolicitacoes();
    }, [pagina]);

    // Trunca o texto para exibir uma prévia
    const truncarTexto = (texto: string, limite: number) => {
        return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
    };

    // Fecha o modal ao clicar fora dele
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

    // Função para enviar a resposta do gerente
    const enviarResposta = async (status_novo: TipoStatus) => {
        if (!modalAberto) return;

        // Validação: Justificativa é obrigatória para REPROVADO
        if (status_novo === 'REPROVADO' && !justificativa.trim()) {
            alert('Por favor, insira uma justificativa para reprovar a solicitação.');
            return;
        }

        // Cria o JSON de resposta
        const resposta = {
            justificativa: status_novo === 'REPROVADO' ? justificativa : undefined,
            status_novo: status_novo,
            ticket: modalAberto,
        };

        try {
            // Envia a resposta para o backend
            await axios.post('/tickets/resposta', resposta);

            // Recarrega as solicitações após a resposta
            await fetchSolicitacoes();

            // Se a página atual ficar vazia, volta para a página anterior
            if (solicitacoes.length === 1 && pagina > 1) {
                setPagina(pagina - 1);
            }

            // Fecha o modal e limpa os estados
            setModalAberto(null);
            setJustificativa('');
            setMostrarJustificativa(false);
        } catch (error) {
            console.error('Erro ao enviar resposta:', error);
            alert('Erro ao enviar resposta. Tente novamente.');
        }
    };

    return (
        <div className="p-6 flex flex-col items-center">
            <div className="w-full max-w-3xl mt-16 z-20 relative">
                <h1 className="poppins-semibold text-4xl font-bold mb-4 text-center">Solicitações</h1>
                <div className="flex flex-col gap-6">
                    {solicitacoes.map((solicitacao) => (
                        <div key={solicitacao.id_ticket} className="bg-gray-200 p-4 rounded w-full shadow-md flex justify-between items-center">
                            <div className="text-left">
                                <p className="poppins-semibold">Colaborador ID: {solicitacao.id_colaborador}</p>
                                <p className="poppins text-sm">{solicitacao.tipo_ticket}</p>
                                <p className="poppins text-xs text-gray-600 truncate">{truncarTexto(solicitacao.mensagem, 20)}</p>
                                {solicitacao.aviso_atrelado ? (
                                    <p className="poppins text-xs text-blue-500">Anexo disponível</p>
                                ) : (
                                    <p className="poppins text-xs text-red-500">Anexo indisponível</p>
                                )}
                            </div>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded poppins"
                                onClick={() => setModalAberto(solicitacao)}
                            >
                                Ver detalhes
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Botões de paginação */}
            <div className="flex items-center justify-center mt-6 w-full max-w-3xl gap-4">
                <button
                    className={`px-4 py-2 rounded ${pagina === 1 ? "bg-gray-400 poppins cursor-not-allowed" : "bg-blue-500 poppins text-white hover:bg-blue-600"}`}
                    onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                    disabled={pagina === 1}
                >
                    Voltar
                </button>
                <span className="poppins text-lg font-semibold">Página {pagina} de {totalPaginas}</span>
                <button
                    className={`px-4 py-2 rounded ${pagina === totalPaginas ? "poppins bg-gray-400 cursor-not-allowed" : "poppins bg-blue-500 text-white hover:bg-blue-600"}`}
                    onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
                    disabled={pagina === totalPaginas}
                >
                    Avançar
                </button>
            </div>

            {/* Modal de detalhes */}
            {modalAberto && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-4">
                    <div ref={modalRef} className="bg-white p-6 poppins rounded shadow-lg w-full md:w-2/3 lg:w-1/3 text-center relative">
                        <h2 className="text-xl poppins-semibold mb-2">Detalhes da Solicitação</h2>
                        <p className="text-left poppins"><strong>Colaborador ID:</strong> {modalAberto.id_colaborador}</p>
                        <p className="text-left poppins"><strong>Motivo:</strong> {modalAberto.tipo_ticket}</p>
                        <p className="text-left poppins"><strong>Justificativa:</strong> {modalAberto.mensagem}</p>
                        <p className="text-left poppins"><strong>Status:</strong> {modalAberto.status_ticket}</p>
                        {modalAberto.aviso_atrelado ? (
                            <p className="text-left poppins text-blue-500">Anexo disponível</p>
                        ) : (
                            <p className="text-left poppins text-red-500">Anexo indisponível</p>
                        )}

                        {/* Campo de justificativa (aparece apenas ao recusar) */}
                        {mostrarJustificativa && (
                            <div className="mt-4">
                                <textarea
                                    placeholder="Insira a justificativa para reprovar..."
                                    value={justificativa}
                                    onChange={(e) => setJustificativa(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows={3}
                                />
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row justify-between mt-4 gap-2">
                            <button
                                className="bg-green-500 poppins text-white px-4 py-2 rounded flex-1"
                                onClick={() => {
                                    setMostrarJustificativa(false);
                                    enviarResposta('APROVADO');
                                }}
                            >
                                Aceitar
                            </button>
                            <button
                                className="bg-red-500 poppins text-white px-4 py-2 rounded flex-1"
                                onClick={() => {
                                    setMostrarJustificativa(true);
                                    if (justificativa.trim()) {
                                        enviarResposta('REPROVADO');
                                    }
                                }}
                            >
                                Recusar
                            </button>
                            <button
                                className="bg-gray-400 poppins text-white px-4 py-2 rounded flex-1"
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