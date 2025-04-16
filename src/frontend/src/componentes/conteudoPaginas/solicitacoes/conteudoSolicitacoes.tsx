<<<<<<< Updated upstream
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
=======
import React from 'react';
import { FaPaperclip, FaBell, FaCheck, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTicketForm } from '../../hooks/useTicketForm';
import { useTicketApi } from '../../hooks/useTicketApi';
import { TicketData, TICKET_SUCCESS_MESSAGES } from '../../hooks/useTicketTypes';

const formatarDataBrasileira = (dataISO: string) => {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('T')[0].split('-');
  return `${dia}/${mes}/${ano}`;
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
// Componente de Textarea Personalizado
const Textarea = ({ value, onChange, label }: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
}) => {
  return (
    <div className="mb-8 relative">
      <label className="block mb-3 mt-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        className="w-full p-4 pl-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 resize-none min-h-[200px]"
        placeholder="Descreva detalhadamente o motivo da sua solicitação..."
      />
    </div>
  );
};

const ConteudoSolicitacoes: React.FC = () => {
  const {
    formState,
    handleOptionChange,
    handleDescriptionChange,
    handleDateChange,
    handleFileChange,
    removeFile,
    addAbsenceDay,
    removeAbsenceDay,
    setFormState,
    resetForm
  } = useTicketForm();

  const { submitTicket } = useTicketApi();
>>>>>>> Stashed changes

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const createTicketData = (): TicketData => {
    const baseData = { mensagem: formState.description };

<<<<<<< Updated upstream
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
=======
    switch (formState.selectedOption) {
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

      default:
        throw new Error('Tipo de solicitação inválido');
    }
  };

  const validateForm = (): boolean => {
>>>>>>> Stashed changes
    if (!formState.selectedOption) {
      setFormState(prev => ({ ...prev, error: 'Por favor, selecione uma opção.' }));
      return false;
    }

    if (!formState.description.trim()) {
      setFormState(prev => ({ ...prev, error: 'Por favor, escreva uma descrição.' }));
      return false;
    }

<<<<<<< Updated upstream
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
=======
    if (formState.selectedOption === 'ferias') {
      if (!formState.startDate || !formState.vacationDays) {
        setFormState(prev => ({ ...prev, error: 'Preencha todos os campos obrigatórios para férias.' }));
        return false;
      }
      if (new Date(formState.startDate) < new Date(getTodayDate())) {
        setFormState(prev => ({ ...prev, error: 'A data de início das férias deve ser a partir de hoje.' }));
        return false;
      }
>>>>>>> Stashed changes
    }

    if (formState.selectedOption === 'abono' && formState.absenceDays.length === 0) {
      setFormState(prev => ({ ...prev, error: 'Selecione pelo menos um dia para abonar.' }));
      return false;
    }

    return true;
  };

<<<<<<< Updated upstream
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
=======
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const ticketData = createTicketData();

    const { success, error } = await submitTicket(ticketData, formState.files);

    if (success) {
      resetForm();
      setFormState(prev => ({
        ...prev,
        successMessage: TICKET_SUCCESS_MESSAGES[formState.selectedOption as keyof typeof TICKET_SUCCESS_MESSAGES]
      }));
    } else if (error) {
      setFormState(prev => ({ ...prev, error }));
    }
    setIsSubmitting(false);
  };

  const renderAdditionalFields = () => {
    switch (formState.selectedOption) {
      case 'ferias':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Input
              type="date"
              name="startDate"
              value={formState.startDate}
              onChange={handleDateChange}
              label="Data de Início das Férias"
              min={getTodayDate()}
            />
            <Input
              type="number"
              name="vacationDays"
              value={formState.vacationDays}
              onChange={(e) => setFormState(prev => ({ ...prev, vacationDays: e.target.value }))}
              label="Quantidade de Dias"
              min="1"
            />
          </motion.div>
>>>>>>> Stashed changes
        );

      case 'abono':
        return (
<<<<<<< Updated upstream
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
=======
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="mb-4">
              <label className="block mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Dias para Abonar (anteriores a hoje)
              </label>
              <input
                type="date"
                onChange={(e) => {
                  if (e.target.value && new Date(e.target.value) < new Date(getTodayDate())) {
                    addAbsenceDay(e.target.value);
                  }
                }}
                className="w-full p-4 pl-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {formState.absenceDays.map((day, index) => (
                  <motion.span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-lg flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {formatarDataBrasileira(day)}
                    <button
                      onClick={() => removeAbsenceDay(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Anexar Documentos
              </label>
              <label className="flex flex-col items-center mb-3 justify-center w-full p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                />
                <FaPaperclip className="w-8 h-8 mb-3 text-blue-500" />
                <p className="text-sm text-gray-600">
                  {formState.files.length > 0
                    ? `${formState.files.length} arquivo(s) selecionado(s)`
                    : 'Arraste ou clique para enviar documentos'}
                </p>
              </label>

              <div className="mt-4 space-y-2">
                {formState.files.map((file, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-sm text-gray-600 truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </motion.div>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  }, [formState, handleDateChange]);
=======
  };
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
          {formState.successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {formState.successMessage}
=======
          {/* Formulário Principal */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:w-2/3"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <AnimatePresence>
                  {formState.error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                    >
                      <p className="text-red-700 font-medium">{formState.error}</p>
                    </motion.div>
                  )}

                  {formState.successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg"
                    >
                      <p className="text-green-700 font-medium flex items-center">
                        <FaCheck className="mr-2" /> {formState.successMessage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Select
                  options={[
                    { value: '', label: 'Selecione uma opção' },
                    { value: 'ferias', label: 'Solicitar Férias' },
                    { value: 'abono', label: 'Solicitar Abono por Atestado' }
                  ]}
                  value={formState.selectedOption}
                  onChange={handleOptionChange}
                  label="Tipo de Solicitação"
                />

                <AnimatePresence mode="wait">
                  {renderAdditionalFields()}
                </AnimatePresence>

                <Textarea
                  value={formState.description}
                  onChange={handleDescriptionChange}
                  label="Descrição Detalhada"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl shadow-lg font-medium text-white transition-all duration-300 ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl'
                    }`}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </motion.button>
              </div>
>>>>>>> Stashed changes
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