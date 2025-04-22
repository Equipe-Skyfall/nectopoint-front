import { useState, useEffect } from "react";
import { FaBell, FaX } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import useSolicitacoes from '../hooks/useSolicitacoes';

interface NotificationProps {
    userCpf: string;
}

export function useNotifications({ userCpf }: NotificationProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
    const [notificationPage, setNotificationPage] = useState(0);
    const itemsPerPage = 5;

    // Hook for recent notifications (5 most recent)
    const {
        solicitacoes: recentNotifications,
        fetchSolicitacoes: fetchRecentNotifications,
        formatarDataBrasil,
        formatarStatus,
        formatarTipoTicket
    } = useSolicitacoes({
        page: 0,
        size: 5,
        sort: 'data_ticket,desc'
    });

    // Hook for all notifications (paginated)
    const {
        solicitacoes: allNotifications,
        fetchSolicitacoes: fetchAllNotifications,
    } = useSolicitacoes({
        page: notificationPage,
        size: itemsPerPage,
        sort: 'data_ticket,desc'
    });

    // Filter notifications by user CPF
    const filteredRecentNotifications = recentNotifications?.content?.filter(
        ticket => ticket.cpf_colaborador === userCpf
    ) || [];

    const filteredAllNotifications = allNotifications?.content?.filter(
        ticket => ticket.cpf_colaborador === userCpf
    ) || [];

    const loadNotifications = async () => {
        await fetchRecentNotifications();
    };

    const loadAllNotifications = async () => {
        await fetchAllNotifications();
    };

    useEffect(() => {
        if (showAllNotificationsModal) {
            loadAllNotifications();
        }
    }, [notificationPage, showAllNotificationsModal]);

    const markAsRead = (id: number) => {
        localStorage.setItem(`notif_${id}`, 'true');
    };

    const markAllAsRead = () => {
        filteredRecentNotifications.forEach(ticket => {
            localStorage.setItem(`notif_${ticket.id_ticket}`, 'true');
        });
        filteredAllNotifications.forEach(ticket => {
            localStorage.setItem(`notif_${ticket.id_ticket}`, 'true');
        });
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) loadNotifications();
    };

    const unreadCount = filteredRecentNotifications.filter(ticket =>
        !localStorage.getItem(`notif_${ticket.id_ticket}`) &&
        (ticket.status_ticket === 'APROVADO' || ticket.status_ticket === 'REPROVADO')
    ).length || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APROVADO':
                return 'bg-green-100 text-green-800';
            case 'REPROVADO':
                return 'bg-red-100 text-red-800';
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const NotificationIcon = () => (
        <div className="relative">
            <FaBell
                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={toggleNotifications}
            />
            {unreadCount > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-md"
                >
                    {unreadCount}
                </motion.span>
            )}
        </div>
    );

    const NotificationDropdown = () => (
        <AnimatePresence>
            {showNotifications && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute -right-24 sm:right-0 mt-2 w-[90vw] sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200"
                >
                    <div className="divide-y divide-gray-200">
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 flex justify-center text-center">
                            <h3 className="text-lg font-medium text-white">Minhas Notificações</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-white hover:text-gray-200"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        {filteredRecentNotifications.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                                <p className="text-gray-500">Nenhuma notificação recente</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {filteredRecentNotifications.map(ticket => (
                                    <motion.div
                                        key={ticket.id_ticket}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!localStorage.getItem(`notif_${ticket.id_ticket}`) ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => markAsRead(ticket.id_ticket)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900 text-start">
                                                    {formatarTipoTicket(ticket.tipo_ticket)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status_ticket)}`}>
                                                        {formatarStatus(ticket.status_ticket)}
                                                    </span>
                                                </div>
                                            </div>
                                            {!localStorage.getItem(`notif_${ticket.id_ticket}`) && (
                                                <span className="h-2 w-2 rounded-full bg-blue-500 mt-2"></span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-start">
                                            {formatarDataBrasil(ticket.data_ticket)}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="px-4 py-3 bg-gray-50 text-center">
                            <button
                                onClick={() => {
                                    setShowAllNotificationsModal(true);
                                    setShowNotifications(false);
                                }}
                                className="inline-flex items-center text-sm  font-medium text-blue-600 hover:text-blue-800"
                            >
                                Ver todas as notificações
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const AllNotificationsModal = () => (
        <AnimatePresence>
            {showAllNotificationsModal && (
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
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-xl">
                            <h2 className="sm:text-2xl mt-1 sm:mt-0 font-bold text-white">Todas as Minhas Notificações</h2>
                            <button
                                onClick={() => {
                                    markAllAsRead();
                                    setShowAllNotificationsModal(false);
                                }}
                                className="px-4 py-2 text-gray-50 hover:text-gray-300 transition-colors"
                            >
                                <FaX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredAllNotifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhuma notificação encontrada</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                <th className="p-3 text-sm sm:text-base text-center">Tipo</th>
                                                <th className="p-3 text-sm sm:text-base text-center">Status</th>
                                                <th className="p-3 text-sm sm:text-base text-center">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <AnimatePresence>
                                                {filteredAllNotifications.map((ticket, index) => (
                                                    <motion.tr
                                                        key={ticket.id_ticket}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        exit={{ opacity: 0 }}
                                                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                                        onClick={() => markAsRead(ticket.id_ticket)}
                                                    >
                                                        <td className="p-3 text-sm sm:text-base text-gray-800 font-medium">
                                                            {formatarTipoTicket(ticket.tipo_ticket)}
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status_ticket)}`}>
                                                                {formatarStatus(ticket.status_ticket)}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-sm sm:text-base text-center text-gray-600">
                                                            {formatarDataBrasil(ticket.data_ticket)}
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {allNotifications?.totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 p-6 flex items-center justify-between"
                            >
                                <motion.button
                                    whileHover={{ scale: notificationPage === 0 ? 1 : 1.05 }}
                                    whileTap={{ scale: notificationPage === 0 ? 1 : 0.95 }}
                                    onClick={() => setNotificationPage(p => Math.max(p - 1, 0))}
                                    disabled={notificationPage === 0}
                                    className={`flex items-center px-3 sm:px-6 py-3 rounded-xl transition-all ${notificationPage === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                        }`}
                                >
                                    <FiChevronLeft className="mr-2" />
                                    Anterior
                                </motion.button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, allNotifications.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (allNotifications.totalPages <= 5) {
                                            pageNum = i;
                                        } else if (notificationPage <= 2) {
                                            pageNum = i;
                                        } else if (notificationPage >= allNotifications.totalPages - 3) {
                                            pageNum = allNotifications.totalPages - 5 + i;
                                        } else {
                                            pageNum = notificationPage - 2 + i;
                                        }

                                        return (
                                            <motion.button
                                                key={pageNum}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setNotificationPage(pageNum)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center ${notificationPage === pageNum
                                                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {pageNum + 1}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <motion.button
                                    whileHover={{ scale: notificationPage === allNotifications.totalPages - 1 ? 1 : 1.05 }}
                                    whileTap={{ scale: notificationPage === allNotifications.totalPages - 1 ? 1 : 0.95 }}
                                    onClick={() => setNotificationPage(p => Math.min(p + 1, allNotifications.totalPages - 1))}
                                    disabled={notificationPage === allNotifications.totalPages - 1}
                                    className={`flex items-center px-3 sm:px-6 py-3 rounded-xl transition-all ${notificationPage === allNotifications.totalPages - 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                        }`}
                                >
                                    Próxima
                                    <FiChevronRight className="ml-2" />
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return {
        NotificationIcon,
        NotificationDropdown,
        AllNotificationsModal,
        toggleNotifications,
        showNotifications,
        setShowNotifications
    };
}