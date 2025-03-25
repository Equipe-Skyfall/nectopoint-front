import React, { useState } from 'react';
import { FaPaperclip, FaBell } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';

// Type definitions
interface TicketBase {
  tipo_ticket: 'PEDIR_FERIAS' | 'PEDIR_ABONO';
  mensagem: string;
  id_colaborador: number;
}

interface FeriasTicket extends TicketBase {
  tipo_ticket: 'PEDIR_FERIAS';
  data_inicio_ferias: string;
  dias_ferias: number;
}

interface AbonoTicket extends TicketBase {
  tipo_ticket: 'PEDIR_ABONO';
  motivo_abono: string;
  dias_abono: string[];
}

type TicketData = FeriasTicket | AbonoTicket;

interface FormState {
  selectedOption: 'ferias' | 'abono' | '';
  description: string;
  file: File | null;
  error: string;
  successMessage: string;
}

const ConteudoSolicitacoes: React.FC = () => {
    const [formState, setFormState] = useState<FormState>({
        selectedOption: '',
        description: '',
        file: null,
        error: '',
        successMessage: ''
    });

    const ticketMessages = {
        ferias: 'Solicitação de férias enviada com sucesso!',
        abono: 'Solicitação de abono enviada com sucesso!',
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormState(prev => ({
            ...prev,
            selectedOption: e.target.value as 'ferias' | 'abono',
            error: ''
        }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormState(prev => ({
            ...prev,
            description: e.target.value,
            error: ''
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({
            ...prev,
            file: e.target.files?.[0] || null
        }));
    };

    const createTicketData = (): TicketData => {
        const baseData = {
            mensagem: formState.description,
            id_colaborador: 1 // ID do colaborador logado
        };

        if (formState.selectedOption === 'ferias') {
            return {
                ...baseData,
                tipo_ticket: 'PEDIR_FERIAS',
                data_inicio_ferias: new Date().toISOString(),
                dias_ferias: 10
            };
        } else {
            return {
                ...baseData,
                tipo_ticket: 'PEDIR_ABONO',
                motivo_abono: formState.description,
                dias_abono: [new Date().toISOString()]
            };
        }
    };

    const handleSubmit = async () => {
        if (!formState.selectedOption) {
            setFormState(prev => ({ ...prev, error: 'Por favor, selecione uma opção.' }));
            return;
        }
        if (!formState.description.trim()) {
            setFormState(prev => ({ ...prev, error: 'Por favor, escreva uma descrição.' }));
            return;
        }

        try {
            const ticketData = createTicketData();
            const response = await axios.post('/tickets/postar', ticketData);
            
            if (response.status === 200) {
                setFormState({
                    selectedOption: '',
                    description: '',
                    file: null,
                    error: '',
                    successMessage: ticketMessages[formState.selectedOption]
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            setFormState(prev => ({
                ...prev,
                error: axiosError.response 
                    ? `Erro ao enviar a solicitação: ${axiosError.response.data.message}`
                    : 'Erro ao enviar a solicitação. Tente novamente.'
            }));
        }
    };

    return (
        <div className="flex flex-col md:flex-row pt-12">
            {/* Parte esquerda (apenas no desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center w-1/3 p-8 -mt-8">
                <FaBell className="w-32 h-32 mb-12 text-gray-600" />
                <h1 className="text-4xl font-bold mb-12 text-[#6CA144]">SOLICITAÇÕES</h1>
                <p className="text-center text-2xl font-semibold text-black">
                    Selecione uma das opções ao lado e faça uma justificativa para mandar sua solicitação ao
                    gerente.
                </p>
            </div>

            {/* Parte direita (formulário) */}
            <div className="w-full md:w-2/3 p-4 flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-4 md:hidden">Solicitações</h1>

                    {/* Mensagem de erro */}
                    {formState.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {formState.error}
                        </div>
                    )}

                    {/* Mensagem de sucesso */}
                    {formState.successMessage && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {formState.successMessage}
                        </div>
                    )}

                    {/* Dropdown para seleção de opções */}
                    <div className="mb-6">
                        <select
                            value={formState.selectedOption}
                            onChange={handleOptionChange}
                            className="w-full p-4 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="" disabled>
                                Selecione uma opção
                            </option>
                            <option value="ferias">Solicitar Férias</option>
                            <option value="abono">Solicitar Abono de Faltas</option>
                        </select>
                    </div>

                    {/* Caixa de texto */}
                    <div className="mb-6 relative">
                        <textarea
                            placeholder="Descreva o motivo da sua solicitação..."
                            value={formState.description}
                            onChange={handleDescriptionChange}
                            className="w-full p-4 border border-gray-300 rounded-lg resize-none"
                            rows={8}
                        />
                        {/* Anexar arquivo */}
                        <label className="absolute bottom-4 right-4 cursor-pointer">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <FaPaperclip className="text-gray-500 hover:text-blue-600 transition-colors" size={24} />
                        </label>
                    </div>

                    {/* Botão de enviar */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        Enviar Solicitação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConteudoSolicitacoes;