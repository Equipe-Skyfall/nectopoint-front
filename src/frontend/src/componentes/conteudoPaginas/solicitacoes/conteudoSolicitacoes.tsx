// componentes/conteudoPaginas/solicitacoes/conteudoSolicitacoes.tsx
import React, { useState } from 'react';
import { FaPaperclip, FaBell } from 'react-icons/fa';

const ConteudoSolicitacoes: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>('');

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
        setError(''); 
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        setError(''); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!selectedOption) {
            setError('Por favor, selecione uma opção.');
            return;
        }
        if (!description.trim()) {
            setError('Por favor, escreva uma descrição.');
            return;
        }

        console.log('Opção selecionada:', selectedOption);
        console.log('Descrição:', description);
        console.log('Arquivo anexado:', file);
        alert('Solicitação enviada com sucesso!');

        setSelectedOption('');
        setDescription('');
        setFile(null);
        setError('');
    };

    return (
        <div className="flex flex-col md:flex-row pt-12"> 
            {/* Parte esquerda (apenas no desktop) */}
            <div className="hidden md:flex flex-col items-center justify-center w-1/3 p-8 -mt-8">
                <FaBell className="w-32 h-32 mb-12 text-[#1E398D]" /> 
                <h1 className="text-4xl font-bold mb-12 text-[#6CA144]">SOLICITAÇÕES</h1> 
                <p className="text-center text-2xl font-semibold text-black">
                    Selecione uma das opções ao lado e faça uma justificativa para mandar sua solicitação ao
                    gerente.
                </p>
            </div>

            {/* Parte direita (formulário) */}
            <div className="w-full md:w-2/3 p-4 flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-4 md:hidden">Solicitações</h1>

                    {/* Mensagem de erro */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Dropdown para seleção de opções */}
                    <div className="mb-6">
                        <select
                            value={selectedOption}
                            onChange={handleOptionChange}
                            className="w-full p-4 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="" disabled>
                                Selecione uma opção
                            </option>
                            <option value="Solicitar Férias">Solicitar Férias</option>
                            <option value="Solicitar Abono de Faltas">Solicitar Abono de Faltas</option>
                            <option value="Solicitar Atestado">Solicitar Atestado</option>
                            <option value="Solicitar Folga">Solicitar Folga</option>
                        </select>
                    </div>

                    {/* Caixa de texto */}
                    <div className="mb-6 relative">
                        <textarea
                            placeholder="Descreva o motivo da sua solicitação..."
                            value={description}
                            onChange={handleDescriptionChange}
                            className="w-full p-4 border border-gray-300 rounded-lg resize-none"
                            rows={8} 
                        />
                        {/* Anexar arquivo */}
                        <label className="absolute bottom-4 right-4 cursor-pointer">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden" 
                            />
                            <FaPaperclip className="text-gray-500 hover:text-[#1E398D] transition-colors" size={24} />
                        </label>
                    </div>

                    {/* Botão de enviar */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-[#1E398D] text-white p-4 rounded-lg hover:bg-[#162b6b] transition-colors"
                    >
                        Enviar Solicitação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConteudoSolicitacoes;