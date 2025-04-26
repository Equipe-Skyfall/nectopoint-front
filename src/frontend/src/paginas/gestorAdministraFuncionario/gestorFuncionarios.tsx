
import FuncionariosGestor from "../../componentes/conteudoPaginas/colaboradores/funcionarios"
import NavBar from "../../componentes/navbar/navbar";

export default function Funcionarios() {

    return (
        <div className="overflow-y-hidden">
            <NavBar/>
            <FuncionariosGestor />
        </div>
    );
}  
