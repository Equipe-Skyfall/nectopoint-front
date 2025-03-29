import NavBarGestor from "../componentes/navbar/navbargestor";

import FuncionariosGestor from "../componentes/conteudoPaginas/colaboradores/funcionarios"

export default function Funcionarios() {

    return (
        <div className="overflow-y-hidden">
            <NavBarGestor />
            <FuncionariosGestor />
        </div>
    );
}  
