import SearchBar from './subComponentes/searchBar';
import StatusSelect from './subComponentes/statusSelect';
import DateRangePicker from './subComponentes/datePicker';
import { FiltrosHistoricoProps } from '../../interfaces/interfaceFiltrosSub';



export default function FiltrosHistorico({
    searchQuery,
    setSearchQuery,
    statusTurno,
    setStatusTurno,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    limparFiltros
}: FiltrosHistoricoProps) {
    return (
        <>
            <div className="w-full max-w-4xl mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <StatusSelect value={statusTurno} onChange={setStatusTurno} />
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />
            </div>

            <button
                onClick={limparFiltros}
                className="mb-5 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
                Limpar Filtros
            </button>
        </>
    );
}