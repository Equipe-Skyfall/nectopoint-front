import { motion } from 'framer-motion';

import DateRangePicker from './subComponentes/datePicker';
import { FiltrosSoliProps } from '../../interfaces/interfaceFiltrosSub';
import { FiFilter, FiX } from 'react-icons/fi';

export default function FiltrosSoli({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    limparFiltros
}: FiltrosSoliProps) {
    const hasFilters = startDate || endDate;

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl mx-auto  mb-4"
        >
            <div className="flex items-center justify-center mb-4">
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

            <div className="w-full flex justify-center text-center  md:grid-cols-4 gap-4 bg-white p-2 rounded-xl ">
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