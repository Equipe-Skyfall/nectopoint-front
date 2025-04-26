import { motion } from 'framer-motion';
import DateRangePicker from './subComponentes/datePicker';
import { FiltrosHistoricoProps } from '../../interfaces/interfaceFiltrosSub';
import { FiFilter, FiX } from 'react-icons/fi';
import StatusSelectFunc from './subComponentes/statusSelectFunc';

export default function FiltrosHistoricoFunc({
    statusTurno,
    setStatusTurno,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    limparFiltros
}: FiltrosHistoricoProps) {
    const hasFilters = statusTurno || startDate || endDate;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl mx-auto mb-8"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                    <FiFilter className="mr-2 text-blue-600" />
                    Filtros Avançados
                </h3>
                {hasFilters && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={limparFiltros}
                        className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <FiX className="mr-1" />
                        Limpar Filtros
                    </motion.button>
                )}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <StatusSelectFunc value={statusTurno} onChange={setStatusTurno} />
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>
        </motion.div>
    );
}