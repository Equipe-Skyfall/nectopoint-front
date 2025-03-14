import React from "react";

export default function Data(): JSX.Element {
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
                <h2 className='text-blue-600  font-semibold'>Olá, Gestor!</h2>
                <p className="text-gray-600">{formatarData()}</p>
            </div>
        </div>
        </>
    );
}