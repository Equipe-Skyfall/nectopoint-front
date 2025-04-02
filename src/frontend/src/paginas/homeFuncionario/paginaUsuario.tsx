import ConteudoHome from "../../componentes/conteudoPaginas/paginaUsuario/conteudoHome";

import useUserData from "../../componentes/hooks/userData";
import NavBar from "../../componentes/navbar/navbar";
import NavBarGestor from "../../componentes/navbar/navbargestor";



export default function PaginaUsuario() {
    const userData : any = (useUserData());
    
    

    return (
        <div className="PaginaUsuarios">
            {userData.dados_usuario.cargo == "GERENTE"? <NavBarGestor /> :<NavBar/>}
            
            <ConteudoHome />
        </div>
    );
}  