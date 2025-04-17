export type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO';
export type AbsenceReason = 'ATESTADO_MEDICO';

export interface BaseTicket {
  tipo_ticket: TicketType;
  mensagem: string;
}

export interface VacationTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_FERIAS';
  data_inicio_ferias: string;
  dias_ferias: number;
}

export interface AbsenceTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_ABONO';
  motivo_abono: AbsenceReason;
  dias_abono: string[];
}

export type TicketData = VacationTicket | AbsenceTicket;

export interface FormState {
  selectedOption: 'ferias' | 'abono' | '';
  description: string;
  startDate: string;
  vacationDays: string;
  absenceDays: string[];
  files: File[];
  error: string;
  successMessage: string;
}

export const TICKET_SUCCESS_MESSAGES = {
  ferias: 'Solicitação de férias enviada com sucesso!',
  abono: 'Solicitação de abono enviada com sucesso!'
};

export const INITIAL_FORM_STATE: FormState = {
  selectedOption: '',
  description: '',
  startDate: '',
  vacationDays: '',
  absenceDays: [],
  files: [],
  error: '',
  successMessage: ''
};