import { useEffect } from "react";


import DisplayTempo from "../../displayTempo/displayTempo";
export default function ConteudoHome() {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    },[]);

    return (
        <>
        <div className="overflow-hidden">
            <div className="text-center flex justify-center my-8">
                <img src="/nectopoint.png" className="w-24 align-middle text-center  " alt="homeLogo"/>
                
            </div>
           
        </div >
        <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto top-1/4 left-0 w-full mx-auto absolute"> {/* 'bg-midnight' e 'text-white' são cores customizadas */}
                    <h1 className=" poppins-semibold w-full text-[25px] my-8 text-center text-blue-800">Bem vindo , Nome ! </h1>

                    <DisplayTempo cor="primarygreen" img="./setadir.png" hora="0904"></DisplayTempo>
                    <DisplayTempo cor="primaryorange" img="/almoco.png" hora="1204"></DisplayTempo>
                    <DisplayTempo cor="primarybrown" img="/fimalmoco.png" hora="1304"></DisplayTempo>
                    <DisplayTempo cor="primaryred" img="/setadir.png" hora="1604"></DisplayTempo>         {/* para montar palhetas customizadas vá para tailwind.config.js > theme > extend > colors */}
                    
                    <button className="bg-blue-800 w-24  my-4 rounded-full p-2 text-center poppins bg"> Botao</button>
                  

        </div>

        
        </>
    );
}   