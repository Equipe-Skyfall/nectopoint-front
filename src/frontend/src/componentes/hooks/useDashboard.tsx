import { useEffect, useState } from "react";
import api from "./api";


export default async function  useDashboard  (){
    const response = (await api.get('/sessao/usuario/dashboard')).data
    console.log(response);
    
    return  (response);
   
    
}   