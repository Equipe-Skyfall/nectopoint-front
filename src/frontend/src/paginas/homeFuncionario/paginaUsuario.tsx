import ConteudoHome from "../../componentes/conteudoPaginas/paginaUsuario/conteudoHome";

import useUserData from "../../componentes/hooks/userData";
import NavBar from "../../componentes/navbar/navbar";




export default function PaginaUsuario() {
    const userData : any = (useUserData());
    
    

    return (
        <div className="PaginaUsuarios">
            <NavBar/>
            <ConteudoHome />
        </div>
    );
}  