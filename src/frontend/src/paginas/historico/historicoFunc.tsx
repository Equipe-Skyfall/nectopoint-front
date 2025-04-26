import NavBar from "../../componentes/navbar/navbar";

import ConteudoHistoricoFunc from "../../componentes/tabelaHistorico/tabelaHistoricoFunc";




export default function HistoricoFunc() {

    return (
        <div className="Historico">
            <NavBar/>
            <ConteudoHistoricoFunc/>
        </div>
    );
}   