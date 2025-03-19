import { useEffect } from "react";


import DisplayTempo from "../../displayTempo/displayTempo";
import DataUser from "../paginaUsuario/datausuario";
export default function Ponto() {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <>
            <div className="overflow-hidden pt-20">

                <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto topabso-1/4 left-0 w-full mx-auto lute"> {/* 'bg-midnight' e 'text-white' são cores customizadas */}
                    <DataUser />

                    <DisplayTempo cor="primarygreen" img="./setadir.png" hora="0904"></DisplayTempo>
                    <DisplayTempo cor="primaryorange" img="/almoco.png" hora="1204"></DisplayTempo>
                    <DisplayTempo cor="primarybrown" img="/fimalmoco.png" hora="1304"></DisplayTempo>
                    <DisplayTempo cor="primaryred" img="/setadir.png" hora="1604"></DisplayTempo>         {/* para montar palhetas customizadas vá para tailwind.config.js > theme > extend > colors */}

                    <div>
                        <button className="bg-blue-800 rounded-lg p-3 w-full mt-10 px-10 text-center poppins">Botão Mutável</button>
                    </div>

                </div>
            </div >
        </>
    );
}   