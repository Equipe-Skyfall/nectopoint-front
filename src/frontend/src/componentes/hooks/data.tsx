import React, { JSX, useEffect } from "react";
import { useAuthContext } from "../../Provider/AuthProvider";
import api from "./axios";
export default function Data(): JSX.Element {
    const { user, isAuthenticated } = useAuthContext();
    useEffect(() => {
            if (isAuthenticated) {
                const fetchUsers = async () => {
                    try {
    
                        const response = await api.get('/sessao/usuario/me');
    
                        console.log('Users data:', response.data);
                    } catch (error) {
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
                <h2 className='text-blue-600  font-semibold'>Olá, {user?.nome}</h2>
                <p className="text-gray-600">{formatarData()}</p>
            </div>
        </div>
        </>
    );
}