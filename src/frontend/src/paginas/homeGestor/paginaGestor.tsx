
import DashboardGestor from "../../componentes/conteudoPaginas/paginaGestor/homeGestor";
import NavBar from "../../componentes/navbar/navbar";





export default function PaginaGestor() {

    return (
        <div className="overflow-y-hidden">
            <NavBar/>
            <DashboardGestor/>
        </div>
    );
}  