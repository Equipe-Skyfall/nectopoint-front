import { useEffect, useState } from "react";
import api from "../hooks/api";

import GraficoDashboard from "../graficoDashboard/graficoDashboard";
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
    

    return (
        <div className="flex justify-center">
            <div className=" rounded-md w-[80%] flex flex-col justify-center items-center bg-gray-100 shadow-md p-6 sm:p-4">
                <div className="flex flex-wrap justify-center gap-0 sm:gap-5">
                    <div className="flex items-center bg-primarygreen rounded-xl w-60 sm:w-72 justify-center align-top place-self-center place-items-center text-center mx-auto px-2 my-2">
                        <p className=" flex text-white text-center text-lg  font-bold p-2 align-top p-auto ">
                            Trabalhando :

                        </p>
                        <p className="font-bold text-white">{trabalhandoCount} </p>

                    </div>
                    <div className="flex  items-center bg-red-700 rounded-xl text-center w-60 sm:w-72 justify-center align-top place-self-center place-items-center mx-auto px-2 my-2">

                        <p className=" flex text-white text-center text-lg font-bold p-2 align-top p-auto ">
                            Ausentes :
                        </p>
                        <p className="font-bold text-white">{ausentesCount} </p>
                    </div>
                </div>
                <GraficoDashboard />
            </div>

        </div>
    )
}