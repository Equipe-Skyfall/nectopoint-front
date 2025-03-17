import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputPadrao from "../../inputPadrao/inputPadrao";

export default function ConteudoLogin() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false); // Estado para indicar carregamento
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    const handleLogin = async () => {
        setCarregando(true); // Inicia o estado de carregamento
        setErro(""); // Limpa mensagens de erro anteriores

        try {
            const cpfFormatado = cpf.replace(/\D/g, ""); // Remove tudo que não for dígito
            const senhaFormatada = senha.trim(); // Remove espaços em branco

            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cpf: cpfFormatado,
                    password: senhaFormatada,
                }),
            });

            if (response.ok) {
                const data = await response.json(); // Obtém os dados da resposta
                const role = data.role; // Obtém o cargo do usuário

                if (role === "COLABORADOR") {
                    navigate("/home"); // Redireciona para a página inicial dos colaboradores
                } else if (role === "GERENTE") {
                    navigate("/gestor-page"); // Redireciona para a página dos gerentes
                } else {
                    setErro("Cargo desconhecido.");
                }
            } else {
                const errorData = await response.json();
                setErro(errorData.message || "CPF ou senha incorretos.");
            }
        } catch (error) {
            console.error("Erro durante o login:", error);
            setErro("Ocorreu um erro durante o login. Tente novamente.");
        } finally {
            setCarregando(false); // Finaliza o estado de carregamento
        }
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

                <InputPadrao
                    placeholder="CPF"
                    length={11}
                    pattern="[0-9]"
                    id="cpf"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />
                <InputPadrao
                    placeholder="Senha"
                    length={20}
                    pattern="[0-9]A-Za-z"
                    id="senha"
                    type="password" // Corrigido para type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <span className="text-center align-middle self-center items-center justify-center my-4">
                    <input
                        type="checkbox"
                        id="checkbox"
                        className="m-2 rounded-full custom-checkbox"
                    />
                    <label className="text-black text-center align-top my-auto">
                        Lembrar-me
                    </label>
                </span>

                {erro && <p className="text-red-500">{erro}</p>}

                <button
                    onClick={handleLogin}
                    disabled={carregando} // Desabilita o botão durante o carregamento
                    className="w-32 p-3  my-4 rounded-full bg-blue-600 text-center poppins bg"
                >
                    {carregando ? "Carregando..." : "Acessar"} {/* Exibe texto dinâmico */}
                </button>

                <Link to="/" className="text-black my-8">
                    Esqueceu sua senha?
                </Link>
            </div>
        </>
    );
}