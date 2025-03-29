export  interface Alertas {
    id_aviso: string; // Matches 'id_aviso' in Java
    tipo_aviso: TipoAviso; // Matches 'tipo_aviso' in Java
    data_aviso: Date | string; // Using Date or string to represent Instant
    status_aviso: TipoStatusAlerta; // Matches 'status_aviso' in Java
}
enum TipoAviso {
    PONTOS_IMPAR,
    SEM_ALMOCO
}
enum TipoStatusAlerta {
    PENDENTE,
    EM_AGUARDO, //EM_AGUARDO sinaliza que está aguardando uma resposta do gerente.
    RESOLVIDO
}