import { useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { TicketData } from './useTicketTypes';

export const useTicketApi = () => {
  const submitTicket = useCallback(async (ticketData: TicketData) => {
    try {
      const response = await axios.post('http://localhost:3000/tickets/postar', ticketData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: response.status === 200,
        error: null
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Erro ao enviar ticket:', axiosError);

      let errorMessage = 'Erro ao enviar a solicitação. Tente novamente.';
      if (axiosError.response) {
        if (axiosError.response.status === 403) {
          errorMessage = 'Acesso não autorizado. Faça login novamente.';
        } else if (axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          errorMessage = (axiosError.response.data as { message: string }).message;
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