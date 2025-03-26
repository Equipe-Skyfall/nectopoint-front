import { useEffect } from "react";
import useUserData from "../../hooks/userData";

import DisplayTempo from "../../displayTempo/displayTempo";
import Data from "../../hooks/data";
import baterPonto from "../../hooks/hooksChamarBackend/baterPonto";


export default  function ConteudoHome() {
    
   
    
    const userData : any = (useUserData());
    const entrada = (userData.jornada_atual.inicio_turno)
    const saida = (userData.jornada_atual.fim_turno)
    const banco_de_horas = (userData.jornada_trabalho.banco_de_horas)
    console.log('entrada',entrada);
    
    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <>
            <div className="overflow-hidden ">

                <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto top-[80px] left-0 w-full mx-auto absolute"> {/* 'bg-midnight' e 'text-white' são cores customizadas */}
                    
                    <Data />
                    
                    <DisplayTempo entrada={entrada} saida={saida} intervalo={true} banco_de_horas={banco_de_horas}></DisplayTempo>
                          

                    <div>
                        <button className="bg-blue-800 rounded-lg p-3 w-full mt-10 px-10 text-center poppins" onClick={baterPonto}>Bater Ponto</button>
                    </div>

                </div>
            </div >
        </>
    );
}   