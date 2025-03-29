import Ponto from './interfacePonto';
import TipoStatusTurno from './interfaceTipoStatusTurno';
export default interface registroPonto {
    id_registro: string; // Default value in Java is "inativo"
    inicio_turno: Date | string; // Using Date or string to represent Instant
    fim_turno: Date | string; // Added to match 'fim_turno' in Java
    status_turno: TipoStatusTurno; // Matches 'TipoStatusTurno' in Java
    tempo_trabalhado_min: number; // Matches 'tempo_trabalhado_min' in Java
    tirou_almoco: boolean; // Added to match 'tirou_almoco' in Java
    pontos_marcados: Ponto[]; // Matches 'pontos_marcados' in Java
    abono?: Abono; // Added to match 'abono' in Java, optional since it might be null
}
interface Abono {
    motivo_abono: TipoAbono;
    horarios_abono: string;
}
 enum TipoAbono {
    ATESTADO_MEDICO,
    FALTA_JUSTIFICADA
 }