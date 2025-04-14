import { StatusSelectProps } from "../../../interfaces/interfaceFiltrosSub";
// Componente de status, é o filtro individual sem estar ligado em uma página, cuidado com estilizações nele, irá mudar em todas páginas aplicadas.


export default function StatusSelect({ value, onChange }: StatusSelectProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-2.5 w-full border border-gray-300 text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <option value="">Todos os status</option>
            <option value="TRABALHANDO">Trabalhando</option>
            <option value="INTERVALO">Intervalo</option>
            <option value="ENCERRADO">Encerrado</option>
            <option value="NAO_COMPARECEU">Não Compareceu</option>
            <option value="IRREGULAR">Irregular</option>
        </select>
    );
}