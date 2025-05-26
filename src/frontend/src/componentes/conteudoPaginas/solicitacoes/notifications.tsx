import { useState, useEffect } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { FaX } from "react-icons/fa6";
import useUserData from '../../hooks/userData';
import useUpdateUserWarnings from '../../hooks/updateTicket';

interface NotificationProps {
    userId: number;
}

interface Alerta {
    id_alerta: string;
    tipo_alerta: string;
    titulo: string;
    descricao: string;
    data_criacao: string;
    status_alerta: 'NAO_LIDO' | 'LIDO';
    id_colaborador: number;
}

export function useNotifications({ userId }: NotificationProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);
    const [resolvingAlerts, setResolvingAlerts] = useState<Set<string>>(new Set());
    const [forceUpdate, setForceUpdate] = useState(0);
    const userData = useUserData();
    const { updateUserWarnings, loading: updateLoading, error: updateError } = useUpdateUserWarnings();

    // ✅ Listener para mudanças no localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setForceUpdate(prev => prev + 1);
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // ✅ Funções auxiliares para mapear tipos
    const getTituloDoTipo = (tipo: string): string => {
        switch (tipo) {
            case 'PONTOS_IMPAR': return 'Pontos Ímpares Detectados';
            case 'FALTA_PONTO': return 'Falta de Ponto';
            case 'HORAS_EXTRAS': return 'Horas Extras Registradas';
            case 'TICKET_APROVADO': return 'Solicitação Aprovada';
            case 'TICKET_REPROVADO': return 'Solicitação Reprovada';
            case 'PONTO_AJUSTADO': return 'Ponto Ajustado';
            default: return 'Aviso do Sistema';
        }
    };

    const getDescricaoDoTipo = (tipo: string): string => {
        switch (tipo) {
            case 'PONTOS_IMPAR': return 'Foram detectados registros de ponto em quantidade ímpar. Verifique seus registros.';
            case 'FALTA_PONTO': return 'Não foi registrado ponto em um dos períodos esperados.';
            case 'HORAS_EXTRAS': return 'Foram registradas horas extras no seu banco de horas.';
            case 'TICKET_APROVADO': return 'Sua solicitação foi aprovada com sucesso.';
            case 'TICKET_REPROVADO': return 'Sua solicitação foi reprovada. Verifique os detalhes.';
            case 'PONTO_AJUSTADO': return 'Seus registros de ponto foram ajustados.';
            default: return 'Verifique os detalhes deste aviso.';
        }
    };

    // ✅ Função principal para obter alertas
    const getAlertas = (): Alerta[] => {
        console.log('🔍 Debugando alertas:');
        console.log('userData completo:', userData);
        console.log('userData.alertas_usuario:', userData?.alertas_usuario);
        
        const localStorageData = JSON.parse(localStorage.getItem("user") || '{}');
        console.log('localStorage.alertas_usuario:', localStorageData?.alertas_usuario);

        if (!userData?.alertas_usuario) {
            console.log('❌ Não há alertas_usuario no userData');
            return [];
        }
        
        const alertasMapeados = userData.alertas_usuario
            .map((item: any) => {
                console.log('🔄 Item original:', item);
                
                // Se já está no formato correto, retornar como está
                if (item.id_alerta && item.titulo && item.data_criacao) {
                    console.log('✅ Alerta já no formato correto:', item);
                    return item;
                }
                
                // Se é um aviso, mapear para formato de alerta
                if (item.id_aviso) {
                    const alertaMapeado = {
                        id_alerta: item.id_aviso,
                        tipo_alerta: item.tipo_aviso || 'AVISO_GERAL',
                        titulo: getTituloDoTipo(item.tipo_aviso),
                        descricao: getDescricaoDoTipo(item.tipo_aviso),
                        data_criacao: item.data_aviso,
                        status_alerta: item.status_aviso === 'PENDENTE' ? 'NAO_LIDO' : 'LIDO',
                        id_colaborador: 0
                    };
                    console.log('✅ Aviso mapeado para alerta:', alertaMapeado);
                    return alertaMapeado;
                }
                
                console.log('❌ Item não reconhecido:', item);
                return null;
            })
            .filter((alerta: Alerta | null) => {
                if (!alerta) return false;
                
                const valido = alerta && 
                       alerta.id_alerta && 
                       alerta.titulo && 
                       alerta.data_criacao;
                
                if (!valido) {
                    console.log('❌ Alerta inválido após mapeamento:', alerta);
                }
                return valido;
            })
            .sort((a: Alerta, b: Alerta) => 
                new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
            );
        
     
        return alertasMapeados;
    };

    // ✅ Variáveis derivadas dos alertas
    const allAlertas = getAlertas();
    const recentAlertas = allAlertas.slice(0, 5);
    const naoLidosCount = allAlertas.filter(alerta => alerta.status_alerta === 'NAO_LIDO').length;

    // ✅ Log dos estados finais
 

    // ✅ Função para formatar data
    const formatarDataBrasil = (dataISO: string) => {
        if (!dataISO) return 'Data não informada';
        const data = new Date(dataISO);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // ✅ Função para formatar tipo de alerta
    const formatarTipoAlerta = (tipo: string): string => {
        if (!tipo || typeof tipo !== 'string') {
            return 'Tipo não definido';
        }
        
        switch (tipo) {
            case 'PONTOS_IMPAR': return 'Pontos Ímpares';
            case 'FALTA_PONTO': return 'Falta de Ponto';
            case 'HORAS_EXTRAS': return 'Horas Extras';
            case 'TICKET_APROVADO': return 'Solicitação Aprovada';
            case 'TICKET_REPROVADO': return 'Solicitação Reprovada';
            case 'PONTO_AJUSTADO': return 'Ponto Ajustado';
            case 'AVISO_GERAL': return 'Aviso Geral';
            case 'FALTA_JUSTIFICADA': return 'Falta Justificada';
            case 'BANCO_HORAS_ATUALIZADO': return 'Banco de Horas Atualizado';
            default: return tipo.replace(/_/g, ' ');
        }
    };

    // ✅ Função para cores do tipo de alerta
    const getTipoAlertaColor = (tipo: string) => {
        if (!tipo || typeof tipo !== 'string') {
            return 'bg-gray-100 text-gray-800';
        }
        
        switch (tipo) {
            case 'TICKET_APROVADO':
            case 'HORAS_EXTRAS':
                return 'bg-green-100 text-green-800';
            case 'TICKET_REPROVADO':
            case 'FALTA_PONTO':
                return 'bg-red-100 text-red-800';
            case 'PONTO_AJUSTADO':
            case 'PONTOS_IMPAR':
                return 'bg-yellow-100 text-yellow-800';
            case 'AVISO_GERAL':
                return 'bg-blue-100 text-blue-800';
            case 'FALTA_JUSTIFICADA':
                return 'bg-purple-100 text-purple-800';
            case 'BANCO_HORAS_ATUALIZADO':
                return 'bg-cyan-100 text-cyan-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // ✅ Função para alternar notificações
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    // ✅ Função para resolver alerta
    const resolverAlerta = async (alertaId: string) => {
        try {
            setResolvingAlerts(prev => new Set(prev).add(alertaId));

            // Atualizar localStorage removendo o alerta
            const currentUserData = JSON.parse(localStorage.getItem('user') || '{}');
            const alertasAtualizados = currentUserData.alertas_usuario?.filter(
                (item: any) => {
                    // Verificar tanto id_alerta quanto id_aviso
                    return item.id_alerta !== alertaId && item.id_aviso !== alertaId;
                }
            ) || [];

            // Atualizar localStorage imediatamente
            const updatedUserData = {
                ...currentUserData,
                alertas_usuario: alertasAtualizados
            };
            localStorage.setItem('user', JSON.stringify(updatedUserData));

            // Chamar o hook
            const sucesso = await updateUserWarnings(userId);

            if (sucesso) {
                console.log('Alerta resolvido com sucesso');
                window.dispatchEvent(new Event('storage'));
            } else {
                // Se falhou, reverter o localStorage
                localStorage.setItem('user', JSON.stringify(currentUserData));
                throw new Error('Falha ao atualizar no servidor');
            }

        } catch (error) {
            console.error('Erro ao resolver alerta:', error);
            // Reverter localStorage em caso de erro
            const originalData = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify(originalData));
        } finally {
            setResolvingAlerts(prev => {
                const newSet = new Set(prev);
                newSet.delete(alertaId);
                return newSet;
            });
        }
    };

    // ✅ Componente do ícone de notificação
    const NotificationIcon = () => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
            onClick={toggleNotifications}
        >
            <FaBell className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors" />
            {naoLidosCount > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                >
                    {naoLidosCount}
                </motion.span>
            )}
        </motion.div>
    );

    // ✅ Componente do dropdown de notificações
    const NotificationDropdown = () => (
        <AnimatePresence>
            {showNotifications && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -right-24 sm:right-0 mt-2 w-[90vw] sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200"
                >
                    <div className="divide-y divide-gray-200">
                        <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">Meus Alertas</h3>
                        </div>

                        {recentAlertas.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                                <p className="text-gray-500">Nenhum alerta recente</p>
                            </div>
                        ) : (
                            <div className="max-h-96 overflow-y-auto">
                                {recentAlertas.map(alerta => (
                                    <motion.div
                                        key={alerta.id_alerta}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                                            alerta.status_alerta === 'NAO_LIDO' ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-start">
                                                    {alerta.titulo}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoAlertaColor(alerta.tipo_alerta)}`}>
                                                        {formatarTipoAlerta(alerta.tipo_alerta)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 text-start line-clamp-2">
                                                    {alerta.descricao}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2 text-start">
                                                    {formatarDataBrasil(alerta.data_criacao)}
                                                </p>
                                            </div>
                                            
                                            <div className="flex flex-col items-center gap-2">
                                                {alerta.status_alerta === 'NAO_LIDO' && (
                                                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                )}
                                                
                                               
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <div className="px-4 py-3 bg-gray-50 text-center">
                            
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // ✅ Modal de todos os alertas
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
                        className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b flex justify-between items-center border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-xl">
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Todos os Meus Alertas</h2>
                            <button
                                onClick={() => setShowAllNotificationsModal(false)}
                                className="p-2 text-gray-50 hover:text-gray-300 transition-colors"
                            >
                                <FaX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {allAlertas.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhum alerta encontrado</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {allAlertas.map((alerta) => (
                                        <motion.div
                                            key={alerta.id_alerta}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 text-start">
                                                        {alerta.titulo}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoAlertaColor(alerta.tipo_alerta)}`}>
                                                            {formatarTipoAlerta(alerta.tipo_alerta)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2 text-start">
                                                        {alerta.descricao}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-3 text-start">
                                                        {formatarDataBrasil(alerta.data_criacao)}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex flex-col items-center gap-2">
                                                    {alerta.status_alerta === 'NAO_LIDO' && (
                                                        <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                                                    )}
                                                    
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            resolverAlerta(alerta.id_alerta);
                                                        }}
                                                        disabled={resolvingAlerts.has(alerta.id_alerta) || updateLoading}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        {resolvingAlerts.has(alerta.id_alerta) ? (
                                                            <>
                                                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                                Resolvendo...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCheck className="w-3 h-3" />
                                                                Resolvido
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
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
        setShowNotifications,
        naoLidosCount,
        allAlertas,
        recentAlertas
    };
}