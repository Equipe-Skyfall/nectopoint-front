import { useEffect, useState } from "react";
import api from "../hooks/api";

import GraficoDashboard from "../graficoDashboard/graficoDashboard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// (int page), (int size), (Date startDate), (Date endDate), (str statusTurno), (int id_colaborador) 
type params = {
    page: number;
    size: number;
    startDate: string;
    endDate: string;
    status_turno: string;
  
}

export default function DashboardGestor() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {

            if (data.length == undefined || null || []) {
                let hoje = new Date();
                let umDiaAtras = new Date(hoje);
                const params: params = {
                    page: 0,
                    size: 1000,
                    startDate: umDiaAtras.toISOString(),// 1 dia atrás
                    endDate: hoje.toISOString(),
                    status_turno: ""
                    
                };
               
                
                try {
                    const response = await api.get("sessao/usuario/todos", {
                        params: {
                            page: params.page,
                            size: params.size,
                            startDate: params.startDate,
                            endDate: params.endDate,
                            status_turno: params.status_turno,
                            
                        },
                    });
                    
                    setData(response.data.content);;

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            else {

            }
        };

        fetchData();
    }, [])
    

    const trabalhando = data.filter((item: any) => item.status === "TRABALHANDO");
    const trabalhandoCount = trabalhando.length;
    const ausentes = data.filter((item: any) => item.status === "NAO_COMPARECEU");
    const ausentesCount = ausentes.length;
    const redirecionarComFiltro = (status: string) => {
        navigate('/historico-gestor', { 
            state: { 
                statusTurno: status, // Nome exato que seu FiltrosHistorico espera
                startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
                endDate: new Date()
            } 
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center  justify-center   bg-gradient-to-b"
        >
            <motion.h1  
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 mt-4 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent poppins"
            >
                Dashboard Gerencial
            </motion.h1>

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-4xl bg-white rounded-xl shadow-xl mb-7 overflow-hidden border border-gray-200 p-6"
            >
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => redirecionarComFiltro("TRABALHANDO") }
                        className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl w-full sm:w-72 h-20 justify-center text-center shadow-lg"
                    >
                        <div className="flex items-center px-4">
                            <p className="text-white text-lg font-bold poppins mr-3">
                                Trabalhando:
                            </p>
                            <p className="text-white text-2xl font-bold poppins">
                                {trabalhandoCount}
                            </p>
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => redirecionarComFiltro("NAO_COMPARECEU")}
                        className="flex items-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl w-full sm:w-72 h-20 justify-center text-center shadow-lg"
                    >
                        <div className="flex items-center px-4">
                            <p className="text-white text-lg font-bold poppins mr-3">
                                Ausentes:
                            </p>
                            <p className="text-white text-2xl font-bold poppins">
                                {ausentesCount}
                            </p>
                        </div>
                    </motion.button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full"
                >
                    <GraficoDashboard />
                </motion.div>
            </motion.div>
        </motion.div>
    )
}