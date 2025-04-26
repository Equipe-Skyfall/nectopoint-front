import { useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { TicketData } from './useTicketTypes';

export const useTicketApi = () => {
  const submitTicket = useCallback(async (ticketData: TicketData, file: File | null) => {
    try {
      const formData = new FormData();
      
      const ticketBlob = new Blob([JSON.stringify(ticketData)], {
        type: 'application/json'
      });
      
      formData.append('ticket', ticketBlob, 'ticket.json');
      
      if (file) {
        formData.append('file', file, file.name);
      }

      const response = await axios.post('http://localhost:3000/tickets/postar', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000,
        maxContentLength: 100 * 1024 * 1024,
        maxBodyLength: 100 * 1024 * 1024
      });

      return {
        success: response.status === 200,
        error: null
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erro detalhado:', {
        message: axiosError.message,
        code: axiosError.code,
        response: axiosError.response?.data,
        config: axiosError.config
      });

      let errorMessage = 'Erro ao enviar a solicitação. Tente novamente.';
      
      if (axiosError.response) {
        if (Array.isArray(axiosError.response.data)) {
          errorMessage = axiosError.response.data
            .map((err: { message: string }) => err.message)
            .join('\n');
        } 
        else if (axiosError.response.data && typeof axiosError.response.data === 'object') {
          errorMessage = (axiosError.response.data as any).message || errorMessage;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  return { submitTicket };
};