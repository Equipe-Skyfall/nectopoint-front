export interface HistoricoJornada {
    data: string;
    inicioTurno: string;
    fimTurno: string;
    statusTurno: string;
    pontos: PontoFormatado[];
}

export interface PontoFormatado {
    tipo: string;
    horario: string;
}
