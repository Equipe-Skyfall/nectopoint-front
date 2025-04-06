import { JSX } from "react";
import useUserData from "../../componentes/hooks/userData";
import ConteudoSemLogin from "../../componentes/conteudoPaginas/checarLogin/conteudoSemLogin";




export default function ChecarLogin({ children,cargo }: { children: JSX.Element ,cargo : string }): JSX.Element {
    
    console.log("entrou no sem login");
    
    
    const userData = useUserData()
   
    if (localStorage.getItem("user") !== null) {
        //Se o usuario estiver logado, bloqueia o acesso a pagina que não tenha autorização
        if (userData) {
            const cargoUser = userData.dados_usuario.cargo;
            if (cargoUser !== undefined && cargoUser === cargo) {
                return (children)
            } 
            else if (cargo == ''||null||undefined) {
                return (children)
            }
            else {
                return <p className="text-black">Voce nao tem autorização</p>
            }
        }
        return (<></>)
    }
  
    else {
        

        return (
            <ConteudoSemLogin />)
    }
   
}   