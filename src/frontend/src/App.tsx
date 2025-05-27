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
import { useEffect } from "react";
import SolicitacoesHistorico from "./paginas/solicitacoes/solicitacoesHistorico";
import AplicarFolga from "./paginas/folga/gestorAplicarFolga";

import SSEReceiver from "./componentes/sseReceiver/sseReceiver";
import sseRefresh from "./componentes/hooks/hooksChamarBackend/sseRefresh";
import recarregar from "./componentes/hooks/hooksChamarBackend/recarregar";

function App() {
  const queryClient = new QueryClient()
    
  // Fixed: Use proxy URL since you have Vite proxy configured
  const sse_rota = '/api/refetch' // This will be proxied to localhost:8080
  
useEffect(() => {
  console.log('🔄 Setting up SSE connection...');
  
  try {
    const sse = SSEReceiver.getInstance();
    
    sse.start(sse_rota, () => {
      console.log('🎯 SSE ping received, calling sseRefresh...');
      
      // ✅ Usar sseRefresh em vez de recarregar
      sseRefresh().then(() => {
        console.log('✅ SSE refresh completed');
      }).catch(error => {
        console.error('❌ SSE refresh failed:', error);
      });
    });

    return () => {
      console.log('🧹 Cleaning up SSE connection...');
      sse.stop();
    };
  } catch (error) {
    console.error('❌ Error setting up SSE:', error);
  }
}, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
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
                  <Route path="solicitacoes-historico" element={<SemLogin cargo="COLABORADOR"><SolicitacoesHistorico /></SemLogin>} />
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