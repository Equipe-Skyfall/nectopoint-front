import api from "../api";
// Recarrega os dados do usuário logado
const recarregar = async () => {
    try {
        const response = await api.get('sessao/usuario/me');
        localStorage.setItem('user', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}
export default recarregar;