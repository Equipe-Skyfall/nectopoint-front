export interface Ticket {
    id_ticket: string; // Matches 'id_ticket' in Java
    tipo_ticket: TipoTicket; // Matches 'tipo_ticket' in Java
    data_ticket: Date | string; // Using Date or string to represent Instant
    status_ticket: TipoStatusTicket; // Matches 'status_ticket' in Java
    nome_gerente: string; // Matches 'nome_gerente' in Java
    justificativa: string; // Matches 'justificativa' in Java
    mensagem: string; // Matches 'mensagem' in Java
}
enum TipoTicket {
    PONTOS_IMPAR,
    SEM_ALMOCO,
    PEDIR_FERIAS,
    PEDIR_ABONO
}
enum TipoStatusTicket {
    EM_AGUARDO, //EM_AGUARDO sinaliza que está aguardando uma resposta do gerente.
    APROVADO,
    REPROVADO
}
