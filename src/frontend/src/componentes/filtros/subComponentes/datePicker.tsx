import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { DateRangePickerProps } from '../../../interfaces/interfaceFiltrosSub';

export default function DateRangePicker({
    startDate,
    endDate,
    setStartDate,
    setEndDate
}: DateRangePickerProps) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 col-span-2"
        >
            <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative"
            >
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate instanceof Date ? endDate : new Date()}
                    placeholderText="Data inicial"
                    className="pl-16 sm:pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    dateFormat="dd/MM/yyyy"
                    onKeyDown={(e) => e.preventDefault()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ scale: 1.01 }}
                className="relative"
            >
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate instanceof Date ? startDate : undefined}
                    placeholderText="Data final"
                    className="pl-16 sm:pl-10 pr-10 py-2.5 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    dateFormat="dd/MM/yyyy"
                    onKeyDown={(e) => e.preventDefault()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                </div>
            </motion.div>
        </motion.div>
    );
}
