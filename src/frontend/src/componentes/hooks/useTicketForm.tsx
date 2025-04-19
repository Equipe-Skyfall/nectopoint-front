import { useState, useCallback } from 'react';
import { FormState, INITIAL_FORM_STATE, TICKET_SUCCESS_MESSAGES, TicketData } from './useTicketTypes';

export const useTicketForm = () => {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
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

  const handleDayOffChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      dayOff: e.target.value,
      error: ''
    }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormState(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  }, []);

  const addAbsenceDay = useCallback((day: string) => {
    setFormState(prev => ({
      ...prev,
      absenceDays: [...prev.absenceDays, day]
    }));
  }, []);

  const removeAbsenceDay = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      absenceDays: prev.absenceDays.filter((_, i) => i !== index)
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
  }, []);

  const setUserStatus = useCallback((status: string) => {
    setFormState(prev => ({
      ...prev,
      userStatus: status
    }));
  }, []);

  // Helpers
  const getTodayDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const formatarDataBrasileira = useCallback((dataISO: string) => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }, []);

  // Form logic
  const createTicketData = useCallback((): TicketData => {
    const baseData = { 
      mensagem: formState.description,
      status_usuario: formState.userStatus as any
    };

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

      case 'folga':
        return {
          ...baseData,
          tipo_ticket: 'SOLICITAR_FOLGA',
          dia_folga: new Date(formState.dayOff).toISOString()
        };

      case 'hora_extra':
        return {
          ...baseData,
          tipo_ticket: 'PEDIR_HORA_EXTRA'
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

    if (formState.selectedOption === 'ferias') {
      if (!formState.startDate || !formState.vacationDays) {
        setFormState(prev => ({ ...prev, error: 'Preencha todos os campos obrigatórios para férias.' }));
        return false;
      }
      if (new Date(formState.startDate) < new Date(getTodayDate())) {
        setFormState(prev => ({ ...prev, error: 'A data de início das férias deve ser a partir de hoje.' }));
        return false;
      }
    }

    if (formState.selectedOption === 'abono' && formState.absenceDays.length === 0) {
      setFormState(prev => ({ ...prev, error: 'Selecione pelo menos um dia para abonar.' }));
      return false;
    }

    if (formState.selectedOption === 'folga' && !formState.dayOff) {
      setFormState(prev => ({ ...prev, error: 'Selecione uma data para a folga.' }));
      return false;
    }

    if (formState.selectedOption === 'folga' && new Date(formState.dayOff) < new Date(getTodayDate())) {
      setFormState(prev => ({ ...prev, error: 'A data da folga deve ser a partir de hoje.' }));
      return false;
    }

    if (formState.selectedOption === 'hora_extra' && formState.userStatus !== 'FORA_DO_EXPEDIENTE') {
      setFormState(prev => ({ ...prev, error: 'Você só pode solicitar hora extra quando estiver fora do expediente.' }));
      return false;
    }

    return true;
  }, [formState, getTodayDate]);

  const resetFormWithSuccess = useCallback(() => {
    setFormState(prev => ({
      ...INITIAL_FORM_STATE,
      successMessage: TICKET_SUCCESS_MESSAGES[prev.selectedOption as keyof typeof TICKET_SUCCESS_MESSAGES] || ''
    }));
  }, []);

  return {
    formState,
    isSubmitting,
    setFormState,
    setIsSubmitting,
    handleOptionChange,
    handleDescriptionChange,
    handleDateChange,
    handleDayOffChange,
    handleFileChange,
    removeFile,
    addAbsenceDay,
    removeAbsenceDay,
    resetForm,
    setUserStatus,
    getTodayDate,
    formatarDataBrasileira,
    createTicketData,
    validateForm,
    resetFormWithSuccess
  };
};