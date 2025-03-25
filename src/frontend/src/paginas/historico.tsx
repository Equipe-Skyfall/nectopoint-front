import NavBarGestor from "../componentes/navbar/navbargestor";
import ConteudoHistorico from "../componentes/tabelaHistorico/tabelaHistorico";




export default function Historico() {

    return (
        <div className="Historico">
            <NavBarGestor/>
            <ConteudoHistorico />
        </div>
    );
}   