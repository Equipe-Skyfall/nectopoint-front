import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import PaginaUsuario from "./paginas/paginaUsuario";
import Solicitacoes from "./paginas/solicitacoes";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PaginaGestor from "./paginas/paginaGestor";
import Login from "./paginas/login";
import { AuthProvider } from "./Provider/AuthProvider";
import Teste from "./paginas/teste";

import CadastrarFuncionario from "./paginas/gestorCadastrarFunc";
import Historico from "./paginas/historico";
import HistoricoFunc from "./paginas/historicoFunc";
import SolicitacoesGestor from "./paginas/solicitacoesGestor";
import Funcionarios from "./paginas/gestorFuncionarios";


function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <AuthProvider>

        
          <Routes>
            {/* Página inicial sem NavBar */}
            <Route path="/" element={<Login />} /> {/* Esse caminho / sempre terá que ser login, por ser o primeiro passo, ajustei o home 
            abaixo para que ficasse certo com as navbar, olhe o codigo inteiro depois de tudo adicionado para não cometer erros */}

            {/* Rotas com NavBar */}
            <Route
              path="*"
              element={
                <>
                  <Routes>
                    {/* Usaremos 'RotasPrivadas' para validar se o usuário está logado ou não
                        antes de mostrar as páginas do app */}
                    {/* <Route element={<RotasPrivadas />}> */}
                    <Route path="home" element={<PaginaUsuario />} />
                    <Route path="solicitacoes" element={<Solicitacoes />} />
                    <Route path="gestor-page" element={<PaginaGestor />} />
                    <Route path="historico-gestor" element={<Historico/>}/>
                    <Route path="historico-func" element={<HistoricoFunc/>}/>
                    <Route path="colaboradores" element={<Funcionarios />} />
                    <Route path="cadastrar" element={<CadastrarFuncionario/>}/>
                    <Route path="bater-ponto" element={<PaginaUsuario />}/>

                    <Route path="solicitacoes-empresa" element={<SolicitacoesGestor />}/>

                    <Route path="teste" element={<Teste />} />
                    {/* </Route> */}
                  </Routes>
                </>
              }
            />
          </Routes>
          </AuthProvider>
        </BrowserRouter>

      </QueryClientProvider>
    </>
  )
}

export default App
