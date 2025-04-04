import { JSX } from "react";
import useUserData from "../../componentes/hooks/userData";
import { useNavigate } from "react-router-dom";
import ConteudoSemLogin from "../../componentes/conteudoPaginas/checarLogin/conteudoSemLogin";




export default function ChecarLogin({ children }: { children: JSX.Element }): JSX.Element {
    console.log("entrou no sem login");
    
    const userData = useUserData()
    const navigate = useNavigate()
    if (localStorage.getItem("user") !== null) {
        return (children)
    }
  
    else {
        return (
            <ConteudoSemLogin />)
    }
   
}   