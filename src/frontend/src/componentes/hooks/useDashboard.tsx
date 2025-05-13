import api from "./api";

export default async function  useDashboard  (){
    const response = await api.get('/sessao/usuario/dashboard')
    const data = response.data
    console.log("Dados do dashboard:", data);
    return data
 
}   