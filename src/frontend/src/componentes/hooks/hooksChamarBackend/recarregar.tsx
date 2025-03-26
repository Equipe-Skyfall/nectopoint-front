import api from "../api";
import { User } from "../useAuth";
// Recarrega os dados do usuário logado
const recarregar = async () => {
    try {
        const responseData = (await api.get('sessao/usuario/me')).data;
      

        // Extrai os dados do usuário do novo JSON
        const userData: User = {
          id: responseData.id_colaborador,
          nome: responseData.dados_usuario.nome, // Nome pode ser null
          cpf: responseData.dados_usuario.cpf,
          cargo: responseData.dados_usuario.cargo,
          departamento: responseData.dados_usuario.departamento,
          status: responseData.dados_usuario.status, // Status pode ser null
          jornada_trabalho: responseData.jornada_trabalho,
          jornada_atual: responseData.jornada_atual,
          alertas_usuario: responseData.alertas_usuario,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    } catch (error) {
        console.error('Error :', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}
export default recarregar;