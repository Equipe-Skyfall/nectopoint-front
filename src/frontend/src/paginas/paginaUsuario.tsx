import { useState } from "react";
import BuscarDados from "../components/hooks/hooksChamarBackend/getData";
import Modal from "../components/modais/modalPadrao";

export default function PaginaUsuario() {
    // chamando hook com dados da internet
    const { dados, isLoading, isError } = BuscarDados()

    //iniciando variáveis para utilizar o modal
    const [modalAberto, setModalAberto] = useState(false);

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (isError) {
        return <p>Erro ao carregar os dados.</p>;
    }

    return (
        <>
        <div className="overflow-hidden">
            <div className="flex">
                Conteúdo da primeira página
            </div>
            {/* Botão de abrir Modal */}
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setModalAberto(!modalAberto)}
            >
                Abrir Modal
            </button>
            <div>
                {dados.map((item) => (
                    <div key={item.id} className="border p-2 mb-2">
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Name:</strong> {item.name}</p>
                        <p><strong>Color:</strong> {item.data?.color}</p>
                        <p><strong>Capacity:</strong> {item.data?.capacity}</p>
                    </div>
                ))}
            </div>
        </div>
        <Modal isOpen={modalAberto} onClose={() => setModalAberto(!modalAberto)}>
                <h2 className="text-lg font-bold">Conteúdo do Modal</h2>
                <p>Este é um modal simples.</p>
        </Modal>
        </>
    );
}  