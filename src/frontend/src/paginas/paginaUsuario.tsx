import ConteudoHome from "../componentes/conteudoPaginas/paginaUsuario/conteudoHome";

import useUserData from "../componentes/hooks/userData";
import NavBar from "../componentes/navbar/navbar";
import NavBarGestor from "../componentes/navbar/navbargestor";



export default function PaginaUsuario() {
    const userData : any = (useUserData());
    console.log(userData);
    

    return (
        <div className="PaginaUsuarios">
            {userData.cargo == "GERENTE"? <NavBarGestor /> :<NavBar/>}
            
            <ConteudoHome />
        </div>
    );
}  