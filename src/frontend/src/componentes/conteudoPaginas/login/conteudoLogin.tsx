import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputPadrao from "../../inputPadrao/inputPadrao";
import { useAuthContext } from "../../../Provider/AuthProvider";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";

export default function ConteudoLogin() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrarMe, setLembrarMe] = useState(false);
    const navigate = useNavigate();

    const { login, isLoading, error, user, isAuthenticated } = useAuthContext();

    const redirectBasedOnRole = (cargo) => {
        if (cargo === "COLABORADOR") {
            navigate("/home");
        } else if (cargo === "GERENTE") {
            navigate("/gestor-page");
        }
    };

    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        document.body.classList.add("bg-white");

        if (isAuthenticated && user) {
            redirectBasedOnRole(user.cargo);
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
            document.body.classList.remove("bg-white");
        };
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async () => {
        const cpfFormatado = cpf.replace(/\D/g, "");
        const senhaFormatada = senha.trim();

        login(
            { cpf: cpfFormatado, password: senhaFormatada },
            {
                onSuccess: (response) => {
                    if (!lembrarMe) {
                        sessionStorage.setItem('sessionAuth', 'true');
                    }

                    const cargo = response.data.dados_usuario.cargo;
                    redirectBasedOnRole(cargo);
                }
            }
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Efeitos de fundo */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full filter blur-3xl opacity-20"></div>
            </div>

            {/* Logo */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="pt-16 flex justify-center"
            >
                <div className="">
                    <img
                        src="/nectopoint.png"
                        className="w-40 h-20"
                        alt="NectoPoint Logo"
                    />
                </div>
            </motion.div>

            {/* Card de Login */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto my-auto w-full max-w-md px-6"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white">Acesse sua conta</h1>
                    </div>

                    {/* Formulário */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-700">
                                    {error.response?.data?.message || error.message || "CPF ou senha incorretos."}
                                </p>
                            </div>
                        )}

                        {/* Campo CPF */}
                        <div className="mb-6">
                            <label className="block text-base font-bold text-gray-700 text-start -mb-2 ml-2">CPF</label>
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}>
                                    <div className="absolute inset-y-0 left-5 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <InputPadrao
                                        placeholder="Digite seu CPF"
                                        length={11}
                                        pattern="[0-9]"
                                        id="cpf"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Campo Senha */}
                        <div className="mb-6">
                            <label className="block text-base font-bold text-gray-700 text-start -mb-2 ml-2">SENHA</label>
                            <div className="relative">
                            <motion.div
                                    whileHover={{ scale: 1.03 }}>
                                <div className="absolute inset-y-0 left-5 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <InputPadrao
                                    placeholder="Digite sua senha"
                                    length={20}
                                    pattern="[0-9]A-Za-z"
                                    id="senha"
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                                </motion.div>
                            </div>
                        </div>

                        {/* Lembrar-me */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center mb-6">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="checkbox"
                                    className="h-4 w-4 text-cyan-500 focus:ring-blue-500 border-2 border-gray-300 rounded-full"
                                    checked={lembrarMe}
                                    onChange={(e) => setLembrarMe(e.target.checked)}
                                />
                                <span className="ml-3 text-sm text-gray-700">Lembrar-me</span>
                            </label>

                        </motion.div>

                        {/* Botão de Login */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogin}
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center ${isLoading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-cyan-500 transition-colors"
                                }`}
                        >
                            {isLoading ? (
                                "Carregando..."
                            ) : (
                                <>
                                    Acessar <FaArrowRight className="ml-2" />
                                </>
                            )}
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}