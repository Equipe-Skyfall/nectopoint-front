import { useEffect } from "react";


import DisplayTempo from "../../displayTempo/displayTempo";
import Data from "../../hooks/data";
import baterPonto from "../../hooks/hooksChamarBackend/baterPonto";


export default  function ConteudoHome() {
    
   
    
    
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
                    
                    <DisplayTempo cor="primarygreen" img="./setadir.png" hora={'9999'}></DisplayTempo>
                    <DisplayTempo cor="primaryorange" img="/almoco.png" hora="1204"></DisplayTempo>
                    <DisplayTempo cor="primarybrown" img="/fimalmoco.png" hora="1304"></DisplayTempo>
                    <DisplayTempo cor="primaryred" img="/setadir.png" hora="1604"></DisplayTempo>         {/* para montar palhetas customizadas vá para tailwind.config.js > theme > extend > colors */}

                    <div>
                        <button className="bg-blue-800 rounded-lg p-3 w-full mt-10 px-10 text-center poppins" onClick={baterPonto}>Botão Mutável</button>
                    </div>

                </div>
            </div >
        </>
    );
}   