import { Alertas } from "./interfaceAlertas";
import registroPonto from "./interfaceRegistroPonto";
import PointRegistryEntity from "./interfaceRegistroPonto";
import { Ticket } from "./interfaceTicket";


export default interface SessaoUsuario {
  id_sessao: string; // Updated from 'id' to 'id_sessao'
    id_colaborador: number; // Added to match 'id_colaborador'
    dados_usuario: DadosUsuario; // Updated to match 'DadosUsuario'
    jornada_trabalho: JornadaTrabalho; // No changes needed

    jornada_atual: PointRegistryEntity; // Updated to match 'PointRegistryStripped'
    jornadas_historico: registroPonto[]; // Updated to match 'List<PointRegistryStripped>'
    jornadas_irregulares: registroPonto[]; // Updated to match 'List<PointRegistryStripped>'

    tickets_usuario: Ticket[]; // Added to match 'List<TicketsStripped>'
    alertas_usuario: Alertas[]; // Updated to match 'List<WarningsStripped>'
}

interface DadosUsuario {
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