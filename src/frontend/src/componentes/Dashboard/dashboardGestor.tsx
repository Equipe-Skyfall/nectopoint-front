import { useEffect, useState } from "react";
import api from "../hooks/api";
// (int page), (int size), (Date startDate), (Date endDate), (str statusTurno), (int id_colaborador) 
type params = {
page: number;
size: number;
startDate: Date;
endDate: Date;
status_turno: string;
id_colaborador: string;
}

export default function DashboardGestor()    {
    const [data, setData] = useState([]);

    
    useEffect(() => {
        const fetchData = async () => {
            
           if (data.length  == undefined || null || []) {
            let hoje = new Date();
            let umDiaAtras = new Date(hoje);
            const params :params    = {
                page: 0,
                size: 1000,
                startDate: umDiaAtras,// 1 dia atrás
                endDate: hoje,
                status_turno: "",
                id_colaborador: "",
            };
            try {
                const response = await api.get("sessao/usuario/todos", {
                    params: {
                        page: params.page,
                        size: params.size,
                        startDate: params.startDate.toISOString(),
                        endDate: params.endDate.toISOString(),
                        status_turno: params.status_turno,
                        id_colaborador: params.id_colaborador,
                    },
                });
                console.log("Data fetched:", response.data);
                setData(response.data.content); ;
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }}
            else {
               
            }
        };
        
        fetchData();
    },[])
    let Trabalhando = 0;
    let Atrasados = 0;
    let HoraExtra = 0;
    let SaidaAntecipada = 0;

    const trabalhando = data.filter((item: any) => item.status === "TRABALHANDO");
    const trabalhandoCount = trabalhando.length;
    const ausentes = data.filter((item: any) => item.status === "NAO_COMPARECEU");
    const ausentesCount = ausentes.length;
    console.log(data);
    
return (
    <div className="flex justify-center">
                    <div className=" rounded-md  h-[140vw]  sm:h-[35vw] w-[80%]">
                       <div className="flex items-center bg-primarygreen rounded-xl text-center w-72 justify-center align-top place-self-center place-items-center text-center mx-auto px-2 my-2">
                        <p className=" flex text-white text-center text-lg  align-text-top font-bold p-2 align-top p-auto ">
                                Trabalhando : 
                        </p>
                        <p className="font-bold text-white">{trabalhandoCount} </p>
                        
                       </div>
                       <div className="flex items-center bg-primaryred rounded-xl text-center w-72 justify-center align-top place-self-center place-items-center text-center mx-auto px-2 my-2">

                       <p className=" flex text-white text-center text-lg  align-text-top font-bold p-2 align-top p-auto ">
                                Ausentes : 
                        </p>
                        <p className="font-bold text-white">{ausentesCount} </p>
                        </div>
                       
                    </div>

    </div>
                )
}