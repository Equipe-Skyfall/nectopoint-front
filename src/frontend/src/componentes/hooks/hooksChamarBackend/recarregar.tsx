import SessaoUsuario from "../../../interfaces/interfaceSessaoUsuario";
import api from "../api";
import { User } from "../useAuth";
import useUserData from "../userData";
// Recarrega os dados do usuário logado
const  recarregar =  async () => {
    try {
        const responseData = (await api.get('sessao/usuario/me')).data;
        console.log('Dados do usuário recarregados:', responseData);
        

        if ( useUserData() != responseData){
            // Extrai os dados do usuário do novo JSON
        const userData: SessaoUsuario = {
            id_sessao: responseData.id_sessao, // Corrected to match 'id_sessao'
            id_colaborador: responseData.id_colaborador,
            dados_usuario: {
                nome: responseData.dados_usuario.nome,
                cpf: responseData.dados_usuario.cpf,
                cargo: responseData.dados_usuario.cargo,
                departamento: responseData.dados_usuario.departamento,
                status: responseData.dados_usuario.status,
            },
            jornada_trabalho: responseData.jornada_trabalho,
            jornada_atual: responseData.jornada_atual,
            alertas_usuario: responseData.alertas_usuario,
            jornadas_historico: responseData.jornadas_historico, // Optional
            jornadas_irregulares: responseData.jornadas_irregulares, // Optional
            tickets_usuario: responseData.tickets_usuario, // Optional
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.location.reload();
        }
       
    } catch (error) {
        console.error('Error :', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}
export default recarregar;


