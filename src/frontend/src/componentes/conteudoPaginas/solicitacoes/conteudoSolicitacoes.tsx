import React, { useState, useCallback } from 'react';
import { FaPaperclip, FaBell } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';

// Tipos para os tickets
type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO';
type AbsenceReason = 'ATESTADO_MEDICO';

interface BaseTicket {
  tipo_ticket: TicketType;
  mensagem: string;
}

interface VacationTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_FERIAS';
  data_inicio_ferias: string;
  dias_ferias: number;
}

interface AbsenceTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_ABONO';
  motivo_abono: AbsenceReason;
  dias_abono: string[];
  abono_inicio: string;
  abono_final: string;
}

type TicketData = VacationTicket | AbsenceTicket;

// Estado do formulário
interface FormState {
  selectedOption: 'ferias' | 'abono' | '';
  description: string;
  startDate: string;
  vacationDays: string;
  absenceDays: string[];
  absenceStart: string;
  absenceEnd: string;
  file: File | null;
  error: string;
  successMessage: string;
}

// Mensagens de sucesso
const TICKET_SUCCESS_MESSAGES: Record<'ferias' | 'abono', string> = {
  ferias: 'Solicitação de férias enviada com sucesso!',
  abono: 'Solicitação de abono enviada com sucesso!',
};

// Valores iniciais do formulário
const INITIAL_FORM_STATE: FormState = {
  selectedOption: '',
  description: '',
  startDate: '',
  vacationDays: '',
  absenceDays: [],
  absenceStart: '',
  absenceEnd: '',
  file: null,
  error: '',
  successMessage: ''
};

// Componente principal
const ConteudoSolicitacoes: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Manipuladores de eventos
  const handleOptionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ferias' | 'abono';
    setFormState(prev => ({
      ...prev,
      selectedOption: value,
      error: ''
    }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({
      ...prev,
      description: e.target.value,
      error: ''
    }));
  }, []);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      file: e.target.files?.[0] || null
    }));
  }, []);

  // Cria os dados do ticket baseado no estado do formulário
  const createTicketData = useCallback((): TicketData => {
    const baseData = {
      mensagem: formState.description,
    };

    if (formState.selectedOption === 'ferias') {
      return {
        ...baseData,
        tipo_ticket: 'PEDIR_FERIAS',
        data_inicio_ferias: new Date(formState.startDate).toISOString(),
        dias_ferias: parseInt(formState.vacationDays) || 0
      };
    } else {
      return {
        ...baseData,
        tipo_ticket: 'PEDIR_ABONO',
        motivo_abono: 'ATESTADO_MEDICO',
        dias_abono: formState.absenceDays.map(day => new Date(day).toISOString()),
        abono_inicio: new Date(formState.absenceStart).toISOString(),
        abono_final: new Date(formState.absenceEnd).toISOString()
      };
    }
  }, [formState]);

  // Validação do formulário
  const validateForm = useCallback((): boolean => {
    if (!formState.selectedOption) {
      setFormState(prev => ({ ...prev, error: 'Por favor, selecione uma opção.' }));
      return false;
    }

    if (!formState.description.trim()) {
      setFormState(prev => ({ ...prev, error: 'Por favor, escreva uma descrição.' }));
      return false;
    }

    if (formState.selectedOption === 'ferias') {
      if (!formState.startDate) {
        setFormState(prev => ({ ...prev, error: 'Por favor, informe a data de início das férias.' }));
        return false;
      }
      if (!formState.vacationDays || parseInt(formState.vacationDays) <= 0) {
        setFormState(prev => ({ ...prev, error: 'Por favor, informe a quantidade de dias de férias.' }));
        return false;
      }
    } else {
      if (!formState.absenceStart || !formState.absenceEnd) {
        setFormState(prev => ({ ...prev, error: 'Por favor, informe o período de abono.' }));
        return false;
      }
    }

    return true;
  }, [formState]);

  // Submissão do formulário
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const ticketData = createTicketData();
      const response = await axios.post('/tickets/postar', ticketData);

      if (response.status === 200) {
        setFormState({
          ...INITIAL_FORM_STATE,
          successMessage: TICKET_SUCCESS_MESSAGES[formState.selectedOption as 'ferias' | 'abono']
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setFormState(prev => ({
        ...prev,
        error: axiosError.response
          ? `Erro ao enviar a solicitação: ${(axiosError.response.data as any).message || 'Erro desconhecido'}`
          : 'Erro ao enviar a solicitação. Tente novamente.'
      }));
    }
  }, [validateForm, createTicketData, formState.selectedOption]);

  // Renderiza campos adicionais baseados na seleção
  const renderAdditionalFields = useCallback(() => {
    switch (formState.selectedOption) {
      case 'ferias':
        return (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Data de Início das Férias
              </label>
              <input
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Quantidade de Dias
              </label>
              <input
                type="number"
                name="vacationDays"
                value={formState.vacationDays}
                onChange={(e) => setFormState(prev => ({ ...prev, vacationDays: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
                min="1"
              />
            </div>
          </div>
        );
      case 'abono':
        return (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Período de Abono
              </label>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <input
                  type="datetime-local"
                  name="absenceStart"
                  value={formState.absenceStart}
                  onChange={handleDateChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="datetime-local"
                  name="absenceEnd"
                  value={formState.absenceEnd}
                  onChange={handleDateChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [formState, handleDateChange]);

  return (
    <div className="flex flex-col md:flex-row pt-12">
      {/* Parte esquerda (apenas no desktop) */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/3 p-8 -mt-8">
        <FaBell className="w-32 h-32 mb-12 text-gray-600" />
        <h1 className="text-4xl font-bold mb-12 text-[#6CA144]">Solicitações</h1>
        <p className="text-center text-xl font-semibold text-gray-600">
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
              <option value="abono">Solicitar Abono por Atestado</option>
            </select>
          </div>

          {/* Campos adicionais baseados na seleção */}
          {renderAdditionalFields()}

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
            {/* <label className="absolute bottom-4 right-4 cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <FaPaperclip className="text-gray-500 hover:text-blue-600 transition-colors" size={24} />
            </label> */}
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