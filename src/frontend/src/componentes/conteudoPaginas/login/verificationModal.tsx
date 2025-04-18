import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  isLoading: boolean;
  error: any;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  isLoading,
  error
}) => {
  const [code, setCode] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Verificação de Segurança
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Enviamos um código de verificação para seu email.
          </p>
          <p className="text-gray-700">
            Por favor, insira o código de 6 dígitos abaixo para continuar.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <motion.div whileHover={{ scale: 1.02 }}>
              <input
                type="text"
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Digite o código de verificação"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                autoFocus
              />
            </motion.div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700">
                {error.response?.data?.message || "Código de verificação inválido. Tente novamente."}
              </p>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || code.length !== 6}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center ${
              isLoading || code.length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
            }`}
          >
            {isLoading ? "Verificando..." : "Verificar Código"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerificationModal;
