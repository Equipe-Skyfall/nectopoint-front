import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./paginas/home";
import NavBar from "./componentes/navbar/navbar";
import PaginaUsuario from "./paginas/paginaUsuario";
import Solicitacoes from "./paginas/solicitacoes";



import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import layoutGestor from "./paginas/paginaGestor/layoutGestor";
import PaginaGestor from "./paginas/paginaGestor";

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Página inicial sem NavBar */}
            <Route path="/" element={<Home />} />

            {/* Rotas com NavBar */}
            <Route
              path="*"
              element={
                <>
                  <Routes>
                    {/* Usaremos 'RotasPrivadas' para validar se o usuário está logado ou não
                        antes de mostrar as páginas do app */}
                    {/* <Route element={<RotasPrivadas />}> */}
                    <Route path="user-page" element={<PaginaUsuario />} />
                    <Route path="solicitacoes" element={<Solicitacoes />} />
                    <Route path="gestor-page" element={<PaginaGestor />} />
                    {/* </Route> */}
                  </Routes>
                </>
              }
            />
          </Routes>
        </BrowserRouter>

      </QueryClientProvider>
    </>
  )
}

export default App
