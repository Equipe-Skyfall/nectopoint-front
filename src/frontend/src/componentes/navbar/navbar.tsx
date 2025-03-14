import { useState, useEffect, useRef } from "react";
import { FaHome, FaClipboardList, FaUser, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function useOutsideClick(ref, callback) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
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
    const sidebarRef = useRef(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const confirmLogout = () => {
        setShowLogoutModal(false);
        navigate("/"); 
    };

    // Aqui vai detectar se o click foi fora da sidebar
    useOutsideClick(sidebarRef, () => setIsOpen(false));

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Navbar */}
            <nav className="w-full bg-[#F1F1F1] p-4 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-20">
                <div className="flex items-center gap-4">
                    {/* Botão de Menu Hambúrguer */}
                    <button onClick={toggleSidebar} aria-label="Abrir menu">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        {/* Aqui ta um icone estatico, mas no futuro deve ser implementado uma foto real do funcionario  */}
                        <FaUser className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-700 font-medium">Funcionário</span>
                    </div>
                </div>

                <div>
                    <img src="/nectopoint.png" width={80} alt="Logo" />
                </div>
            </nav>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Movimentação que deixa a sidebar abrir e fechar suave */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 left-0 md:w-96 w-64 h-full md:text-lg bg-white shadow-lg p-4 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col items-start space-y-4 mt-10">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <FaUser className="w-8 h-8 text-gray-700" />
                        <div>
                            <span className="text-lg font-semibold text-gray-700 flex">Funcionário</span> {/*Puxar nome do funcionario do Banco*/}
                            <p className="text-sm text-gray-500">CPF: 000.000.000-00</p> {/*Puxar CPF do funcionario do Banco*/}
                        </div>
                    </div>

                    <Link to="/user-page" onClick={toggleSidebar}>
                        <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex rounded-md">
                            <FaHome className="w-5 h-5" />
                            <span>Página Inicial</span>
                        </button>
                    </Link>
                    {/* Rota Ficticia para Solicitações para apenas não ficar vazio */}
                    <Link to="/solicitacoes" onClick={toggleSidebar}>
                        <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex  rounded-md">
                            <FaClipboardList className="w-5 h-5" />
                            <span>Solicitações</span>
                        </button>
                    </Link>
                    {/* Rota Ficticia para Histórico para apenas não ficar vazio */}
                    <Link to="/historico" onClick={toggleSidebar}>
                        <button className="w-full py-2 px-4 text-gray-700 hover:bg-gray-100 gap-3 flex  rounded-md">
                            <FaHistory className="w-5 h-5" />
                            <span>Histórico</span>
                        </button>
                    </Link>
                    <Link to="#" onClick={toggleSidebar}>
                        <button className="w-full py-2 px-4 text-red-700 hover:bg-red-200 gap-3 flex  rounded-md" onClick={() => setShowLogoutModal(true)}
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
                            <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                                Cancelar
                            </button>
                            <button onClick={confirmLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
