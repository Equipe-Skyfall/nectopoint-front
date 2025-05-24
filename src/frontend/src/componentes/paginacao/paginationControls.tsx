import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function PaginationControls({
  totalPaginas,
  paginaAtual,
  setPaginaAtual
}: {
  totalPaginas: number;
  paginaAtual: number;
  setPaginaAtual: (page: number) => void;
}) {
  const maxVisibleButtons = 5;

  const getVisiblePages = () => {
    let startPage = Math.max(0, paginaAtual - Math.floor(maxVisibleButtons / 2));
    let endPage = startPage + maxVisibleButtons - 1;

    if (endPage >= totalPaginas - 1) {
      endPage = totalPaginas - 1;
      startPage = Math.max(0, endPage - maxVisibleButtons + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8 flex justify-center items-center gap-7 sm:gap-6"
    >
      <motion.button
        whileHover={{ scale: paginaAtual === 0 ? 1 : 1.05 }}
        whileTap={{ scale: paginaAtual === 0 ? 1 : 0.95 }}
        onClick={() => {
          if (paginaAtual > 0) {
            setPaginaAtual(paginaAtual - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        disabled={paginaAtual === 0}
        className={`flex items-center text-sm sm:text-base px-2 sm:px-6 py-3 rounded-xl transition-all ${
          paginaAtual === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        <FiChevronLeft className="mr-2" />
        Anterior
      </motion.button>

      <div className="flex items-center gap-2">
        {visiblePages.map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setPaginaAtual(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`sm:w-10 w-5 h-10 sm:h-10 rounded-full flex items-center justify-center ${
              paginaAtual === page
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {page + 1}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: paginaAtual === totalPaginas - 1 ? 1 : 1.05 }}
        whileTap={{ scale: paginaAtual === totalPaginas - 1 ? 1 : 0.95 }}
        onClick={() => {
          if (paginaAtual < totalPaginas - 1) {
            setPaginaAtual(paginaAtual + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        disabled={paginaAtual === totalPaginas - 1}
        className={`flex items-center px-2 text-sm sm:text-base sm:px-6 py-3 rounded-xl transition-all ${
          paginaAtual === totalPaginas - 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        Próxima
        <FiChevronRight className="ml-2" />
      </motion.button>
    </motion.div>
  );
}