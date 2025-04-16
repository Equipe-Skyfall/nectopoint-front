import { motion } from 'framer-motion';
import { FiltrosColaboradorProps } from '../../interfaces/interfaceFiltrosSub';
import SearchBar from './subComponentes/searchBar';
import TipoJornada from './subComponentes/tipoJornada';
import { FiFilter, FiX } from 'react-icons/fi';

export default function FiltrosColaborador({
    searchQuery,
    setSearchQuery,
    jornadaSelecionada,
    setJornadaSelecionada,
    limparFiltros
}: FiltrosColaboradorProps) {
    const hasFilters = searchQuery || jornadaSelecionada;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 flex items-center">
                    <FiFilter className="mr-2 text-blue-600" />
                    Filtrar Colaboradores
                </h3>
                
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full">
                <div className="flex-1">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <div className="w-full md:w-48">
                    <TipoJornada jornadaSelecionada={jornadaSelecionada} onChange={setJornadaSelecionada} />
                </div>
                {hasFilters && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={limparFiltros}
                        className="flex items-center px-3 py-1.5 text-sm ml-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <FiX className="mr-1" />
                        Limpar Filtros
                    </motion.button>
                )}
            </div>
            
        </motion.div>
        
    );
}