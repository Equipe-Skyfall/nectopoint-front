import { useEffect } from "react";



import TabelaHistorico from "../../tabelaHistorico/tabelaHistorico";
export default function ConteudoHistorico() {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <>
            <div className="overflow-hidden">

                <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto top-1/4 left-0 w-full mx-auto absolute"> {/* 'bg-midnight' e 'text-white' são cores customizadas */}
                    

                    <TabelaHistorico />
                    <div>
                        <button className="bg-blue-800 rounded-lg p-3 w-full mt-10 px-10 text-center poppins">Voltar</button>
                    </div>

                </div>
            </div >
        </>
    );
}   