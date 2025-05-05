import { JSX } from "react";
import useUserData from "../../componentes/hooks/userData";
import ConteudoSemLogin from "../../componentes/conteudoPaginas/checarLogin/conteudoSemLogin";
import { useNavigate } from "react-router-dom";





export default function ChecarLogin({ children,cargo }: { children: JSX.Element ,cargo : string }): JSX.Element {
    const navigate = useNavigate()
    
    
    
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
                return (
                    <>
                    <div className="flex flex-col justify-center items-center h-screen w-full px-20 bg-white">
                    <p className="text-blue-900 poppins text-[80px] text-start w-full  ">Ops...</p>
   
                    <p className="text-blue-900 poppins text-[30px] text-start w-full">Voce nao tem autorização para acessar esta página !</p>
                   <span className="border-l-blue-900 border-l-4 pl-1 w-full m-2">
                   {
                        cargoUser =="GERENTE" ? <p className=" easy-in-out hover:easy-in-out cursor-pointer hover:scale-[105%] hover:translate-x-10 hover:transition m-2 hover:delay-100 hover:duration-300 border-solid   text-blue-900 poppins text-[30px] text-start w-full" onClick={()=> navigate('/gestor-page')}>Voltar para home</p> : <p onClick={()=> navigate('/bater-ponto')}>Voltar para home</p>
                    }
                   </span>
                    </div>
                    
                    
                    </>
                )
            }
        }
        return (<></>)
    }
  
    else {
        

        return (
            <ConteudoSemLogin />)
    }
   
}   