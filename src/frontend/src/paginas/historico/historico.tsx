import NavBar from "../../componentes/navbar/navbar";

import ConteudoHistorico from "../../componentes/tabelaHistorico/tabelaHistorico";




export default function Historico() {

    return (
        <div className="Historico !overflow-hidden">
            <NavBar/>
            <ConteudoHistorico />
        </div>
    );
}   