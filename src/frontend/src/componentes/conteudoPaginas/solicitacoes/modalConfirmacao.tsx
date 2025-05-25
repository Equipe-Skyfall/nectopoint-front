import { motion } from 'framer-motion';
import { FiCheckCircle, FiX } from 'react-icons/fi';

interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
  mensagem: string;
  tipo?: 'sucesso' | 'erro';
}

export default function ModalConfirmacao({
  isOpen,
  onClose,
  mensagem,
  tipo = 'sucesso'
}: ModalConfirmacaoProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className={`bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden ${
          tipo === 'sucesso' ? 'border-t-4 border-green-500' : 'border-t-4 border-red-500'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className={`mt-1 mr-3 flex-shrink-0 ${
                tipo === 'sucesso' ? 'text-green-500' : 'text-red-500'
              }`}>
                <FiCheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {tipo === 'sucesso' ? 'Sucesso!' : 'Erro'}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{mensagem}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                tipo === 'sucesso'
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}