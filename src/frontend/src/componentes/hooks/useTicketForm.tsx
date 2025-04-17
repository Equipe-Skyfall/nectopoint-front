import { useState, useCallback } from 'react';
import { FormState, INITIAL_FORM_STATE } from './useTicketTypes';

export const useTicketForm = () => {
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

  return {
    formState,
    setFormState,
    handleOptionChange,
    handleDescriptionChange,
    handleDateChange,
    handleFileChange,
    removeFile,
    addAbsenceDay,
    removeAbsenceDay,
    resetForm
  };
};