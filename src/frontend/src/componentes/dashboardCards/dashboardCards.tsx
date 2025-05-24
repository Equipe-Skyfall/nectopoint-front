import { motion } from "framer-motion";
import useDashboard from "../hooks/useDashboard";
import { use, useEffect, useState } from "react";


useDashboard()
export default function DashboardCards(props) {
     const dadospadrao = {
        "de_ferias":0,
        "de_folga" :0,
        "nao_iniciado":9,
        "no_intervalo":0,
        "trabalhando":0}
    const [counter, setCounter] = useState(dadospadrao);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await useDashboard();
                setCounter(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    const { redirecionarComFiltro } = props;
    
    console.log(counter);
    
    const statuses = [
  {
    label: "Trabalhando",
    filtro: "TRABALHANDO",
    icon: "✅",
    count: counter.trabalhando ,
    color: {
      header: "bg-green-600",
      button: "bg-green-500 hover:bg-green-700",
    },
  },
  {
    label: "Funcionários em Intervalo",
    filtro: "INTERVALO",
    icon: "☕",
    count: counter.no_intervalo,
    color: {
      header: "bg-orange-500",
      button: "bg-orange-400 hover:bg-orange-600",
    },
  },
  {
    label: "Funcionarios Ausentes",
    filtro: "NAO_COMPARECEU",
    icon: "❌",
    count: counter.nao_iniciado,
    color: {
      header: "bg-red-600",
      button: "bg-red-500 hover:bg-red-700",
    },
  },
  {
    label: "Turnos Irregulares",
    filtro: "IRREGULAR",
    icon: "⚠️",
    count: counter.nao_iniciado,
    color: {
      header: "bg-purple-600",
      button: "bg-purple-500 hover:bg-purple-700",
    },
  },
  {
    label: "Funcionários em Férias",
    filtro: "FERIAS",
    icon: "📅",
    count: counter.de_ferias,
    color: {
      header: "bg-blue-600",
      button: "bg-blue-500 hover:bg-blue-700",
    },
  },
  {
    label: "Funcionários em Folga",
    filtro: "FOLGA",
    icon: "🛌",
    count: counter.de_folga,
    color: {
      header: "bg-gray-600",
      button: "bg-gray-500 hover:bg-gray-700",
    },
  },
];
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6"
    >
      {statuses.map((status) => (
        <motion.div
          key={status.filtro}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className={`flex items-center justify-center ${status.color.header} text-white py-3`}>
            <span className="text-2xl mr-2 cursor-default">{status.icon}</span>
            <p className="text-lg cursor-default font-semibold">{status.label}</p>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-3xl cursor-default font-bold text-gray-800">{status.count}</p>
            <button
              onClick={() => redirecionarComFiltro(status.filtro)}
              className={`mt-4 px-4 py-2 text-white rounded-md text-sm font-semibold ${status.color.button}`}
            >
              Ver detalhes
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
