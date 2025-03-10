import { useState } from "react";
import { FaUser } from "react-icons/fa";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Navbar e hamburguer */}
            <nav className="w-full bg-[#F1F1F1] p-4 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsOpen(true)}>
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
                        <FaUser className="w-5 h-5 text-gray-700" />
                        <span className="text-gray-700 font-medium">Funcionário</span>
                    </div>
                </div>

                <div>
                    <img src="/nectopoint.png" width={80} alt="Logo" />
                </div>
            </nav>

            {/* Sidebar da Navbar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 flex"
                    onClick={closeSidebar}
                >
                    <div
                        className="h-full bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: window.innerWidth > 768 ? "60%" : "75%",
                            maxWidth: "600px",
                        }}
                    >
                        <p className="text-black">Sidebar (em desenvolvimento)</p>
                    </div>
                </div>
            )}
        </>
    );
}
