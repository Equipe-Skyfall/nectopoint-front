import { FiltrosColaboradorProps } from '../../interfaces/interfaceFiltrosSub';
import SearchBar from './subComponentes/searchBar';
import TipoJornada from './subComponentes/tipoJornada';

export default function FiltrosColaborador({
    searchQuery,
    setSearchQuery,
    jornadaSelecionada,
    setJornadaSelecionada,
    limparFiltros
}: FiltrosColaboradorProps) {
    return (
        <>
            <div className="w-full  mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className='sm:flex sm:-mr-[25vw] gap-5 '>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <div className='mt-2 sm:mt-0'>
                    <TipoJornada jornadaSelecionada={jornadaSelecionada} onChange={setJornadaSelecionada} />
                    </div>
                </div>
            </div>
            <button
                onClick={limparFiltros}
                className=" px-4 sm:absolute right-56 top-8 py-2.5 bg-gray-200  rounded-md hover:bg-gray-300  text-black transition"
            >
                Limpar Filtros
            </button>
        </>
    );
}