import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateRangePickerProps } from '../../../interfaces/interfaceFiltrosSub';
// Componente de data, é o filtro individual sem estar ligado em uma página, cuidado com estilizações nele, irá mudar em todas páginas aplicadas.
// Aqui a data pega o periodo de inicio e fim.
export default function DateRangePicker({
    startDate,
    endDate,
    setStartDate,
    setEndDate
}: DateRangePickerProps) {
    return (
        <>
            <div className="relative">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate instanceof Date ? endDate : new Date()}
                    placeholderText="Data inicial"
                    className="pl-12 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dateFormat="dd/MM/yyyy"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                </div>
            </div>

            <div className="relative">
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate instanceof Date ? startDate : undefined}
                    placeholderText="Data final"
                    className="pl-12 pr-10 py-2.5 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dateFormat="dd/MM/yyyy"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                </div>
            </div>
        </>
    );
}