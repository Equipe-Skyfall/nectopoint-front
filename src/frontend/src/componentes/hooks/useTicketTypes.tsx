export type TicketType = 'PEDIR_FERIAS' | 'PEDIR_ABONO' | 'SOLICITAR_FOLGA' | 'PEDIR_HORA_EXTRA';
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

export interface DayOffTicket extends BaseTicket {
  tipo_ticket: 'SOLICITAR_FOLGA';
  dia_folga: string;
  status_usuario: 'ESCALADO' | 'FORA_DO_EXPEDIENTE' | 'FOLGA' | 'FERIAS' | 'INATIVO';
}

export interface OvertimeTicket extends BaseTicket {
  tipo_ticket: 'PEDIR_HORA_EXTRA';
  status_usuario: 'ESCALADO' | 'FORA_DO_EXPEDIENTE' | 'FOLGA' | 'FERIAS' | 'INATIVO';
}

export type TicketData = VacationTicket | AbsenceTicket | DayOffTicket | OvertimeTicket;

export interface FormState {
  selectedOption: 'ferias' | 'abono' | 'folga' | 'hora_extra' | '';
  description: string;
  startDate: string;
  vacationDays: string;
  absenceDays: string[];
  dayOff: string;
  userStatus: string;
  files: File[];
  error: string;
  successMessage: string;
}

export const TICKET_SUCCESS_MESSAGES = {
  ferias: 'Solicitação de férias enviada com sucesso!',
  abono: 'Solicitação de abono enviada com sucesso!',
  folga: 'Solicitação de folga enviada com sucesso!',
  hora_extra: 'Solicitação de hora extra enviada com sucesso!'
};

export const INITIAL_FORM_STATE: FormState = {
  selectedOption: '',
  description: '',
  startDate: '',
  vacationDays: '',
  absenceDays: [],
  dayOff: '',
  userStatus: '',
  files: [],
  error: '',
  successMessage: ''
};