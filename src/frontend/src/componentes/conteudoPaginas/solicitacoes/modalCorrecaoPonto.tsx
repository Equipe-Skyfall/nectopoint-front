import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiClock, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import ModalConfirmacao from './modalConfirmacao';
import refetch from '../../hooks/hooksChamarBackend/refetch';

interface Ponto {
  tipo: string;
  horario: string;
  dataOriginal?: Date;
}

interface ModalCorrecaoPontoProps {
  pontos: Ponto[];
  dataJornada: string;
  onClose: () => void;
  onSubmit: (pontosAjustados: Ponto[]) => Promise<void>;
  onSuccess: () => void; 
}
export default function ModalCorrecaoPonto({
  pontos,
  dataJornada,
  onClose,
  onSubmit,
  onSuccess,
}: ModalCorrecaoPontoProps) {
  const [pontosEditados, setPontosEditados] = useState<Ponto[]>(pontos);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [novoSaidaHorario, setNovoSaidaHorario] = useState('');
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  // Verifica se termina com entrada (caso irregular)
  const terminaComEntrada = pontosEditados[pontosEditados.length - 1]?.tipo === 'Entrada';

  useEffect(() => {
    // Só permite adicionar saída se terminar com entrada
    if (terminaComEntrada) {
      setNovoSaidaHorario('');
    } else {
      setNovoSaidaHorario('');
      setErro(null);
    }
  }, [terminaComEntrada]);

  const handleHorarioChange = (index: number, novoHorario: string) => {
    const novosPontos = [...pontosEditados];
    novosPontos[index].horario = novoHorario;
    setPontosEditados(novosPontos);
    setErro(null);
  };

  const handleAdicionarSaida = () => {
    if (!novoSaidaHorario) {
      setErro('Informe o horário da saída');
      return;
    }

    // Valida se o horário é posterior à última entrada
    const ultimaEntrada = pontosEditados[pontosEditados.length - 1].horario;
    if (novoSaidaHorario <= ultimaEntrada) {
      setErro('A saída deve ser após a última entrada');
      return;
    }

    setPontosEditados([...pontosEditados, { tipo: 'Saída', horario: novoSaidaHorario }]);
    setNovoSaidaHorario('');
    setErro(null);
  };

  const validarAlmoco = () => {
    // Verifica intervalos de almoço (entre saída e entrada)
    for (let i = 0; i < pontosEditados.length - 1; i++) {
      if (pontosEditados[i].tipo === 'Saída' && pontosEditados[i + 1].tipo === 'Entrada') {
        const [saidaH, saidaM] = pontosEditados[i].horario.split(':').map(Number);
        const [entradaH, entradaM] = pontosEditados[i + 1].horario.split(':').map(Number);

        const diffMinutos = (entradaH * 60 + entradaM) - (saidaH * 60 + saidaM);

        if (diffMinutos < 60) {
          setErro(`Intervalo de almoço entre ${pontosEditados[i].horario} e ${pontosEditados[i + 1].horario} deve ser de pelo menos 1 hora`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarAlmoco()) return;

    try {
      setEnviando(true);
      // Envia apenas os campos tipo e horario
      const pontosParaEnviar = pontosEditados.map(p => ({
        tipo: p.tipo,
        horario: p.horario
      }));
      await onSubmit(pontosParaEnviar);
      onSuccess() 
      setMostrarConfirmacao(true);~
      refetch()
      setTimeout(() => {
        setMostrarConfirmacao(false);
        onClose();
      }, 2000);
    } catch (error) {
      setErro('Erro ao enviar solicitação. Verifique os dados e tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Correção de Pontos - {dataJornada}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                disabled={enviando}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4 text-center">
                {terminaComEntrada
                  ? "Adicione a saída faltante e ajuste os horários se necessário"
                  : "Ajuste os horários dos pontos registrados"}
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {pontosEditados.map((ponto, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium min-w-20 text-center ${ponto.tipo === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {ponto.tipo}
                    </span>

                    <div className="flex items-center flex-1">
                      <FiClock className="text-gray-500 mr-2" />
                      <input
                        type="time"
                        value={ponto.horario}
                        onChange={(e) => handleHorarioChange(index, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                        disabled={enviando}
                      />
                    </div>
                  </div>
                ))}

                {terminaComEntrada && (
                  <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg mt-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium min-w-20 text-center bg-red-100 text-red-800">
                      Saída
                    </span>

                    <div className="flex items-center flex-1">
                      <FiClock className="text-gray-500 mr-2" />
                      <input
                        type="time"
                        value={novoSaidaHorario}
                        onChange={(e) => setNovoSaidaHorario(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                        disabled={enviando}
                      />
                    </div>

                    <button
                      onClick={handleAdicionarSaida}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      disabled={enviando}
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>

              {erro && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                  <FiAlertCircle className="mr-2" />
                  <span className="text-sm">{erro}</span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                disabled={enviando || (terminaComEntrada && !pontosEditados.some(p => p.tipo === 'Saída' && !pontos.some(op => op.horario === p.horario)))}
              >
                {enviando ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Enviar Solicitação
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {mostrarConfirmacao && (
        <ModalConfirmacao
          isOpen={mostrarConfirmacao}
          onClose={() => setMostrarConfirmacao(false)}
          mensagem="Solicitação enviada com sucesso!"
          tipo="sucesso"
        />
      )}
    </>
  );
}