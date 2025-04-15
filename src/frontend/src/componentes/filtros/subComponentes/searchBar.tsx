import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SearchBarProps } from '../../../interfaces/interfaceFiltrosSub';

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative"
        >
            <input
                type="text"
                placeholder="Nome do Colaborador"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                maxLength={255}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            {value && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => onChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <span className="text-gray-400 hover:text-gray-600 transition-colors">
                        ×
                    </span>
                </motion.button>
            )}
        </motion.div>
    );
}