import { FaSearch } from 'react-icons/fa';
import {SearchBarProps} from '../../../interfaces/interfaceFiltrosSub';

// Componente de barra de pesquisa, é o filtro individual sem estar ligado em uma página, cuidado com estilizações nele, irá mudar em todas páginas aplicadas.
export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Nome do Colaborador"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-4 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={255}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
        </div>
    );
}