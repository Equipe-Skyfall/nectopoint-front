import Ponto from './interfacePonto';
import TipoStatusTurno from './interfaceTipoStatusTurno';
export default interface PointRegistryEntity {
    id_registro: string;
    id_colaborador: number;
    inicio_turno: Date; // Using Date since Instant is Java-specific; could also use string for ISO date
    nome_colaborador: string;
    status_turno: TipoStatusTurno; // Assuming TipoStatusTurno is an enum or type defined elsewhere
    tempo_trabalhado_min: number;
    tempo_intervalo_min: number;
    pontos_marcados: Ponto[];
}