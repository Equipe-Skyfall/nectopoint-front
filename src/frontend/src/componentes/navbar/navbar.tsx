import { useState, useEffect, useRef } from "react";
import { FaHome, FaClipboardList, FaUser, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Provider/AuthProvider";
import { useNotifications } from "../conteudoPaginas/solicitacoes/notifications";

function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, isAuthenticated } = useAuthContext();
    const sidebarRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ nome: '', cpf: '', dados_usuario: { cargo: '' } });
    const { user } = useAuthContext();
    const userId = user?.id_colaborador;

    const {
        NotificationIcon,
        NotificationDropdown,
        AllNotificationsModal,
        showNotifications,
        setShowNotifications
    } = useNotifications({userId: Number(userId)});

    useOutsideClick(sidebarRef, () => setIsOpen(false));

    const toggleSidebar = () => setIsOpen(!isOpen);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout();
        navigate("/");
    };

    // Load user data
    useEffect(() => {
        if (isAuthenticated) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser.dados_usuario) {
                        setUserData({
                            nome: parsedUser.dados_usuario.nome || '',
                            cpf: parsedUser.dados_usuario.cpf || '',
                            dados_usuario: {
                                cargo: parsedUser.dados_usuario.cargo || ''
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        }
    }, [isAuthenticated]);

    if (userData.dados_usuario.cargo === "GERENTE") {
        return (
            <>
                <nav className="w-full bg-[#F1F1F1] p-4 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} aria-label="Abrir menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <FaUser className="w-5 h-5 text-gray-700" />
                            <span className="text-gray-700 font-medium">{userData.nome}</span>
                        </div>
                    </div>
                    <div>
                        <img src="/nectopoint.png" width={80} alt="Logo" />
                    </div>
                </nav>

                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleSidebar} />
                )}

                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 md:w-96 w-64 h-full md:text-lg bg-white shadow-lg p-4 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex flex-col items-start space-y-4 mt-10">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <FaUser className="w-8 h-8 text-gray-700" />
                            <div>
                                <span className="text-lg font-semibold text-gray-700 text-start flex">{userData.nome}</span>
                                <p className="text-sm text-gray-500 text-start">CPF: {userData.cpf}</p>
                            </div>
                        </div>

                        <Link to="/gestor-page" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaHome className="w-5 h-5" />
                                <span>Página Inicial</span>
                            </button>
                        </Link>

                        <Link to="/bater-ponto" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaClipboardList className="w-5 h-5" />
                                <span>Bater Ponto</span>
                            </button>
                        </Link>

                        <Link to="/solicitacoes-empresa" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaUser className="w-5 h-5" />
                                <span className="text-start">Solicitações da Empresa</span>
                            </button>
                        </Link>

                        <Link to="/historico-gestor" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaHistory className="w-5 h-5" />
                                <span>Histórico</span>
                            </button>
                        </Link>

                        <Link to="/colaboradores" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaUser className="w-5 h-5" />
                                <span>Colaboradores</span>
                            </button>
                        </Link>

                        <Link to="#" onClick={toggleSidebar}>
                            <button
                                className="w-full py-2 px-4 text-red-700 hover:bg-red-200 gap-3 flex rounded-md"
                                onClick={() => setShowLogoutModal(true)}
                            >
                                <FaSignOutAlt className="w-5 h-5 mt-1" />
                                <span>Sair</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {showLogoutModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <p className="text-lg font-semibold text-gray-800 mb-4">Deseja realmente sair?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <>
                <nav className="w-full bg-[#F1F1F1] p-4 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} aria-label="Abrir menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <FaUser className="w-5 h-5 text-gray-700" />
                            <span className="text-gray-700 font-medium">{userData.nome}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <NotificationIcon />
                            <NotificationDropdown />
                        </div>
                        <img src="/nectopoint.png" width={80} alt="Logo" />
                    </div>
                </nav>

                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleSidebar} />
                )}

                <div
                    ref={sidebarRef}
                    className={`fixed top-0 left-0 md:w-96 w-64 h-full md:text-lg bg-white shadow-lg p-4 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex flex-col items-start space-y-4 mt-10">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <FaUser className="w-8 h-8 text-gray-700" />
                            <div>
                                <span className="text-lg font-semibold text-gray-700 text-start flex">{userData.nome}</span>
                                <p className="text-sm text-gray-500 text-start">CPF: {userData.cpf}</p>
                            </div>
                        </div>

                        <Link to="/home" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaHome className="w-5 h-5" />
                                <span>Página Inicial</span>
                            </button>
                        </Link>
                        <Link to="/solicitacoes" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaClipboardList className="w-5 h-5" />
                                <span>Solicitações</span>
                            </button>
                        </Link>
                        <Link to="/historico-func" onClick={toggleSidebar}>
                            <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                                <FaHistory className="w-5 h-5" />
                                <span>Histórico</span>
                            </button>
                        </Link>
                        <Link to="#" onClick={toggleSidebar}>
                            <button
                                className="w-full py-2 px-4 text-red-700 hover:bg-red-200 gap-3 flex rounded-md"
                                onClick={() => setShowLogoutModal(true)}
                            >
                                <FaSignOutAlt className="w-5 h-5 mt-1" />
                                <span>Sair</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {showLogoutModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <p className="text-lg font-semibold text-gray-800 mb-4">Deseja realmente sair?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <AllNotificationsModal />
            </>
        );
    }
}