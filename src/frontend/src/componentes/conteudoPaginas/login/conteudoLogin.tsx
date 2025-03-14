import { useEffect } from "react";
import { Link } from "react-router-dom";
import InputPadrao from "../../inputPadrao/inputPadrao";
export default function ConteudoLogin() {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    },[]);

    return (
        <>
        <div className="overflow-hidden">
            <div className="text-center flex justify-center my-8">
                <img src="/nectopoint.png" className="w-24 align-middle text-center  " alt="homeLogo"/>
                
            </div>
           
        </div >
        <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto top-1/4 left-0 w-full mx-auto absolute"> {/* 'bg-midnight' e 'text-white' são cores customizadas */}
                    <h1 className=" poppins-semibold w-full text-[25px] text-center text-blue-800">Login</h1>

                    <InputPadrao placeholder="CPF" length={11} pattern="[0-9]" id="cpf"></InputPadrao>
                    <InputPadrao placeholder="Senha" length={20} pattern="[0-9]A-Za-z" id="senha"></InputPadrao>                         {/* para montar palhetas customizadas vá para tailwind.config.js > theme > extend > colors */}
                    <span className="text-center align-middle self-center items-center justify-center my-4">                    
                        <input type="checkbox" id="checkbox" className="m-2 rounded-full custom-checkbox"></input>
                        <label className="text-black text-center align-top my-auto">Lembrar-me</label>
                    </span>
                    <Link to='/home' className="">  {/*Coloquei isto apenas para acessar mais rapido o home*/ }
                    <button className=" w-24 p-3  my-4 rounded-full bg-blue-600 text-center poppins bg">
                         <span>Acessar</span>
                    </button>
                    </Link>
                    <Link to='/' className="text-black my-8">Esqueceu sua senha?</Link>

        </div>

        
        </>
    );
}   