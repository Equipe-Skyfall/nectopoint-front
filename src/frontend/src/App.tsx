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
import SemLogin from "./paginas/checarLogin/checarLogin";
import AplicarFolga from "./paginas/folga/gestorAplicarFolga";


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
                  <Route path="home" element={<SemLogin cargo="COLABORADOR"><PaginaUsuario /></SemLogin>} />
                  <Route path="solicitacoes" element={<SemLogin cargo="COLABORADOR"><Solicitacoes /></SemLogin>} />
                  <Route path="gestor-page" element={<SemLogin cargo="GERENTE"><PaginaGestor /></SemLogin>} />
                  <Route path="historico-gestor" element={<SemLogin cargo="GERENTE"><Historico /></SemLogin>} />
                  <Route path="historico-func" element={<SemLogin cargo="COLABORADOR"><HistoricoFunc /></SemLogin>} />
                  <Route path="colaboradores" element={<SemLogin cargo="GERENTE"><Funcionarios /></SemLogin>} />
                  <Route path="/editar/:id" element={<SemLogin cargo="GERENTE"><EditarFunc /></SemLogin>} />
                  <Route path="cadastrar" element={<SemLogin cargo="GERENTE"><CadastrarFuncionario /></SemLogin>} />
                  <Route path="bater-ponto" element={<SemLogin cargo={''} ><PaginaUsuario /></SemLogin>} />
                  <Route path="solicitacoes-empresa" element={<SemLogin cargo="GERENTE"><SolicitacoesGestor /></SemLogin>} />
                  <Route path="folga" element={<SemLogin cargo="GERENTE"><AplicarFolga /></SemLogin>} />

                  <Route path="teste" element={<SemLogin cargo=""><Teste /></SemLogin>} />
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
