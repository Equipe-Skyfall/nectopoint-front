import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpiredModal = ({ isOpen, onClose }: SessionExpiredModalProps) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <FiAlertCircle className="text-5xl text-yellow-500" />
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Sessão Expirada
              </h3>
              
              <p className="text-gray-600 mb-6">
                Você foi desconectado porque o tempo da sessão expirou.
                <br />
                Por favor, entre novamente.
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Entendido
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};