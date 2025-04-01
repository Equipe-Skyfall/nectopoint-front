
import DashboardGestor from "../../componentes/conteudoPaginas/paginaGestor/homeGestor";


import NavBarGestor from "../../componentes/navbar/navbargestor";


export default function PaginaGestor() {

    return (
        <div className="overflow-y-hidden">
            <NavBarGestor /> 
            <DashboardGestor/>
        </div>
    );
}  