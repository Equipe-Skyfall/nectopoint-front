// HolidayForm.js
import React from "react";
import { FiPlus, FiChevronRight, FiChevronLeft, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useHolidayHook from "../../hooks/useHoliday";

export default function HolidayForm() {
  const {
    form,
    showModal,
    holidays,
    page,
    totalPages,
    loading,
    handleChange,
    handleSubmit,
    handleDelete,
    handlePageChange,
    formatShortDate,
    toggleModal
  } = useHolidayHook();

  // Componente de card de feriado
  const HolidayCard = ({ holiday, onDelete }) => {
    const isSingleDay = holiday.startDate === holiday.endDate;
    const dateText = isSingleDay
      ? formatShortDate(holiday.startDate)
      : `${formatShortDate(holiday.startDate)} - ${formatShortDate(holiday.endDate)}`;

    const handleDeleteClick = async (e) => {
      e.stopPropagation();
      if (window.confirm(`Tem certeza que deseja deletar o feriado "${holiday.name}"?`)) {
        try {
          await onDelete(holiday.id);
          toast.success("Feriado deletado com sucesso!");
        } catch (error) {
          toast.error("Erro ao deletar feriado");
        }
      }
    };

    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col"
      >
        {/* Cabeçalho do card com nome e data */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white text-center relative">
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 bg-red-100 text-red-500 rounded p-1 hover:bg-red-500 hover:text-red-800 transition-colors"
            title="Deletar feriado"
          >
            <FiTrash2 size={16} />
          </button>
          <h3 className="font-bold text-lg truncate">{holiday.name}</h3>
          <p className="mt-2 text-sm text-blue-600 bg-white rounded-md border border-blue-100 px-3 py-1 shadow-sm opacity-90 w-fit mx-auto">
            {dateText}
          </p>
        </div>

        {/* Corpo do card com informações */}
        <div className="p-4 flex flex-col items-center justify-between flex-grow">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {holiday.description || "Sem descrição"}
            </p>

            <div className="flex justify-center items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs ${holiday.repeatsYearly
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
                }`}>
                {holiday.repeatsYearly ? "Anual" : "Não repete"}
              </span>

              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {holiday.userIds.length > 0
                  ? `${holiday.userIds.length} usuário(s)`
                  : "Todos"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const PaginationControls = () => {
    const maxVisibleButtons = 5;

    const getVisiblePages = () => {
      let startPage = Math.max(0, page - Math.floor(maxVisibleButtons / 2));
      let endPage = startPage + maxVisibleButtons - 1;

      if (endPage >= totalPages - 1) {
        endPage = totalPages - 1;
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
          whileHover={{ scale: page === 0 ? 1 : 1.05 }}
          whileTap={{ scale: page === 0 ? 1 : 0.95 }}
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className={`flex items-center text-sm sm:text-base px-2 sm:px-6 py-3 rounded-xl transition-all ${page === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
        >
          <FiChevronLeft className="mr-2" />
          Anterior
        </motion.button>

        <div className="flex items-center gap-2">
          {visiblePages.map((pageNum) => (
            <motion.button
              key={pageNum}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePageChange(pageNum)}
              className={`sm:w-10 w-5 h-10 sm:h-10 rounded-full flex items-center justify-center ${page === pageNum
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {pageNum + 1}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: page === totalPages - 1 ? 1 : 1.05 }}
          whileTap={{ scale: page === totalPages - 1 ? 1 : 0.95 }}
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          className={`flex items-center px-2 text-sm sm:text-base sm:px-6 py-3 rounded-xl transition-all ${page === totalPages - 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
        >
          Próxima
          <FiChevronRight className="ml-2" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-6 poppins"
    >
      <div className="mt-[5%] max-w-7xl mx-auto">
        {/* Título com gradiente */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center"
        >
          Calendário de Folgas
        </motion.h2>

        {/* Botão de cadastro com animação */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleModal}
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <FiPlus className="mr-2" />
            Nova Folga
          </motion.button>
        </div>

        {/* Estados de carregamento */}
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="flex justify-center p-12"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </motion.div>
        ) : holidays.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nenhuma folga cadastrada
              </h3>
              <p className="text-gray-600 mb-4">
                Cadastre sua primeira folga para começar
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Grid de feriados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {holidays.map((holiday, index) => (
                  <motion.div
                    key={holiday.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    exit={{ opacity: 0 }}
                  >
                    <HolidayCard
                      holiday={holiday}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Paginação */}
            {totalPages > 1 && <PaginationControls />}
          </>
        )}
      </div>

      {/* Modal de cadastro */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6 relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>

                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                  Cadastrar Folga
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IDs dos Usuários (separados por vírgula)
                    </label>
                    <input
                      type="text"
                      name="userIds"
                      value={form.userIds}
                      onChange={handleChange}
                      placeholder="ex: 123, 456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="repeatsYearly"
                      checked={form.repeatsYearly}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Repete anualmente</label>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Cadastrar Folga
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}