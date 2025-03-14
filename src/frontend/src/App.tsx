import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import PaginaUsuario from "./paginas/paginaUsuario";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PaginaGestor from "./paginas/paginaGestor";
import Login from "./paginas/login";

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
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
