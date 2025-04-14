import { TipoJornadaProps } from "../../../interfaces/interfaceFiltrosSub";

// Componente de TipoJornada, é o filtro individual sem estar ligado em uma página, cuidado com estilizações nele, irá mudar em todas páginas aplicadas.

export default function TipoJornada({ jornadaSelecionada, onChange }: TipoJornadaProps) {
    return (
        <select
            value={jornadaSelecionada}
            onChange={(e) => onChange(e.target.value)}  
            className="px-4 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Todas as Jornadas</option>
            <option value="CINCO_X_DOIS">5 x 2</option>
            <option value="SEIS_X_UM">6 x 1</option>
        </select>
    );
}