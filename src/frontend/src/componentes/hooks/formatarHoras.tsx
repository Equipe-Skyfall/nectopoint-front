export default function formatarMinutosEmHorasEMinutos(minutosTotais: number): string {
    let negativo = "";
    if (minutosTotais < 0) {
      minutosTotais = -minutosTotais;
      negativo = "-";
    }

    const horas = Math.floor(minutosTotais / 60);
    const minutos = minutosTotais % 60;
  
    return `${negativo + String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
  }
  