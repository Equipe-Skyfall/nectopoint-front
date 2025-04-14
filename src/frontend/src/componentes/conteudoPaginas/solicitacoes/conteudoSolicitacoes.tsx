import React, { useState, useCallback } from 'react';
import { FaPaperclip, FaBell } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';

type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO' | 'CORRECAO_TURNO';
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
}

interface ShiftCorrectionTicket extends BaseTicket {
  tipo_ticket: 'CORRECAO_TURNO';
  data_correcao: string;
  pontos_ajustado: {
    entrada: string;
    almoco_saida: string;
    almoco_volta: string;
    saida: string;
  };
}

type TicketData = VacationTicket | AbsenceTicket | ShiftCorrectionTicket;

interface FormState {
  selectedOption: 'ferias' | 'abono' | 'correcaoTurno' | '';
  description: string;
  startDate: string;
  vacationDays: string;
  absenceDays: string[];
  correcaoData: string;
  pontosCorrecao: {
    entrada: string;
    almocoSaida: string;
    almocoVolta: string;
    saida: string;
  };
  file: File | null;
  error: string;
  successMessage: string;
}

const TICKET_SUCCESS_MESSAGES = {
  ferias: 'Solicitação de férias enviada com sucesso!',
  abono: 'Solicitação de abono enviada com sucesso!',
  correcaoTurno: 'Solicitação de correção de turno enviada com sucesso!'
};

const INITIAL_FORM_STATE: FormState = {
  selectedOption: '',
  description: '',
  startDate: '',
  vacationDays: '',
  absenceDays: [],
  correcaoData: '',
  pontosCorrecao: {
    entrada: '',
    almocoSaida: '',
    almocoVolta: '',
    saida: ''
  },
  file: null,
  error: '',
  successMessage: ''
};

const formatarDataBrasileira = (dataISO: string) => {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const ConteudoSolicitacoes: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const handleOptionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FormState['selectedOption'];
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

  const createTicketData = useCallback((): TicketData => {
    const baseData = { mensagem: formState.description };

    switch(formState.selectedOption) {
      case 'ferias':
        return {
          ...baseData,
          tipo_ticket: 'PEDIR_FERIAS',
          data_inicio_ferias: `${formState.startDate}T00:00:00.000Z`,
          dias_ferias: parseInt(formState.vacationDays) || 0
        };

      case 'abono':
        return {
          ...baseData,
          tipo_ticket: 'PEDIR_ABONO',
          motivo_abono: 'ATESTADO_MEDICO',
          dias_abono: formState.absenceDays.map(day => new Date(day).toISOString())
        };

      case 'correcaoTurno':
        return {
          ...baseData,
          tipo_ticket: 'CORRECAO_TURNO',
          data_correcao: `${formState.correcaoData}T00:00:00.000Z`,
          pontos_ajustado: {
            entrada: `${formState.correcaoData}T${formState.pontosCorrecao.entrada}:00.000Z`,
            almoco_saida: `${formState.correcaoData}T${formState.pontosCorrecao.almocoSaida}:00.000Z`,
            almoco_volta: `${formState.correcaoData}T${formState.pontosCorrecao.almocoVolta}:00.000Z`,
            saida: `${formState.correcaoData}T${formState.pontosCorrecao.saida}:00.000Z`
          }
        };

      default:
        throw new Error('Tipo de solicitação inválido');
    }
  }, [formState]);

  const validateForm = useCallback((): boolean => {
    if (!formState.selectedOption) {
      setFormState(prev => ({ ...prev, error: 'Por favor, selecione uma opção.' }));
      return false;
    }

    if (!formState.description.trim()) {
      setFormState(prev => ({ ...prev, error: 'Por favor, escreva uma descrição.' }));
      return false;
    }

    switch(formState.selectedOption) {
      case 'ferias':
        if (!formState.startDate || !formState.vacationDays) {
          setFormState(prev => ({ ...prev, error: 'Preencha todos os campos obrigatórios para férias.' }));
          return false;
        }
        if (new Date(formState.startDate) < new Date(getTodayDate())) {
          setFormState(prev => ({ ...prev, error: 'A data de início das férias deve ser a partir de hoje.' }));
          return false;
        }
        break;

      case 'abono':
        if (formState.absenceDays.length === 0) {
          setFormState(prev => ({ ...prev, error: 'Selecione pelo menos um dia para abonar.' }));
          return false;
        }
        for (const day of formState.absenceDays) {
          if (new Date(day) >= new Date(getTodayDate())) {
            setFormState(prev => ({ ...prev, error: 'Os dias de abono devem ser anteriores à data atual.' }));
            return false;
          }
        }
        break;

      case 'correcaoTurno':
        if (!formState.correcaoData) {
          setFormState(prev => ({ ...prev, error: 'Selecione a data da correção.' }));
          return false;
        }
        
        const pontos = formState.pontosCorrecao;
        if (!pontos.entrada || !pontos.almocoSaida || !pontos.almocoVolta || !pontos.saida) {
          setFormState(prev => ({ ...prev, error: 'Preencha todos os pontos do turno.' }));
          return false;
        }
        
        // Validação da ordem dos horários
        const horarios = [
          pontos.entrada,
          pontos.almocoSaida,
          pontos.almocoVolta,
          pontos.saida
        ];
        
        for (let i = 0; i < horarios.length - 1; i++) {
          if (horarios[i] >= horarios[i + 1]) {
            setFormState(prev => ({ 
              ...prev, 
              error: 'Os horários devem estar na ordem: Entrada → Almoço → Volta → Saída' 
            }));
            return false;
          }
        }
        break;
    }

    return true;
  }, [formState]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const ticketData = createTicketData();
      console.log('Payload sendo enviado:', JSON.stringify(ticketData, null, 2));
      
      const token = localStorage.getItem('authToken') || '';
      const response = await axios.post('/tickets/postar', ticketData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setFormState({
          ...INITIAL_FORM_STATE,
          successMessage: TICKET_SUCCESS_MESSAGES[formState.selectedOption as keyof typeof TICKET_SUCCESS_MESSAGES]
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erro completo:', {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status
      });
      
      let errorMessage = 'Erro ao enviar a solicitação. Tente novamente.';
      if (axiosError.response) {
        if (axiosError.response.status === 403) {
          errorMessage = 'Acesso não autorizado. Faça login novamente.';
        } else if (axiosError.response.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      setFormState(prev => ({
        ...prev,
        error: errorMessage
      }));
    }
  }, [validateForm, createTicketData, formState.selectedOption]);

  const renderAdditionalFields = useCallback(() => {
    switch (formState.selectedOption) {
      case 'ferias':
        return (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Data de Início das Férias (a partir de hoje)
              </label>
              <input
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                min={getTodayDate()}
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
                Dias para Abonar (anteriores a hoje)
              </label>
              <input
                type="date"
                onChange={(e) => {
                  if (e.target.value && new Date(e.target.value) < new Date(getTodayDate())) {
                    setFormState(prev => ({
                      ...prev,
                      absenceDays: [...prev.absenceDays, e.target.value]
                    }));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg"
                max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {formState.absenceDays.map((day, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                    {formatarDataBrasileira(day)}
                    <button
                      onClick={() => setFormState(prev => ({
                        ...prev,
                        absenceDays: prev.absenceDays.filter((_, i) => i !== index)
                      }))}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'correcaoTurno':
        return (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Data da Correção
              </label>
              <input
                type="date"
                value={formState.correcaoData}
                onChange={(e) => setFormState(prev => ({ 
                  ...prev, 
                  correcaoData: e.target.value 
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              />
            </div>

            <div className="space-y-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Horários do Turno (Formato HH:MM)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Entrada</label>
                  <input
                    type="time"
                    value={formState.pontosCorrecao.entrada}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      pontosCorrecao: {
                        ...prev.pontosCorrecao,
                        entrada: e.target.value
                      }
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Saída para Almoço</label>
                  <input
                    type="time"
                    value={formState.pontosCorrecao.almocoSaida}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      pontosCorrecao: {
                        ...prev.pontosCorrecao,
                        almocoSaida: e.target.value
                      }
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Volta do Almoço</label>
                  <input
                    type="time"
                    value={formState.pontosCorrecao.almocoVolta}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      pontosCorrecao: {
                        ...prev.pontosCorrecao,
                        almocoVolta: e.target.value
                      }
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block mb-1 text-sm text-gray-600">Saída</label>
                  <input
                    type="time"
                    value={formState.pontosCorrecao.saida}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      pontosCorrecao: {
                        ...prev.pontosCorrecao,
                        saida: e.target.value
                      }
                    }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [formState, handleDateChange]);

  return (
    <div className="flex flex-col md:flex-row pt-24">
      <div className="hidden md:flex flex-col items-center justify-center w-1/3 p-8 mt-8">
        <FaBell className="w-32 h-32 mb-12 text-gray-600" />
        <h1 className="text-4xl font-bold mb-12 text-blue-600">Solicitações</h1>
        <p className="text-center text-xl font-semibold text-gray-600">
          Selecione uma das opções ao lado e faça uma justificativa para mandar sua solicitação ao
          gerente.
        </p>
      </div>

      <div className="w-full md:w-2/3 p-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-4 md:hidden">Solicitações</h1>

          {formState.error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {formState.error}
            </div>
          )}

          {formState.successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {formState.successMessage}
            </div>
          )}

          <div className="mb-6">
            <select
              value={formState.selectedOption}
              onChange={handleOptionChange}
              className="w-full p-4 border border-gray-300 rounded-lg bg-white"
            >
              <option value="" disabled>Selecione uma opção</option>
              <option value="ferias">Solicitar Férias</option>
              <option value="abono">Solicitar Abono por Atestado</option>
              <option value="correcaoTurno">Correção de Turno</option>
            </select>
          </div>

          {renderAdditionalFields()}

          <div className="mb-6 relative">
            <textarea
              placeholder="Descreva o motivo da sua solicitação..."
              value={formState.description}
              onChange={handleDescriptionChange}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none"
              rows={8}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Anexar Documento (Opcional)
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300">
                <FaPaperclip className="inline mr-2" />
                Anexar Arquivo
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              {formState.file && (
                <span className="ml-4 text-sm text-gray-600">
                  {formState.file.name}
                </span>
              )}
            </div>
          </div>

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