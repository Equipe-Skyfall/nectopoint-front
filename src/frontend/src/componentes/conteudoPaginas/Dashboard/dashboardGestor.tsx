import { useEffect, useState } from "react";
import api from "../../hooks/api";

import GraficoDashboard from "../../graficoDashboard/graficoDashboard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useDasboard from "../../hooks/useDashboard";
import useDashboard from "../../hooks/useDashboard";
import DashboardCards from "../../dashboardCards/dashboardCards";
import useUserData from "../../hooks/userData";
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
    const user = useUserData().dados_usuario.nome;
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
       if (status === "FERIAS" || status === "FOLGA" ) {
       
        
        
         return navigate('/colaboradores', { 
            state: { 
                statusSelecionado: status, // Nome exato que seu FiltrosHistorico espera
               
            } 
        }
        )
       } else {
         return navigate('/historico-gestor', { 
            state: { 
                statusTurno: status, // Nome exato que seu FiltrosHistorico espera
                startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
                endDate: new Date()
            } 
        })
    };
    }
    
    
    return (
        <>
        <p className="mb-8 text-3xl mt-10 poppins bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center">Olá {user} , seja bem vindo a dashboard do gerente</p>
        <DashboardCards redirecionarComFiltro={redirecionarComFiltro}  />
        </>
    )
}