import { useEffect, useState } from "react";
import useUserData from "../../hooks/userData";

import DisplayTempo from "../../displayTempo/displayTempo";
import Data from "../../hooks/data";
import baterPonto from "../../hooks/baterPonto";
import encerrarTurno from "../../hooks/encerrarPonto";
import { AnimatePresence, motion } from "framer-motion";
import { FiLogIn, FiLogOut, FiPower } from "react-icons/fi";


export default function ConteudoHome() {

    const [modalConfirmacao, setModalConfirmacao] = useState(false);

    const userData: any = (useUserData());
    const entrada = (userData.jornada_atual.inicio_turno)
    const pontos = userData.jornada_atual.pontos_marcados
    //Se tiver pontos os bastante define up_hora e up_tipo

    // Se o último ponto for uma saída, define up_hora e up_tipo
    const up_hora = pontos.length >= 2 ? (pontos[pontos.length - 1].data_hora) : ''
    const up_tipo = pontos.length >= 2 ? (pontos[pontos.length - 1].tipo_ponto) : ''
    const ultimoPonto = pontos.length >= 2 ? { "tipo_ponto": up_tipo, up_hora } : { 'tipo_ponto': null, up_hora: null }
    const banco_de_horas = (userData.jornada_trabalho.banco_de_horas)



    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const setModal = () => {
        setModalConfirmacao(!modalConfirmacao);
    }
    return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen mt-5 p-4"
    >
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
        >
            {/* Cartão principal */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
            >
                {/* Cabeçalho */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-b border-gray-200">
                    <Data />
                </div>

                {/* Display do tempo */}
                <div className="p-6 text-white">
                    <DisplayTempo
                        entrada={entrada}
                        ultimo_ponto={ultimoPonto}
                        intervalo={userData.jornada_atual.tirou_almoco}
                        banco_de_horas={banco_de_horas}
                    />
                </div>

                {/* Botões de ação */}
                <div className="p-6 pt-0 space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-center w-full py-3 px-4 rounded-lg text-white font-medium shadow-md transition-all ${userData.jornada_atual.pontos_marcados.length % 2 === 0
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            }`}
                        onClick={baterPonto}
                    >
                        {userData.jornada_atual.pontos_marcados.length % 2 === 0 ? (
                            <>
                                <FiLogIn className="mr-2" />
                                Registrar Entrada
                            </>
                        ) : (
                            <>
                                <FiLogOut className="mr-2" />
                                Registrar Saída
                            </>
                        )}
                    </motion.button>

                    {userData.jornada_atual.pontos_marcados.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-md transition-all"
                            onClick={setModal}
                        >
                            <FiPower className="mr-2" />
                            Encerrar Turno
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Modal de confirmação */}
            <AnimatePresence>
                {modalConfirmacao && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 poppins">
                                Confirmar Encerramento
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Ao encerrar o turno você não poderá registrar novos pontos até o próximo dia de trabalho.
                            </p>

                            <div className="space-y-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold shadow-md"
                                    onClick={() => {
                                        encerrarTurno();
                                        setModal();
                                    }}
                                >
                                    Confirmar Encerramento
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium shadow-md"
                                    onClick={setModal}
                                >
                                    Cancelar
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    </motion.div>
    );
}   
