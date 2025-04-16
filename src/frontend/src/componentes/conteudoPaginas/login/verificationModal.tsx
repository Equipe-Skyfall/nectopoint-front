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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-blue-800 font-semibold">
            Verificação de Segurança
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            Enviamos um código de verificação para seu email.
          </p>
          <p className="text-gray-700 mb-4">
            Por favor, insira o código de 6 dígitos abaixo para continuar.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o código de verificação"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error.response?.data?.message || "Código de verificação inválido. Tente novamente."}
            </div>
          )}
          
          <div className="flex justify-between items-center">
      
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className={`px-4 py-2 rounded ${
                isLoading || code.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? "Verificando..." : "Verificar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;