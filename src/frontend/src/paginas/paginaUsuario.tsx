import ConteudoPaginaUsuario from "../componentes/conteudoPaginas/paginaUsuario/conteudoUsuario";
import ListagemPaginaUsuario from "../componentes/conteudoPaginas/paginaUsuario/listagemUsuario";
import NavBar from "../componentes/navbar/navbar";

export default function PaginaUsuario() {

    return (
        <div className="PaginaUsuarios">
            <NavBar />
            <ConteudoPaginaUsuario />
            <ListagemPaginaUsuario />
        </div>
    );
}  