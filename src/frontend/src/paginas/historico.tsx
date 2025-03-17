import ConteudoHistorico from "../componentes/conteudoPaginas/paginaUsuario/conteudoHistorico";

import NavBar from "../componentes/navbar/navbar";

export default function PaginaUsuario() {

    return (
        <div className="PaginaUsuarios">
            <NavBar />
            <ConteudoHistorico />
        </div>
    );
}  