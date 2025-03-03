import ConteudoPaginaUsuario from "../componentes/conteudoPaginas/paginaUsuario/conteudoUsuario";
import ListagemPaginaUsuario from "../componentes/conteudoPaginas/paginaUsuario/listagemUsuario";

export default function PaginaUsuario() {

    return (
        <div className="PaginaUsuarios">
            <ConteudoPaginaUsuario />
            <ListagemPaginaUsuario />
        </div>
    );
}  