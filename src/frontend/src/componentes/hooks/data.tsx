import React, { JSX, useEffect } from "react";
import { useAuthContext } from "../../Provider/AuthProvider";

import useUserData from "./userData";
export default function Data(): JSX.Element {
    const response = useUserData();
    const { user, isAuthenticated } = useAuthContext();
    useEffect(() => {
            if (isAuthenticated) {
                const fetchUsers = async () => {
                    try {
    
                       
    
                        console.log('fetched users:');
                    } catch (error:any) {
                        console.error('Error fetching users:', error);
    
                        if (error.response) {
                            console.error('Response data:', error.response.data);
                            console.error('Response status:', error.response.status);
                        }
                    }
                };
    
                fetchUsers();
            }
        }, [isAuthenticated]);
    
    const formatarData = () => {
        const meses: string[] = [
             'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]
        const hoje: Date = new Date();
        const dia: number = hoje.getDate();
        const mes: string = meses[hoje.getMonth()];
        const ano: number = hoje.getFullYear();

        return `${dia} de ${mes} de ${ano}`;
    }
    //Setar para pegar a variavel do nome do gestor
    return (
        <>
        <div className="overflow-hidden font-['Poppins']">
            <div className="text-center justify-center my-8">

                <h1 className='text-blue-600 text-xl  font-semibold'>Olá, {user?.nome}</h1>

                <p className="text-gray-600">{formatarData()}</p>
            </div>
        </div>
        </>
    );
}