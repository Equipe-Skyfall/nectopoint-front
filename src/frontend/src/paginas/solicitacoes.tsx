import React from 'react';
import ConteudoSolicitacoes from "../componentes/conteudoPaginas/solicitacoes/conteudoSolicitacoes";
import Navbar from '../componentes/navbar/navbar';

export default function Solicitacoes() {
  return (
    <div className="Solicitacoes">
      <Navbar />
      <ConteudoSolicitacoes />
    </div>
  );
}