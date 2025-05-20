import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiRefreshCw, FiUpload, FiEdit } from 'react-icons/fi';
import FiltrosHistoricoFunc from '../filtros/filtroHistoricoFunc';
import ModalCorrecaoPonto from '../conteudoPaginas/solicitacoes/modalCorrecaoPonto';
import useHistoricoJornadas from '../hooks/useHistoricoJornadas';

export default function ConteudoHistoricoFunc() {
  const {
    historicoJornadas,
    carregando,
    erro,
    paginaAtual,
    totalPaginas,
    isExporting,
    exportError,
    modalAberto,
    jornadaSelecionada,
    statusTurno,
    startDate,
    endDate,
    obterItensPaginaAtual,
    setPaginaAtual,
    setStatusTurno,
    setStartDate,
    setEndDate,
    limparFiltros,
    exportarParaPDF,
    enviarCorrecao,
    setModalAberto,
    setJornadaSelecionada,
  } = useHistoricoJornadas();

  const PaginationControls = () => {
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
        className="mt-8 flex sm:flex-row items-center justify-center sm:gap-4 gap-2 w-full"
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
          className={`flex items-center text-sm sm:text-base px-4 py-2 rounded-lg ${paginaAtual === 0
              ? 'bg-gray-200 text-gray-500 border-gray-500 border cursor-not-allowed'
              : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
        >
          <FiChevronLeft className="mr-1" />
          Anterior
        </motion.button>

        <div className="flex items-center gap-2">
          {visiblePages.map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setPaginaAtual(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`sm:w-10 h-9 w-5 sm:h-10 rounded-full flex items-center justify-center text-sm ${paginaAtual === page
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
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
          className={`flex items-center text-sm sm:text-base px-4 py-2 rounded-lg ${paginaAtual === totalPaginas - 1
              ? 'bg-gray-200 text-gray-500 border-gray-500 border cursor-not-allowed'
              : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
        >
          Próxima
          <FiChevronRight className="ml-1" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-4 my-8 w-full poppins"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-3xl mt-10 font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
      >
        Histórico de Jornadas
      </motion.h2>
      <FiltrosHistoricoFunc
        statusTurno={statusTurno}
        setStatusTurno={setStatusTurno}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        limparFiltros={limparFiltros}
      />
      {modalAberto && jornadaSelecionada && (
        <ModalCorrecaoPonto
          pontos={jornadaSelecionada?.pontos || []}
          dataJornada={jornadaSelecionada?.data || ''}
          onClose={() => setModalAberto(false)}
          onSubmit={enviarCorrecao}
        />
      )}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportarParaPDF}
        disabled={isExporting || historicoJornadas.length === 0}
        className="flex items-center bg-gradient-to-r mb-3 -mt-3 from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        {isExporting ? <FiRefreshCw className="animate-spin mr-2" /> : <FiUpload />}
        {isExporting ? 'Exportando...' : 'Exportar PDF'}
      </motion.button>

      {exportError && (
        <div className="mt-2 text-red-600 text-sm">{exportError}</div>
      )}
      {erro ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded-lg shadow-md"
        >
          <p className="font-medium">{erro}</p>
        </motion.div>
      ) : carregando ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="flex justify-center p-12"
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </motion.div>
      ) : historicoJornadas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhuma jornada registrada
            </h3>
            <p className="text-gray-600">
              Seu histórico de jornadas aparecerá aqui quando disponível
            </p>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="sm:w-full w-[95vw] max-w-4xl rounded-xl overflow-hidden shadow-lg border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                    <th className="p-4 text-center font-medium">Data</th>
                    <th className="p-4 text-center font-medium">Início</th>
                    <th className="p-4 text-center font-medium">Fim</th>
                    <th className="p-4 text-center font-medium">Status</th>
                    <th className="p-4 text-center font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {obterItensPaginaAtual().map((jornada, index) => (
                      <motion.tr
                        key={`${jornada.data}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                      >
                        <td className="p-2 sm:p-4 text-sm font-medium text-gray-800">
                          {jornada.data}
                        </td>
                        <td className="p-2 sm:p-4 text-sm text-center text-gray-600">
                          {jornada.inicioTurno}
                        </td>
                        <td className="p-2 sm:p-4 text-sm text-center text-gray-600">
                          {jornada.fimTurno}
                        </td>
                        <td className="p-2 sm:p-4 text-center">{jornada.statusTurno}</td>
                        <td className="p-2 sm:p-4 text-center">
                          {(jornada.statusText === 'Irregular' || jornada.statusText === 'Encerrado') && (
                            <button
                              onClick={() => {
                                setJornadaSelecionada(jornada);
                                setModalAberto(true);
                              }}
                              className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1 mx-auto"
                            >
                              <FiEdit size={14} />
                              <span>Corrigir</span>
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {totalPaginas >= 1 && <PaginationControls />}
        </>
      )}
    </motion.div>
  );
}