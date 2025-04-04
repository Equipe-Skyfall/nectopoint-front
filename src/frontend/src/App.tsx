import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import PaginaUsuario from "./paginas/homeFuncionario/paginaUsuario";
import Solicitacoes from "./paginas/solicitacoes/solicitacoes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginaGestor from "./paginas/homeGestor/paginaGestor";
import Login from "./paginas/login/login";
import { AuthProvider } from "./Provider/AuthProvider";
import Teste from "./paginas/teste";

import CadastrarFuncionario from "./paginas/gestorAdministraFuncionario/gestorCadastrarFunc";
import Historico from "./paginas/historico/historico";
import HistoricoFunc from "./paginas/historico/historicoFunc";
import SolicitacoesGestor from "./paginas/solicitacoes/solicitacoesGestor";
import Funcionarios from "./paginas/gestorAdministraFuncionario/gestorFuncionarios";
import EditarFunc from "./componentes/conteudoPaginas/colaboradores/editarFunc";
import SemLogin from "./paginas/semLogin/semLogin";


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
                  <Route path="home" element={<SemLogin><PaginaUsuario /></SemLogin>} />
                  <Route path="solicitacoes" element={<SemLogin><Solicitacoes /></SemLogin>} />
                  <Route path="gestor-page" element={<SemLogin><PaginaGestor /></SemLogin>} />
                  <Route path="historico-gestor" element={<SemLogin><Historico /></SemLogin>} />
                  <Route path="historico-func" element={<SemLogin><HistoricoFunc /></SemLogin>} />
                  <Route path="colaboradores" element={<SemLogin><Funcionarios /></SemLogin>} />
                  <Route path="/editar/:id" element={<SemLogin><EditarFunc /></SemLogin>} />
                  <Route path="cadastrar" element={<SemLogin><CadastrarFuncionario /></SemLogin>} />
                  <Route path="bater-ponto" element={<SemLogin><PaginaUsuario /></SemLogin>} />
                  <Route path="solicitacoes-empresa" element={<SemLogin><SolicitacoesGestor /></SemLogin>} />
                  <Route path="teste" element={<SemLogin><Teste /></SemLogin>} />
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
