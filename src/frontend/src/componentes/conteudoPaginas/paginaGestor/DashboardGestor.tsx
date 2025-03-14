import Data from "./data";
import { FaBell } from "react-icons/fa";
// Iremos precisar de um fetch para puxar todos os dados dos funcionarios, de quem está trabalhando ou não, tenho um rascunho porém irei deixar comentado

// import React, { useEffect, useState } from 'react';
// import Data from './data';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// interface DadosFuncionarios {
//     trabalhando: number;
//     atrasados: number;
//     horaExtra: number;
//     saidaAntecipada: number;
// }

// 
// export default function DashboardGestor() {
//     const [dados, setDados] = useState<DadosFuncionarios | null>(null);

//     // Função para buscar os dados do backend
//     useEffect(() => {
//         const fetchDados = async () => {
//             try {
//                 const response = await fetch('https://api.nosso/rota-pro-funcionario'); // Altere para sua API real
//                 const data = await response.json();
//                 setDados(data);
//             } catch (error) {
//                 console.error('Erro ao buscar dados:', error);
//             }
//         };

//         fetchDados();
//     }, []);

//     if (!dados) {
//         return <p className="text-center mt-10">Carregando dados...</p>;
//     }

//     // Dados para os gráficos
//     const dataGrafico = [
//         { name: 'Funcionários', value: dados.atrasados, categoria: 'Atrasados', color: 'red' },
//         { name: 'Funcionários', value: dados.horaExtra, categoria: 'Hora Extra', color: 'blue' },
//         { name: 'Funcionários', value: dados.saidaAntecipada, categoria: 'Saída Antecipada', color: 'gold' }
//     ];

//     return (
//         <div className="overflow-hidden pt-20 flex flex-col">
//             <Data />
//             <div className="flex justify-center">
//                 <div className="bg-slate-200 rounded-md shadow-md h-auto w-[80%] p-4">
//                     <h3 className="text-green-600 text-center text-lg font-bold mb-2">
//                         {dados.trabalhando} Funcionários Trabalhando
//                     </h3>

//                     <div className="flex flex-col items-center">
//                         {dataGrafico.map((item, index) => (
//                             <div key={index} className="mb-4">
//                                 <h4 className={`text-${item.color}-600 text-center font-semibold`}>
//                                     {item.value} {item.categoria}
//                                 </h4>
//                                 <ResponsiveContainer width={200} height={100}>
//                                     <LineChart data={[{ value: 0 }, { value: item.value }]}>
//                                         <CartesianGrid strokeDasharray="3 3" />
//                                         <XAxis hide />
//                                         <YAxis domain={[0, Math.max(...dataGrafico.map(d => d.value))]} />
//                                         <Tooltip />
//                                         <Line type="monotone" dataKey="value" stroke={item.color} strokeWidth={2} />
//                                     </LineChart>
//                                 </ResponsiveContainer>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//      Seria algo desta maneira, puxando do banco de dados os funcionários
export default function DashboardGestor() {


    return (
        <>
            <div className="overflow-hidden pt-20 flex flex-col">
                <Data />
                <div className="flex justify-center">
                    <div className="bg-[#F1F1F1] rounded-md shadow-sm h-[140vw]  sm:h-[35vw] w-[80%]">
                        <h3 className="text-green-600 text-center text-lg font-bold mt-4">
                            0 Funcionários Trabalhando
                        </h3>
                        <div>
                            {/*Aqui vai o grafico */}
                            <h3 className="text-red-600 text-center text-lg font-bold mt-4">1 Funcionários Atrasados</h3>
                        </div>
                        <div>
                            {/*Aqui vai o grafico */}
                            <h3 className="text-blue-600 text-center text-lg font-bold mt-4">2 Hora Extra</h3>
                        </div>
                        <div>
                            {/*Aqui vai o grafico */}
                            <h3 className="text-yellow-600 text-center text-lg font-bold mt-4">3 Saída Antecipada</h3>
                        </div>
                    </div>

                </div>
                <div className="bg-slate-300 rounded-full absolute right-5 bottom-5 sm:right-14 shadow-md h-9 sm:h-14 sm:w-14 w-9">
                    <button >
                        <FaBell className="w-5 h-5 sm:h-9 sm:w-9 mt-2 text-gray-800" />
                    </button>
                </div>
            </div>
        </>
    );
}  