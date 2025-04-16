import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputPadrao from "../../inputPadrao/inputPadrao";
import { useAuthContext } from "../../../Provider/AuthProvider";
import VerificationModal from "./verificationModal";

export default function ConteudoLogin() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrarMe, setLembrarMe] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    
    // Usa o AuthContext
    const { login, verifyCode, isLoading, error, user, isAuthenticated } = useAuthContext();
   
    // Função para redirecionar baseado no cargo
    const redirectBasedOnRole = (cargo) => {
        if (cargo === "COLABORADOR") {
            navigate("/home");
        } else if (cargo === "GERENTE") {
            navigate("/gestor-page");
        }
    };

    // Checa a autenticação ao montar o componente e redireciona baseado no cargo
    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        if (isAuthenticated && user) {
            redirectBasedOnRole(user.dados_usuario.cargo);
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isAuthenticated, user, navigate]);

    // Função para submit do login
    const handleLogin = async () => {
        const cpfFormatado = cpf.replace(/\D/g, "");
        const senhaFormatada = senha.trim();
        
        // Validação simples
        // if (cpfFormatado.length !== 11) {
        //     alert("CPF deve conter 11 dígitos");
        //     return;
        // }
        
        // if (senhaFormatada.length < 3) {
        //     alert("Senha muito curta");
        //     return;
        // }
        
        console.log("Enviando requisição de login:", { cpf: cpfFormatado, password: senhaFormatada });
        
        login(
            { cpf: cpfFormatado, password: senhaFormatada },
            {
                onSuccess: (response) => {
                    console.log("Login bem sucedido:", response);
                    // Exibe o modal de verificação e armazena o userId
                    setShowVerificationModal(true);
                    setUserId(response.data.userId);
                },
                onError: (error) => {
                    console.error("Erro no login:", error);
                    // Exibe mensagem de erro específica se disponível
                    const errorMessage = error.response?.data?.message || "Erro ao realizar login. Verifique suas credenciais.";
                    alert(errorMessage);
                }
            }
        );
    };

    // Função para enviar o código de verificação
    const handleVerification = async (code) => {
        if (!code || code.length !== 6) {
            alert("Por favor, insira o código de verificação de 6 dígitos");
            return;
        }
        
        console.log("Enviando verificação:", { userId, verificationCode: code });
        
        verifyCode(
            { userId, verificationCode: code },
            {
                onSuccess: (response) => {
                    console.log("Verificação bem sucedida:", response);
                    setShowVerificationModal(false);
                    
                    if (!lembrarMe) {
                        sessionStorage.setItem('sessionAuth', 'true');
                    }
                    
                    try {
                        if (response.data && response.data.dados_usuario && response.data.dados_usuario.cargo) {
                            const cargo = response.data.dados_usuario.cargo;
                            redirectBasedOnRole(cargo);
                        } else {
                            console.error("Dados de resposta incompletos:", response.data);
                            alert("Erro ao processar dados do usuário. Por favor, tente novamente.");
                        }
                    } catch (error) {
                        console.error("Erro ao processar resposta de verificação:", error);
                        alert("Erro inesperado. Por favor, tente novamente.");
                    }
                },
                onError: (error) => {
                    console.error("Erro na verificação:", error);
                    // Não fecha o modal para permitir nova tentativa
                    const errorMessage = error.response?.data?.message || "Código de verificação inválido. Tente novamente.";
                    alert(errorMessage);
                }
            }
        );
    };

    return (
        <>
            <div className="overflow-hidden">
                <div className="text-center flex justify-center my-8">
                    <img
                        src="/nectopoint.png"
                        className="w-24 align-middle text-center"
                        alt="homeLogo"
                    />
                </div>
            </div>
            <div className="flex text-white flex-col text-center self-center items-center justify-center my-auto top-1/4 left-0 w-full mx-auto absolute">
                <h1 className="poppins-semibold w-full text-[25px] text-center text-blue-800">
                    Login
                </h1>

                {/* Input com o valor de cpf */}
                <InputPadrao
                    placeholder="CPF"
                    length={11}
                    pattern="[0-9]"
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />

                {/* Input com o valor de senha */}
                <InputPadrao
                    placeholder="Senha"
                    length={20}
                    pattern="[0-9]A-Za-z"
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <span className="text-center align-middle self-center items-center justify-center my-4">
                    <input
                        type="checkbox"
                        id="checkbox"
                        className="m-2 rounded-full custom-checkbox"
                        checked={lembrarMe}
                        onChange={(e) => setLembrarMe(e.target.checked)}
                    />
                    <label className="text-black text-center align-top my-auto">
                        Lembrar-me
                    </label>
                </span>

                {error && (
                    <p className="text-red-500">
                        {error.response?.data?.message || error.message || "CPF ou senha incorretos."}
                    </p>
                )}

                {/* Botão que puxa o handleLogin e realiza o submit de login */}
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-32 p-3 my-4 rounded-full bg-blue-600 text-center poppins bg"
                    type="submit"
                >
                    {isLoading ? "Carregando..." : "Acessar"}
                </button>

            </div>

            {/* Modal de Verificação */}
            <VerificationModal 
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onVerify={(code) => {
                    // Pass the code directly to handleVerification
                    handleVerification(code);
                }}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
}