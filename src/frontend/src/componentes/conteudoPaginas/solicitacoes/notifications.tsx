import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { FaX } from "react-icons/fa6";

// Interface que define a estrutura de um ticket/notificação
// id_ticket - Identificador único do ticket
// tipo_ticket - Tipo da solicitação (ex: PEDIR_FERIAS) 
// data_ticket - Data de criação do ticket (formato ISO)
// status_ticket - Status atual (APROVADO, REPROVADO, PENDENTE) 
// mensagem - Mensagem opcional associada ao ticket
interface Ticket {
    id_ticket: string;
    tipo_ticket: string;
    data_ticket: string;
    status_ticket: string;
    mensagem?: string;
}


//   Interface que define a estrutura dos dados do usuário no localStorage
//   tickets_usuario - Array de tickets/notificações do usuário

interface UserData {
    tickets_usuario?: Ticket[];
}


// Hook personalizado para gerenciar notificações baseadas em tickets do usuário
// Objeto com componentes e funções para controle de notificações

export function useNotifications() {
    // Estado para controlar a exibição do dropdown de notificações
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Estado para controlar a exibição do modal com todas as notificações
    const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
    
    // Estado para controlar a página atual na paginação
    const [notificationPage, setNotificationPage] = useState(0);
    
    // Estado para armazenar as notificações carregadas
    const [notifications, setNotifications] = useState<Ticket[]>([]);
    
    // Quantidade de itens por página na visualização completa
    const itemsPerPage = 5;

    // Efeito para carregar as notificações quando o componente é montado
    useEffect(() => {
        loadNotifications();
    }, []);

    // Carrega as notificações/tickets do usuário a partir do localStorage

    const loadNotifications = () => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            try {
                const userData: UserData = JSON.parse(userDataString);
                const userTickets = userData.tickets_usuario || [];
                setNotifications(userTickets);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    };

    //  Formata uma data ISO para o formato brasileiro (dd/mm/aaaa hh:mm)
    //  data - String no formato ISO (ex: "2025-04-22T19:55:00.468Z")
    //  Data formatada (ex: "22/04/2025 16:55")

    const formatarDataBrasil = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

//  Traduz o status do ticket para português
//  status - Status original (APROVADO, REPROVADO, PENDENTE)
//  Status traduzido

    const formatarStatus = (status: string) => {
        switch (status) {
            case 'APROVADO': return 'Aprovado';
            case 'REPROVADO': return 'Reprovado';
            case 'PENDENTE': return 'Pendente';
            default: return status;
        }
    };

    
    //   Traduz o tipo de ticket para um formato mais legível
    //   tipo - Tipo original do ticket (ex: PEDIR_FERIAS)
    //   Descrição traduzida do tipo
    const formatarTipoTicket = (tipo: string) => {
        switch (tipo) {
            case 'PEDIR_FERIAS': return 'Solicitação de Férias';
            case 'PEDIR_ABONO': return 'Solicitação de Abono';
            case 'SOLICITAR_FOLGA': return 'Solicitação de Folga';
            case 'PEDIR_HORA_EXTRA': return 'Solicitação de Hora Extra';
            default: return tipo;
        }
    };

    // Filtra apenas notificações relevantes (APROVADO/REPROVADO)
    const relevantNotifications = notifications.filter(ticket => 
        ticket.status_ticket === 'APROVADO' || ticket.status_ticket === 'REPROVADO'
    );

    // Notificações recentes (5 mais recentes, ordenadas por data decrescente)
    const recentNotifications = [...relevantNotifications]
        .sort((a, b) => new Date(b.data_ticket).getTime() - new Date(a.data_ticket).getTime())
        .slice(0, 5);

    // Notificações paginadas para o modal completo
    const paginatedNotifications = [...relevantNotifications]
        .sort((a, b) => new Date(b.data_ticket).getTime() - new Date(a.data_ticket).getTime())
        .slice(notificationPage * itemsPerPage, (notificationPage + 1) * itemsPerPage);

    // Calcula o total de páginas para a paginação
    const totalPages = Math.ceil(relevantNotifications.length / itemsPerPage);

    // Marca uma notificação como lida no localStorage
    // id - ID do ticket a ser marcado como lido

    const markAsRead = (id: string) => {
        localStorage.setItem(`notif_${id}`, 'true');
    };

    
    //   Marca todas as notificações como lidas no localStorage

    const markAllAsRead = () => {
        relevantNotifications.forEach(ticket => {
            localStorage.setItem(`notif_${ticket.id_ticket}`, 'true');
        });
    };

    //   Alterna a exibição do dropdown de notificações
    //   Se estiver abrindo, recarrega as notificações

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            loadNotifications();
        }
    };

    // Conta quantas notificações não foram lidas
    const unreadCount = relevantNotifications.filter(ticket =>
        !localStorage.getItem(`notif_${ticket.id_ticket}`)
    ).length;

    
    //   Retorna classes CSS baseadas no status do ticket
    //   status - Status do ticket
    //   String com classes CSS para estilização
     
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

    //   Componente do ícone de notificação com contador de não lidas
    const NotificationIcon = () => (
        <div className="relative">
            <FaBell
                className="w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={toggleNotifications}
            />
            {/* Mostra um badge com a contagem de não lidas se houver */}
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

    //  Componente do dropdown com notificações recentes
    const NotificationDropdown = () => (
        <AnimatePresence>
            {showNotifications && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute -right-3 sm:right-0 mt-2 w-[90vw] sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200"
                >
                    <div className="divide-y divide-gray-200">
                        {/* Cabeçalho do dropdown */}
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 flex justify-center text-center">
                            <h3 className="text-lg font-medium text-white">Minhas Solicitações</h3>
                            {/* Botão para marcar todas como lidas (só aparece se houver não lidas) */}
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-white hover:text-gray-200"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>

                        {/* Lista de notificações ou mensagem de vazio */}
                        {recentNotifications.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                                <p className="text-gray-500">Nenhuma solicitação recente</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {/* Mapeia cada notificação para um item no dropdown */}
                                {recentNotifications.map(ticket => (
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
                                            {/* Indicador visual se a notificação não foi lida */}
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

                        {/* Rodapé com link para ver todas as notificações */}
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

    //  Modal com todas as notificações paginadas

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
                        {/* Cabeçalho do modal */}
                        <div className="p-6 border-b flex justify-between border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-xl">
                            <h2 className="sm:text-2xl mt-1 sm:mt-0 font-bold text-white">Todas as Minhas Solicitações</h2>
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

                        {/* Corpo do modal com tabela de notificações */}
                        <div className="flex-1 overflow-y-auto">
                            {paginatedNotifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhuma solicitação encontrada</p>
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
                                                {paginatedNotifications.map((ticket, index) => (
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

                        {/* Controles de paginação (se houver mais de uma página) */}
                        {totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 sm:p-6 p-2 flex items-center justify-between"
                            >
                                {/* Botão de página anterior */}
                                <motion.button
                                    whileHover={{ scale: notificationPage === 0 ? 1 : 1.05 }}
                                    whileTap={{ scale: notificationPage === 0 ? 1 : 0.95 }}
                                    onClick={() => setNotificationPage(p => Math.max(p - 1, 0))}
                                    disabled={notificationPage === 0}
                                    className={`flex items-center text-xs sm:text-base px-2 sm:px-6 py-3 rounded-xl transition-all ${notificationPage === 0
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                        }`}
                                >
                                    <FiChevronLeft className="sm:mr-2 mr-1" />
                                    Anterior
                                </motion.button>

                                {/* Indicadores de página */}
                                <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i;
                                        } else if (notificationPage <= 2) {
                                            pageNum = i;
                                        } else if (notificationPage >= totalPages - 3) {
                                            pageNum = totalPages - 5 + i;
                                        } else {
                                            pageNum = notificationPage - 2 + i;
                                        }
                                        return (
                                            <motion.button
                                                key={pageNum}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setNotificationPage(pageNum)}
                                                className={`sm:w-10 sm:h-10 w-6 h-8 text-xs sm:text-base rounded-full flex items-center justify-center ${notificationPage === pageNum
                                                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md"
                                                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {pageNum + 1}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Botão de próxima página */}
                                <motion.button
                                    whileHover={{ scale: notificationPage === totalPages - 1 ? 1 : 1.05 }}
                                    whileTap={{ scale: notificationPage === totalPages - 1 ? 1 : 0.95 }}
                                    onClick={() => setNotificationPage(p => Math.min(p + 1, totalPages - 1))}
                                    disabled={notificationPage === totalPages - 1}
                                    className={`flex items-center  text-xs px-2 sm:px-6 py-3 rounded-xl transition-all ${notificationPage === totalPages - 1
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                                        }`}
                                >
                                    Próxima
                                    <FiChevronRight className="sm:mr-2 mr-1" />
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Retorna os componentes e funções para uso externo
    return {
        NotificationIcon,       // Componente do ícone de notificação
        NotificationDropdown,   // Componente do dropdown de notificações
        AllNotificationsModal,  // Componente do modal completo
        toggleNotifications,    // Função para alternar visibilidade
        showNotifications,      // Estado de visibilidade atual
        setShowNotifications    // Função para controlar visibilidade
    };
}