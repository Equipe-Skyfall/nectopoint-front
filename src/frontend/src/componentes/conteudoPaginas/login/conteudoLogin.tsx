import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputPadrao from "../../inputPadrao/inputPadrao";
import { useAuthContext } from "../../../Provider/AuthProvider";

export default function ConteudoLogin() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrarMe, setLembrarMe] = useState(false);
    const navigate = useNavigate();
    
    // Usa o AuthContext ao invés de um fetch
    const { login, isLoading, error, user, isAuthenticated } = useAuthContext();
   
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
            redirectBasedOnRole(user.cargo);
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isAuthenticated, user, navigate]);

    // Função para submit do login
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
                >
                    {isLoading ? "Carregando..." : "Acessar"}
                </button>

            </div>
        </>
    );
}