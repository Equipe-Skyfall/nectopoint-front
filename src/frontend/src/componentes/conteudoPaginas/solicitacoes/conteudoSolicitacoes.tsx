import React from 'react';
import { FaPaperclip, FaBell, FaCheck, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTicketForm } from '../../hooks/useTicketForm';
import { useTicketApi } from '../../hooks/useTicketApi';

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
    </div>
  );
};

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
    isSubmitting,
    handleOptionChange,
    handleDescriptionChange,
    handleDateChange,
    handleDayOffChange,
    handleFileChange,
    setFormState,
    removeFile,
    addAbsenceDay,
    removeAbsenceDay,
    getTodayDate,
    formatarDataBrasileira,
    createTicketData,
    validateForm,
    resetFormWithSuccess,
    setIsSubmitting
  } = useTicketForm();

  const { submitTicket } = useTicketApi();

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const ticketData = createTicketData();

    const { success, error } = await submitTicket(ticketData, formState.file);

    if (success) {
      resetFormWithSuccess();
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
              onChange={handleDateChange}
              label="Quantidade de Dias"
              min="1"
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
          </motion.div>
        );

      case 'folga':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <Input
              type="date"
              name="dayOff"
              value={formState.dayOff}
              onChange={handleDayOffChange}
              label="Data da Folga"
              min={getTodayDate()}
            />
          </motion.div>
        );

      case 'hora_extra':
        return (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
          </motion.div>
        );

      default:
        return null;
    }
  };

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
            Preencha o formulário abaixo para enviar sua solicitação
          </p>
          
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
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
                  Anexe um documento se necessário
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full -mt-1 px-3 py-1 mr-3">4</span>
                  Envie para análise do gestor
                </li>
              </ul>
            </div>
          </motion.div>

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
                    { value: 'abono', label: 'Solicitar Abono por Atestado' },
                    { value: 'folga', label: 'Solicitar Folga' },
                    { value: 'hora_extra', label: 'Solicitar Hora Extra' }
                  ]}
                  value={formState.selectedOption}
                  onChange={handleOptionChange}
                  label="Tipo de Solicitação"
                />

                <AnimatePresence mode="wait">
                  {renderAdditionalFields()}
                </AnimatePresence>

                {formState.selectedOption === 'abono' && (
                  <div className="mb-4">
                    <label className="block mb-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                      Anexar Atestado Médico (Obrigatório)
                    </label>
                    <label className="flex flex-col items-center mb-3 justify-center w-full p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <FaPaperclip className="w-8 h-8 mb-3 text-blue-500" />
                      <p className="text-sm text-gray-600">
                        {formState.file ? formState.file.name : 'Arraste ou clique para enviar o atestado médico'}
                      </p>
                    </label>

                    {formState.file && (
                      <motion.div
                        className="mt-4 flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span className="text-sm text-gray-600 truncate">
                          {formState.file.name}
                        </span>
                        <button
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

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
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConteudoSolicitacoes;