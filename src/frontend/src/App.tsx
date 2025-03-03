import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./paginas/home";
import NavBar from "./componentes/navbar";
import PaginaUsuario from "./paginas/paginaUsuario";
import RotasPrivadas from "./componentes/rotasPrivadas";
import Footer from "./componentes/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
                  <NavBar />
                  <Routes>
                    {/* Usaremos 'RotasPrivadas' para validar se o usuário está logado ou não
                        antes de mostrar as páginas do app */}
                    {/* <Route element={<RotasPrivadas />}> */}
                      <Route path="user-page" element={<PaginaUsuario />} />
                    {/* </Route> */}
                  </Routes>
                </>
              }
            />
          </Routes>
      </BrowserRouter>
      <Footer />
    </QueryClientProvider>
    </>
  )
}

export default App
