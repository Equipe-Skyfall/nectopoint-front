import React, { JSX, useEffect, useState } from "react";
import { useAuthContext } from "../../Provider/AuthProvider";

export default function Data(): JSX.Element {
    const [userName, setUserName] = useState<string>('');
    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (isAuthenticated) {
            // Busca os dados do localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Extrai apenas o nome de dados_usuario
                    if (parsedUser.dados_usuario?.nome) {
                        setUserName(parsedUser.dados_usuario.nome);
                    }
                } catch (error) {
                    console.error('Erro ao parsear dados do usuário:', error);
                }
            }
        }
    }, [isAuthenticated]);

    const formatarData = () => {
        const meses: string[] = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        const hoje: Date = new Date();
        const dia: number = hoje.getDate();
        const mes: string = meses[hoje.getMonth()];
        const ano: number = hoje.getFullYear();

        return `${dia} de ${mes} de ${ano}`;
    };

    return (
        <>
            <div className="overflow-hidden font-['Poppins']">      
                <div className="text-center justify-center my-8">
                    <h1 className='text-blue-600 text-xl font-semibold'>Olá, {userName}</h1>
                    <p className="text-gray-600">{formatarData()}</p>
                </div>
            </div>
        </>
    );
}