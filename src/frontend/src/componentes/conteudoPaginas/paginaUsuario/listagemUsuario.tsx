import BuscarDados from "../../hooks/hooksChamarBackend/getData";

export default function ListagemPaginaUsuario() {
    // chamando hook com dados da internet
    const { dados, isLoading, isError } = BuscarDados()

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    if (isError) {
        return <p>Erro ao carregar os dados.</p>;
    }

    return (
        <>
        <div className="overflow-hidden">
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
        </>
    );
}  