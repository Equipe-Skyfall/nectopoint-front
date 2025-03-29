import api from "./api";
import recarregar from "./hooksChamarBackend/recarregar";

export default async function encerrarTurno() { 
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const id_colaborador = userData.id_colaborador; 

    try {
        
        const response = await api.post('/turno/encerrar-turno');
        //fetch nos dados apos encerrar turno
       
        recarregar();
        
        console.log('Turno encerrado com sucesso:', response.data);
        
        
    } catch (error: any) {
        console.error('Erro ao encerrar ponto:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Dados:', error.response.data);
        } else {
            console.error('Erro desconhecido:', error.message);
        }
        throw error;
    }
}