import { motion } from 'framer-motion';
import { StatusColaboradorSelectProps } from '../../../interfaces/interfaceFiltrosSub';

export default function StatusDeactivateSelect({ value, onChange }: StatusColaboradorSelectProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="relative"
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-6 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os status</option>
        <option value="ESCALADO">Escalado</option>
        <option value="FOLGA">Folga</option>
        <option value="INATIVO">Inativo</option>
      </select>
    </motion.div>
  );
}