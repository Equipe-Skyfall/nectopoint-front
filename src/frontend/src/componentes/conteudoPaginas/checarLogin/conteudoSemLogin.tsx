import React, { JSX } from "react"
import { Navigate, useNavigate } from "react-router-dom"
export default function ConteudoChecarLogin():JSX.Element {
    const navigate = useNavigate()
        return (
        <div>

            <p>Você não tem acesso !</p>
            <p>Faça login para continuar</p>
            <button onClick={() => {
                navigate("/")
            }}> Fazer login</button>
        </div>)
    }
    
