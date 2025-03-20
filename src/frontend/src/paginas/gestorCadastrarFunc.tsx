import NavBarGestor from "../componentes/navbar/navbargestor";

import CadastrarFunc from "../componentes/conteudoPaginas/paginaGestor/cadastrarFunc"

export default function CadastrarFuncionario() {

    return (
        <div className="overflow-y-hidden">
            <NavBarGestor />
            <CadastrarFunc />
        </div>
    );
}  
