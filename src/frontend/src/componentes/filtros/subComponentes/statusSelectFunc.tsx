import { motion } from 'framer-motion';
import { StatusSelectProps } from "../../../interfaces/interfaceFiltrosSub";

export default function StatusSelectFunc({ value, onChange }: StatusSelectProps) {
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative"
        >
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer shadow-sm transition-all duration-200"
            >
                <option value="">Todos os status</option>
                <option value="ENCERRADO">Encerrado</option>
                <option value="NAO_COMPARECEU">Não Compareceu</option>
                <option value="IRREGULAR">Irregular</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </motion.div>
    );
}