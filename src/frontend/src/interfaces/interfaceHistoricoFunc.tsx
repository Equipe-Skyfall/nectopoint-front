import { JSX } from "react";

export interface HistoricoJornada {
    data: string;
    inicioTurno: string;
    fimTurno: string;
    statusTurno: JSX.Element;
    statusText?: string;
    pontos: {
        tipo: string;
        horario: string;
        dataOriginal?: Date;
    }[];
    idRegistro?: string;
    dataOriginal?: Date;
}
export interface PontoFormatado {
    tipo: string;
    horario: string;
}



export interface PointCorrectionPayload {
  tipo_ticket: 'ALTERAR_PONTOS';
  pontos_anterior: Array<{
    tipo_ponto: 'ENTRADA' | 'SAIDA';
    data_hora: string;
  }>;
  pontos_ajustado: Array<{
    tipo_ponto: 'ENTRADA' | 'SAIDA';
    data_hora: string;
  }>;
  id_registro: string;
  mensagem: string;
  status_usuario: string;
}