import { useEffect, useState } from "react";
import api from "./api";


export default async function  useDashboard  (){

    return  (await api.get('/sessao/usuario/dashboard')).data;
   
    
}   