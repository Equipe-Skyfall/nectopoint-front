import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav>
            <div>
                <img
                    src="/"
                    width={120}
                    alt="Logo"
                />

                {/* Botão de Menu Hamburguer */}
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                    >
                    {/* Ícone do hamburguer */}
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
                </div>

                <div>
                    <div>
                        <Link to='/'>
                            <button>Botão Navbar</button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}