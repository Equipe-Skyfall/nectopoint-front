import { useEffect, useState } from "react";
import useUserData from "../../hooks/userData";

import DisplayTempo from "../../displayTempo/displayTempo";
import Data from "../../hooks/data";
import baterPonto from "../../hooks/baterPonto";
import encerrarTurno from "../../hooks/encerrarPonto";


export default  function ConteudoHome() {
    
   const [modalConfirmacao, setModalConfirmacao] = useState(false);
    
    const userData : any = (useUserData());
    const entrada = (userData.jornada_atual.inicio_turno)
    const saida = (userData.jornada_atual.fim_turno)
    const banco_de_horas = (userData.jornada_trabalho.banco_de_horas)
    console.log('entrada',userData.jornada_atual.pontos_marcados.length);
    
    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const setModal= () => {
        setModalConfirmacao(!modalConfirmacao);
    }
    return (
        <>
            <div className="overflow-hidden ">

                <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto top-[80px] left-0 w-full mx-auto absolute"> {/* 'bg-midnight' e 'text-white' são cores customizadas */}
                    
                    <Data />
                    
                    <DisplayTempo entrada={entrada} saida={saida} intervalo={userData.jornada_atual.tirou_almoco} banco_de_horas={banco_de_horas}></DisplayTempo>
                          

                    <div className="flex flex-col mx-auto mt-10  w-58 ">
                                <button className="bg-blue-900 pointer rounded-lg p-3 mx-auto mt-10 w-64 px-10 text-center poppins" onClick={() => {
                                    baterPonto();
                                }
                                }>
                                    {
                                userData.jornada_atual.pontos_marcados.length % 2  == 0 ? 'Registrar Entrada' : 'Registrar Saída'
                                    }
                                </button>
                                    {
                                    userData.jornada_atual.pontos_marcados.length < 0 ? '' :
                                    <button className=" pointer rounded-lg p-2 mx-auto animacao w-full px-10 text-center text-sm text-red-700 poppins" onClick={
                                        setModal
                    
                                    }>
                                        Encerrar turno 
                                    </button>
                                    
                                    }
                            { modalConfirmacao ?
                                <div className="fixed z-10 inset-0 overflow-y-auto flex flex-col justify-center items-center bg-black bg-opacity-50">
                                    <div className="bg-white w-[300px] h-auto p-4 px-8 rounded-lg flex flex-col justify-center items-center">
                                        <p className="text-black text-center mt-20 poppins text-justify">Ao encerrar o turno você encerra seu turno e bloqueia qualquer acesso até o dia seguinte.</p>
                                        <p className="text-black text-center mt-20 poppins">Tem certeza disso ?</p>
                                        <button className="bg-primaryred pointer rounded-lg p-3 mx-auto mt-10 w-64 px-10 text-center poppins" onClick={() => {
                                            encerrarTurno();
                                            setModal();
                                        }
                                        }>Encerrar Turno</button>
                                        <button className="bg-blue-900 pointer rounded-lg p-3 mx-auto mt-10 w-64 px-10 text-center poppins" onClick={() => {
                                            setModal();
                                        }
                                        }>Cancelar</button>
                                    </div>
                                </div>
                                : ''
                                        

                            }
                        
                    </div>

                </div>
            </div >
        </>
    );
}   