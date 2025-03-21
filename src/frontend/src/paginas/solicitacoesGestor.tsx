import SolicitacoesGestor from "../componentes/conteudoPaginas/paginaGestor/solicitacoesGestor";
import NavBarGestor from "../componentes/navbar/navbargestor";


export default function SoliGestor() {

    return (
        <div className="SoliGestor">
            <NavBarGestor />
            <SolicitacoesGestor/>
        </div>
    );
}  