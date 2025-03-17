import React, { useEffect, useState } from 'react';

// Definindo o tipo para o histórico
type HistoricoType = {
    id: number;
    data: string;
    name: string;
    pontos: {
        entrada: string;
        saida: string;
    };
    carga_horaria: number;
    saldo_horas: number;
};

// Definindo o tipo para os dados do usuário
type UserDataType = {
    id: number;
    data: string;
    name: string;
    pontos: {
        entrada: string;
        saida: string;
    };
};

export default function ConteudoHistorico() {
    const [userData, setUserData] = useState<UserDataType | null>(null);
    const [historico, setHistorico] = useState<HistoricoType[]>([]);

    useEffect(() => {
        // Simulação de dados do usuário
        const dados: UserDataType = {
            id: 1,
            data: "2022-10-10",
            name: "José Carlos Almeida Santos",
            pontos: {
                entrada: "11:30",
                saida: "17:30",
            },
        };
        setUserData(dados);

        // Simulação de histórico de movimentação
        const dadosHistorico: HistoricoType[] = [
            {
                id: 1,
                data: "2022-10-10",
                name: "José Carlos Almeida Santos",
                pontos: {
                    entrada: "11:30",
                    saida: "17:30",
                },
                carga_horaria: 8,
                saldo_horas: 2,
            },
            {
                id: 2,
                data: "2022-10-11",
                name: "José Carlos Almeida Santos",
                pontos: {
                    entrada: "08:00",
                    saida: "16:00",
                },
                carga_horaria: 8,
                saldo_horas: 0,
            },
            {
                id: 3,
                data: "2022-10-12",
                name: "José Carlos Almeida Santos",
                pontos: {
                    entrada: "09:00",
                    saida: "18:00",
                },
                carga_horaria: 8,
                saldo_horas: 1,
            },
            {
                id: 4,
                data: "2022-10-13",
                name: "José Carlos Almeida Santos",
                pontos: {
                    entrada: "10:00",
                    saida: "19:00",
                },
                carga_horaria: 8,
                saldo_horas: 1,
            },
            {
                id: 5,
                data: "2022-10-14",
                name: "José Carlos Almeida Santos",
                pontos: {
                    entrada: "08:30",
                    saida: "17:30",
                },
                carga_horaria: 8,
                saldo_horas: 0,
            },
            {
                id: 6,
                data: "2022-10-15",
                name: "José Carlos Almeida Santos",
                pontos: {
                    entrada: "07:00",
                    saida: "15:00",
                },
                carga_horaria: 8,
                saldo_horas: 0,
            },
        ];
        setHistorico(dadosHistorico);
    }, []);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 6;
    const totalPaginas = Math.ceil(historico.length / itensPorPagina);

    const dadosPaginaAtual = historico.slice(
        paginaAtual * itensPorPagina,
        (paginaAtual + 1) * itensPorPagina
    );

    const handleProximaPagina = () => {
        if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    const handlePaginaAnterior = () => {
        if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 w-full">
            {userData && (
          
                <>
                    <h1 className="text-2xl poppins-semibold text-blue-600">
                        Olá, {userData.name}
                    </h1>
                    <h2 className={paginaAtual > 5?"text-red-200":"text-blue-700"}>{65}</h2>
                    <p className="text-xl poppins mb-6 text-black">Histórico de Movimentação</p>
                </>
            )}

            {/* Contêiner da tabela */}
            <div className="w-full max-w-3xl overflow-x-hidden">
                <table className="w-full border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="p-2 md:p-3 poppins text-sm md:text-lg">Data</th>
                            <th className="p-2 md:p-3 poppins text-sm md:text-lg">Entrada</th>
                            <th className="p-2 md:p-3 poppins text-sm md:text-lg">Saída</th>
                            <th className="p-2 md:p-3 poppins text-sm md:text-lg">Carga Horária</th>
                            <th className="p-2 md:p-3 poppins text-sm md:text-lg">Saldo de Horas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosPaginaAtual.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-2 md:p-3 poppins text-sm md:text-base text-black">{item.data}</td>
                                <td className="p-2 md:p-3 poppins text-sm md:text-base text-black">{item.pontos.entrada}</td>
                                <td className="p-2 md:p-3 poppins text-sm md:text-base text-black">{item.pontos.saida}</td>
                                <td className="p-2 md:p-3 poppins text-sm md:text-base text-black">{item.carga_horaria}h</td>
                                <td className="p-2 md:p-3 poppins text-sm md:text-base text-black">{item.saldo_horas}h</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Botões de navegação e exibição da página atual */}
            <div className="mt-8 flex items-center gap-4">
                <button
                    onClick={handlePaginaAnterior}
                    disabled={paginaAtual === 0}
                    className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${paginaAtual === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Anterior
                </button>

                <span className="text-sm md:text-lg poppins text-gray-700">
                    Página {paginaAtual + 1} de {totalPaginas}
                </span>

                <button
                    onClick={handleProximaPagina}
                    disabled={paginaAtual === totalPaginas - 1}
                    className={`px-4 py-2 rounded-lg transition poppins text-sm md:text-base ${paginaAtual === totalPaginas - 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}