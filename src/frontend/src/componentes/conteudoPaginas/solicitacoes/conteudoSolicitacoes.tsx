import React, { useState } from 'react';
import { FaPaperclip, FaBell } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';

enum TicketType {
  PEDIR_FERIAS = 'PEDIR_FERIAS',
  PEDIR_ABONO = 'PEDIR_ABONO'
}

enum TicketOption {
  FERIAS = 'ferias',
  ABONO = 'abono'
}

interface TicketData {
  tipo_ticket: TicketType;
  mensagem: string;
  id_colaborador: number;
  data_inicio_ferias?: string;
  dias_ferias?: number;
  motivo_abono?: string;
  dias_abono?: string[];
}

const ConteudoSolicitacoes: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<TicketOption | ''>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const ticketMessages: Record<TicketOption, string> = {
        [TicketOption.FERIAS]: 'Solicitação de férias enviada com sucesso!',
        [TicketOption.ABONO]: 'Solicitação de abono enviada com sucesso!',
    };

    const ticketTypeMapping: Record<TicketOption, TicketType> = {
        [TicketOption.FERIAS]: TicketType.PEDIR_FERIAS,
        [TicketOption.ABONO]: TicketType.PEDIR_ABONO,
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value as TicketOption);
        setError('');
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setError('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedOption) {
            setError('Por favor, selecione uma opção.');
            return;
        }
        if (!description.trim()) {
            setError('Por favor, escreva uma descrição.');
            return;
        }

        const ticketData: TicketData = {
            tipo_ticket: ticketTypeMapping[selectedOption],
            mensagem: description,
            id_colaborador: 1, // Substitua pelo ID real do colaborador logado
        };

        switch (ticketData.tipo_ticket) {
            case TicketType.PEDIR_FERIAS:
                ticketData.data_inicio_ferias = new Date().toISOString();
                ticketData.dias_ferias = 10;
                break;
            case TicketType.PEDIR_ABONO:
                ticketData.motivo_abono = description;
                ticketData.dias_abono = [new Date().toISOString()];
                break;
        }

        try {
            const response = await axios.post('/tickets/postar', ticketData);
            if (response.status === 200) {
                setSuccessMessage(ticketMessages[selectedOption]);
                setSelectedOption('');
                setDescription('');
                setFile(null);
                setError('');
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                setError(`Erro ao enviar a solicitação: ${axiosError.response.data.message}`);
            } else {
                setError('Erro ao enviar a solicitação. Tente novamente.');
            }
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
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Mensagem de sucesso */}
                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    {/* Dropdown para seleção de opções */}
                    <div className="mb-6">
                        <select
                            value={selectedOption}
                            onChange={handleOptionChange}
                            className="w-full p-4 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="" disabled>
                                Selecione uma opção
                            </option>
                            <option value={TicketOption.FERIAS}>Solicitar Férias</option>
                            <option value={TicketOption.ABONO}>Solicitar Abono de Faltas</option>
                        </select>
                    </div>

                    {/* Caixa de texto */}
                    <div className="mb-6 relative">
                        <textarea
                            placeholder="Descreva o motivo da sua solicitação..."
                            value={description}
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