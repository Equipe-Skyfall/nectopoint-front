import { useState, useEffect, useCallback } from "react";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import useSolicitacoes from '../../hooks/useSolicitacoes';
import { FaX } from "react-icons/fa6";
import { TicketType } from "../../hooks/useTicketTypes";

interface NotificationProps {
    userId: number;
}

interface Ticket {
    id_ticket: string;
    id_colaborador: number; 
    tipo_ticket: string;
    status_ticket: string;
    data_ticket: string;
}

export function useNotifications({ userId}: NotificationProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 1000;
    const [allNotifications, setAllNotifications] = useState<Ticket[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const baseConfig = {
        sort: 'data_ticket,desc',
        status: ['APROVADO', 'REPROVADO'] as const,
    }
    // Hook para notificações recentes
    const {
        solicitacoes: recentSolicitacoes,
        fetchSolicitacoes: fetchRecentNotifications,
        formatarDataBrasil,
        formatarStatus,
        formatarTipoTicket
    } = useSolicitacoes({
        ...baseConfig,
        page: 0,
        size: 5
    });

    // Hook para todas as notificações
    const {
        solicitacoes: paginatedSolicitacoes,
        fetchSolicitacoes: fetchAllNotifications,
    } = useSolicitacoes({
        ...baseConfig,
        page,
        size: itemsPerPage
    });

    const filterUserTickets = (tickets: any[]): Ticket[] => {
        if (!tickets || !userId) return [];
        
        // Obter o nome do usuário logado do localStorage ou de onde estiver armazenado
        const storedUser = localStorage.getItem('user');
        let userName = '';
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                userName = parsedUser.dados_usuario?.nome || '';
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    
        // Filtrar tickets onde o nome_colaborador corresponde ao nome do usuário logado
        const filtered = tickets.filter(ticket => {
            return ticket.nome_colaborador === userName && 
                  (ticket.status_ticket === 'APROVADO' || 
                   ticket.status_ticket === 'REPROVADO');
        });
        
        return filtered;
    };
    // Notificações recentes - já filtradas pelo backend
    const recentNotifications = filterUserTickets(recentSolicitacoes?.content || []);

    const loadNotifications = async () => {
        await fetchRecentNotifications();
    };

    const loadMoreNotifications = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            await fetchAllNotifications();
            
            if (paginatedSolicitacoes?.content) {
                const filtered = filterUserTickets(paginatedSolicitacoes.content);
                // Evita duplicatas
                const newItems = filtered.filter(newItem => 
                    !allNotifications.some(item => item.id_ticket === newItem.id_ticket)
                );
                
                setAllNotifications(prev => [...prev, ...newItems]);
                setHasMore(paginatedSolicitacoes.content.length === itemsPerPage);
                setPage(prev => prev + 1);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showAllNotificationsModal) {
            // Resetar ao abrir o modal
            setAllNotifications([]);
            setPage(0);
            setHasMore(true);
            loadMoreNotifications();
        }
    }, [showAllNotificationsModal]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.1 && !loading && hasMore) {
            loadMoreNotifications();
        }
    };

    const markAsRead = (id: string) => {
        localStorage.setItem(`notif_${id}`, 'true');
    };

    const markAllAsRead = () => {
        recentNotifications.forEach((ticket: any) => {
            localStorage.setItem(`notif_${ticket.id_ticket}`, 'true');
        });
        allNotifications.forEach((ticket: any) => {
            localStorage.setItem(`notif_${ticket.id_ticket}`, 'true');
        });
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) loadNotifications();
    };

    const unreadCount = recentNotifications.filter((ticket: any) =>
        !localStorage.getItem(`notif_${ticket.id_ticket}`)
    ).length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APROVADO':
                return 'bg-green-100 text-green-800';
            case 'REPROVADO':
                return 'bg-red-100 text-red-800';
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
                    animate={{ opacity: 1, y: 0 }}
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

                        {recentNotifications.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                                <p className="text-gray-500">Nenhuma notificação recente</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {recentNotifications.map(ticket => (
                                    <motion.div
                                        key={ticket.id_ticket}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!localStorage.getItem(`notif_${ticket.id_ticket}`) ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => markAsRead(ticket.id_ticket)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900 text-start">
                                                    {formatarTipoTicket(ticket.tipo_ticket as TicketType)}
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
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-xl">
                            <h2 className="sm:text-2xl mt-1 sm:mt-0 font-bold text-white">Todas as Minhas Notificações</h2>
                            <button
                                onClick={() => {
                                    markAllAsRead();
                                    setShowAllNotificationsModal(false);
                                    setAllNotifications([]);
                                    setPage(0); 
                                    setHasMore(true); 
                                }}
                                className="px-4 py-2 text-gray-50 hover:text-gray-300 transition-colors"
                            >
                                <FaX className="w-4 h-4" />
                            </button>
                        </div>

                        <div 
                            className="flex-1 overflow-y-auto"
                            onScroll={handleScroll}
                        >
                            {allNotifications.length === 0 && !loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhuma notificação encontrada</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {allNotifications.map((ticket) => (
                                        <motion.div
                                            key={`${ticket.id_ticket}`}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                            onClick={() => markAsRead(ticket.id_ticket)}
                                        >
                                            <div className="flex justify-between sm:ml-[42%] ml-[37%]" >
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {formatarTipoTicket(ticket.tipo_ticket as TicketType)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status_ticket)}`}>
                                                            {formatarStatus(ticket.status_ticket)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {!localStorage.getItem(`notif_${ticket.id_ticket}`) && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-1"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2 text-center">
                                                {formatarDataBrasil(ticket.data_ticket)}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            {loading && (
                                <div className="p-4 text-center text-gray-500">
                                    Carregando mais notificações...
                                </div>
                            )}
                            {!hasMore && allNotifications.length > 0 && (
                                <div className="p-4 text-center text-gray-500">
                                    Você chegou ao fim da lista
                                </div>
                            )}
                        </div>
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