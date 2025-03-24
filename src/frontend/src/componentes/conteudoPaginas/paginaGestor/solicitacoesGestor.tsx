import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import useSolicitacoes from '../../hooks/useSolicitacoes';

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
    const [modalAberto, setModalAberto] = useState<Solicitacao | null>(null);
    const [justificativa, setJustificativa] = useState<string>('');
    const [mostrarJustificativa, setMostrarJustificativa] = useState<boolean>(false);
    const [pagina, setPagina] = useState(0); // Página começa em 0 no backend
    const itensPorPagina = 5;
    const { solicitacoes, loading, error, fetchSolicitacoes, atualizarSolicitacoes } = useSolicitacoes(pagina, itensPorPagina, TipoStatus.EM_AGUARDO);

    const modalRef = useRef<HTMLDivElement | null>(null);

    const enviarResposta = async (status_novo: TipoStatus) => {
        if (!modalAberto) return;

        // Validação para o status "REPROVADO"
        if (status_novo === 'REPROVADO' && !justificativa.trim()) {
            alert('Por favor, insira uma justificativa para reprovar a solicitação.');
            return;
        }

        // Atualiza o status_ticket no objeto ticket
        const ticketAtualizado = {
            ...modalAberto, // Copia todas as propriedades do ticket atual
            status_ticket: status_novo, // Atualiza o status_ticket para o novo status
        };

        // Monta o payload conforme o esperado pelo backend
        const payload = {
            novo_status: status_novo, // Renomeado para "novo_status"
            ...(status_novo === 'REPROVADO' && { justificativa: justificativa }), // Apenas para "REPROVADO"
            ticket: ticketAtualizado, // Envia o objeto ticket atualizado
        };

        console.log("Payload enviado:", JSON.stringify(payload, null, 2)); // Debugue o payload

        try {
            const response = await axios.post('/tickets/responder', payload);
            console.log("Resposta do backend:", response.data); // Debugue a resposta do backend

            // Verifica se a operação foi bem-sucedida
            if (response.data.success || response.status === 200) {
                // Atualiza a lista de solicitações
                atualizarSolicitacoes(modalAberto.id_ticket);

                // Fecha o modal e limpa os estados
                setModalAberto(null);
                setJustificativa('');
                setMostrarJustificativa(false);
            } else {
                // Exibe uma mensagem de erro genérica
                alert('Erro ao enviar resposta. Tente novamente.');
            }
        } catch (error: any) {
            console.error('Erro ao enviar resposta:', error);
            console.error("Dados de erro do backend:", error.response?.data); // Debugue a resposta do backend

            // Exibe uma mensagem de erro específica
            if (error.response?.data?.message) {
                alert(`Erro: ${error.response.data.message}`);
            } else {
                alert('Erro ao enviar resposta. Tente novamente.');
            }
        }
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
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalAberto]);

    const truncarTexto = (texto: string, limite: number) => {
        return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
    };

    return (
        <div className="p-6 flex flex-col items-center">
            <div className="w-full max-w-3xl mt-16 z-20 relative">
                <h1 className="poppins-semibold text-4xl font-bold mb-4 text-center">Solicitações</h1>
                <div className="flex flex-col gap-6">
                    {solicitacoes?.content.map((solicitacao) => (
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

            <div className="flex items-center justify-center mt-6 w-full max-w-3xl gap-4">
                <button
                    className={`px-4 py-2 rounded ${pagina === 0 ? "bg-gray-400 poppins cursor-not-allowed" : "bg-blue-500 poppins text-white hover:bg-blue-600"}`}
                    onClick={() => setPagina((prev) => Math.max(prev - 1, 0))}
                    disabled={pagina === 0}
                >
                    Voltar
                </button>
                <span className="poppins text-lg font-semibold">
                    Página {(solicitacoes?.number ?? 0) + 1} de {solicitacoes?.totalPages ?? 1}
                </span>
                <button
                    className={`px-4 py-2 rounded ${pagina === (solicitacoes?.totalPages ?? 1) - 1 ? "poppins bg-gray-400 cursor-not-allowed" : "poppins bg-blue-500 text-white hover:bg-blue-600"}`}
                    onClick={() => setPagina((prev) => Math.min(prev + 1, (solicitacoes?.totalPages ?? 1) - 1))}
                    disabled={pagina === (solicitacoes?.totalPages ?? 1) - 1}
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
                                    // Move a chamada enviarResposta para dentro da verificação
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