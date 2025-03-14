
import DashboardGestor from "../componentes/conteudoPaginas/paginaGestor/DashboardGestor";

import NavBarGestor from "../componentes/navbar/navbargestor";


export default function PaginaUsuario() {

    return (
        <div className="overflow-y-hidden">
            <NavBarGestor />
            <DashboardGestor/>
        </div>
    );
}  