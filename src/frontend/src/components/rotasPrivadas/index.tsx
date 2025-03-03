import { Navigate, Outlet } from 'react-router-dom';

const RotasPrivadas = () => {
    // Se não estiver autenticado, voltar para home
    const expiracao = sessionStorage.getItem('expiracao');
    console.log(expiracao)
    const Autenticado = expiracao && new Date().getTime() < Number(expiracao);
    console.log(Autenticado)
    return Autenticado ? <Outlet /> : <Navigate to="/" />;
};

export default RotasPrivadas;