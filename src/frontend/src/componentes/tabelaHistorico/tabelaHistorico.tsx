import React, { useEffect } from 'react';
type UserDataType = {
    id: number;
    data: string;
    name: string;
    pontos: {
        entrada: string;
        saida: string;
    }
}
 export default function TabelaHistorico() {
    let { useState } = React;
    let [userData, setUserData] = useState<UserDataType>();
  
   useEffect(() => {
        // inicia setstate do usuario <Cookies ?>
        const dados:UserDataType = 
            {id: 1,
                data: "2022-10-10",
                name: "José carlos almeida santos",
                pontos: {
                    entrada: '11:30',
                    saida: '17:30'
                }}
            
        setUserData(dados);
        });
     // historico ficticío
        let data = [
            {id: 1,
                data: "2022-10-10",
                name: "José carlos almeida santos",
                pontos: {
                    entrada: '11:30',
                    saida: '17:30'
                },
                carga_horaria: 8,
                saldo_horas: 2}
            ]
     return (
         <>
         <h1 className="text-black text-blue-600 my-4">Olá , {userData?.name} !</h1>
         <div className="overflow-hidden px-2 w-full text-center flex flex-col mx-auto justify-center ">
             
                    <div className="flex text-[#1E398D] items-center poppins-bold text-center  p-2 mb-2 w-full grid grid-cols-4 gap-5">
                         <p>Data</p> 
                       <p className="">Saldo de Horas</p> 
                        <p>Entrada</p> 
                         <p>Saida</p> 
                    </div>
                    {data.map((item) => (
                        <div  className="flex text-[#1E398D] break-words text-center items-center p-2 mb-2 w-full grid grid-cols-4 gap-5">
                            <p>{item.data}</p>
                            <p className="">{item.saldo_horas}</p>
                            <p>{item.pontos.entrada}</p>
                            <p>{item.pontos.saida}</p>
                        </div>
                    ))}
               
             
         </div>
         </>
     );
 }  