

export default interface SessaoUsuario {
    id: number;
    nome: string | null; 
    cpf: string;
    cargo: string;
    departamento: string;
    status: string | null;
    jornada_trabalho: JornadaTrabalho;
    jornada_atual: Turno;
    jornadas_historico: Turno[];
    jornadas_irregulares: Turno[];
    alertas_usuario: any[];
}

interface UserData {
    nome: string | null; 
    cpf: string;
    cargo: string;
    departamento: string;
    status: string | null;
  }
  
  interface JornadaTrabalho {
    tipo_jornada: string;
    banco_de_horas: number;
    horas_diarias: number;
  }
  
  interface Ponto {
    tipo_ponto: string; 
    data_hora: string;
    tempo_entre_pontos: number | null;
  }
  
  interface Turno {
    fim_turno: string | number | Date;
    id_colaborador: number;
    nome_colaborador: string;
    id_registro: string;
    inicio_turno: string;
    status_turno: string;
    tempo_trabalhado_min: number;
    tempo_intervalo_min: number;
    pontos_marcados: Ponto[];
  }