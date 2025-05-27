import SessaoUsuario from "../../../interfaces/interfaceSessaoUsuario";
import api from "../api";

// New function specifically for SSE-triggered updates
const sseRefresh = async () => {
    try {
        const response = await api.get('/sessao/usuario/me', {
            withCredentials: true,
        })
        const responseData = response.data;
        console.log('SSE triggered data refresh:', response);
        
        if (response.status === 200) {
            // Extract user data from response
            const userData: SessaoUsuario = {
                id_sessao: responseData.id_sessao,
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
                jornadas_historico: responseData.jornadas_historico,
                jornadas_irregulares: responseData.jornadas_irregulares,
                tickets_usuario: responseData.tickets_usuario,
            }
            
            // Update localStorage
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Dispatch custom event to notify components
            window.dispatchEvent(new CustomEvent('sseDataUpdate', { 
                detail: userData 
            }));
            
            console.log('SSE data update completed');
            return userData;
        }
        
        return null;
    } catch (error) {
        console.error('Error in SSE refresh:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        return null;
    }
}

export default sseRefresh;