import React, { JSX } from "react"
import { Navigate, useNavigate } from "react-router-dom"
export default function ConteudoChecarLogin():JSX.Element {
    const navigate = useNavigate()
        return (
            <>
            <div className="flex flex-col justify-center items-center h-screen w-full px-20 bg-white">
            <p className="text-blue-900 poppins text-[80px] text-start w-full  ">Ops...</p>

            <p className="text-blue-900 poppins text-[30px] text-start w-full">Voce nao tem autorização para acessar esta página !</p>
           <span className="border-l-blue-900 border-l-4 pl-1 w-full m-2">
           <p className="easy-in-out hover:easy-in-out cursor-pointer hover:scale-[105%] hover:translate-x-10 hover:transition m-2 hover:delay-100 hover:duration-300 border-solid   text-blue-900 poppins text-[30px] text-start w-full" onClick={() => {
                navigate("/")
            }}> Fazer login</p>
           </span>
            </div>
            
            
            </>
            
             
       )
    }
    
