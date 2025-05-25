import React from 'react';
import ConteudoSolicitacoes from "../../componentes/conteudoPaginas/solicitacoes/conteudoSolicitacoes";
import Navbar from '../../componentes/navbar/navbar';
import HistoricoSolicitacoes from '../../componentes/conteudoPaginas/solicitacoes/historicoSolicitacoes';

export default function SolicitacoesHistorico() {
  return (
    <div className="SolicitacoesHistorico">
      <Navbar />
      <HistoricoSolicitacoes />
    </div>
  );
}