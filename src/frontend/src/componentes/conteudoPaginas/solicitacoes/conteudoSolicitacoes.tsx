import React, { useState, useCallback } from 'react';
import { FaPaperclip, FaBell, FaCheck, FaChevronDown } from 'react-icons/fa';
import axios, { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos para os tickets (mantidos os mesmos)
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
  filePreview: string | null;
  error: string;
  successMessage: string;
}

// Mensagens de sucesso
const TICKET_SUCCESS_MESSAGES = {
  ferias: 'Solicitação de férias enviada com sucesso!',
  abono: 'Solicitação de abono enviada com sucesso!'
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
  filePreview: null,
  error: '',
  successMessage: ''
};

// Componente de Select Personalizado
const Select = ({ options, value, onChange, label }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}) => {
  return (
    <div className="relative mb-8">
      <label className="block mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none w-full p-4 pl-6 pr-12 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.value === ''}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
          <FaChevronDown className="text-gray-400" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

// Componente de Input Personalizado
const Input = ({ type, name, value, onChange, label, min, max }: {
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  min?: string;
  max?: string;
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className="w-full p-4 pl-6 border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
      />
    </div>
  );
};

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

// Componente principal
const ConteudoSolicitacoes: React.FC = () => {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manipuladores de eventos
  const handleOptionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'ferias' | 'abono';
    setFormState(prev => ({
      ...prev,
      selectedOption: value,
      error: '',
      successMessage: ''
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
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({
          ...prev,
          file,
          filePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
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
      setFormState(prev => ({ ...prev, error: 'Por favor, selecione um tipo de solicitação.' }));
      return false;
    }

    if (!formState.description.trim()) {
      setFormState(prev => ({ ...prev, error: 'Por favor, escreva uma descrição detalhada.' }));
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
        setFormState(prev => ({ ...prev, error: 'Por favor, informe o período completo do abono.' }));
        return false;
      }
      if (!formState.file) {
        setFormState(prev => ({ ...prev, error: 'Por favor, anexe o atestado médico.' }));
        return false;
      }
    }

    return true;
  }, [formState]);

  // Submissão do formulário
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
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
          ? `Erro ao enviar: ${(axiosError.response.data as any).message || 'Erro desconhecido'}`
          : 'Erro de conexão. Tente novamente.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, createTicketData, formState.selectedOption, formState.file]);

  // Renderiza campos adicionais baseados na seleção
  const renderAdditionalFields = useCallback(() => {
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
              label="Data de Início"
              min={new Date().toISOString().split('T')[0]}
            />
            <Input
              type="number"
              name="vacationDays"
              value={formState.vacationDays}
              onChange={(e) => setFormState(prev => ({ ...prev, vacationDays: e.target.value }))}
              label="Duração (dias)"
              min="1"
              max="30"
            />
          </motion.div>
        );
      case 'abono':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="datetime-local"
                name="absenceStart"
                value={formState.absenceStart}
                onChange={handleDateChange}
                label="Início do Abono"
              />
              <Input
                type="datetime-local"
                name="absenceEnd"
                value={formState.absenceEnd}
                onChange={handleDateChange}
                label="Término do Abono"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                Anexar Atestado
              </label>
              <label className="flex flex-col items-center mb-3 justify-center w-full p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300">
                <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                <FaPaperclip className="w-8 h-8 mb-3 text-blue-500" />
                <p className="text-sm text-gray-600">
                  {formState.file ? formState.file.name : 'Arraste ou clique para enviar o atestado'}
                </p>
                {formState.filePreview && formState.file.type.startsWith('image/') && (
                  <div className="mt-4 w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={formState.filePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </label>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  }, [formState, handleDateChange, handleFileChange]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="pt-2 min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-5 pb-4">
            Solicitações
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preencha o formulário abaixo para enviar sua solicitação de férias ou abono
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Card Ilustrativo */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:w-1/3"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 h-full flex flex-col items-center justify-center">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-full mb-6 shadow-inner">
                <FaBell className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Como funciona?</h2>
              <ul className="space-y-4 text-gray-600 sm:text-sm text-xs">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full -mt-1 px-3 py-1 mr-3">1</span>
                  Selecione o tipo de solicitação
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full -mt-1 px-3 py-1 mr-3">2</span>
                  Preencha todos os campos
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full -mt-1 px-3 py-1 mr-3">3</span>
                  Anexe documentos se necessário
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full -mt-1 px-3 py-1 mr-3">4</span>
                  Envie para análise do gestor
                </li>
              </ul>
            </div>
          </motion.div>

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
                  className={`w-full py-4 px-6 rounded-xl shadow-lg font-medium text-white transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConteudoSolicitacoes;