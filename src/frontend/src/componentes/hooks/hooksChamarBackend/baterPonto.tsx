import api from "../api";
import recarregar from "./recarregar";

export default async function baterPonto() { 
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const id_colaborador = userData.id_colaborador; 

    try {
        
        const response = await api.post('/turno/bater-ponto');
        //fetch nos dados apos bater turno
        recarregar();
        
        console.log('Ponto batido com sucesso:', response.data);
        return response.data || [];
    } catch (error: any) {
        console.error('Erro ao bater ponto:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Dados:', error.response.data);
        } else {
            console.error('Erro desconhecido:', error.message);
        }
        throw error;
    }
}