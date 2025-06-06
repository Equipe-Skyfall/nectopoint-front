import formatarMinutosEmHorasEMinutos from "../hooks/formatarHoras";

type Display = {
    entrada: string;
    ultimo_ponto: { tipo_ponto: any, up_hora: any };
    banco_de_horas: number;
    intervalo: Boolean;
}
export default function DisplayTempo(props: Display) {


    const { entrada, ultimo_ponto, banco_de_horas, intervalo } = props;


    const formatarTempo = (tempo: string) => {
        // Formata a string de tempo para o formato HH:MM
        //e subtrai 3 horas para o fuso horário

        let temposubtraido = Date.parse(tempo) - 10800000
        const tempofinal = new Date(temposubtraido).toISOString()
        const tempoFormatado = (`${(tempofinal.split("T")[1].split(":")[0])}`) + ":" + (tempofinal).split("T")[1].split(":")[1]


        return tempoFormatado
    }
    console.log(formatarMinutosEmHorasEMinutos(528)); // "08:48"
    console.log(formatarMinutosEmHorasEMinutos(661)); // "09:01"
    console.log(banco_de_horas);
    
    return (
        <>


            <div>
                <span className=" w-full justify-between grid grid-cols-2 gap-2">
                    <div className={`flex items-center rounded-xl text-center w-auto p-2 justify-center ${!intervalo ? "bg-gray-500" : "bg-gradient-to-r from-red-900 to-orange-900"}`}>
                        <img src={!intervalo ? "./almoco.png" : "./fimalmoco.png"} className="w-11 h-11 m-1 p-1"></img>
                    </div>
                    <span className='flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-center w-auto p-2'>
                        <img src='./time-left.png' className="w-8 h-8 m-2 p-1"></img>
                        <p className={'text-white poppins'}> {formatarMinutosEmHorasEMinutos(banco_de_horas)}h</p>
                    </span>

                </span>
            </div>


            {
                //Se a entrada for diferente de nulo, exibe a entrada
                entrada !== null || '' || undefined ?
                    <>
                        <p className="poppins text-blue-900 mt-2">Primeira Entrada </p>
                        <div className={`flex items-center bg-gradient-to-r from-lime-600 to-green-600 rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                            <img src={'./setadir.png'} className="w-8 h-8 m-2 p-1"></img>
                            <p className="text-center poppins align-middle  px-2  ">{entrada != null || '' || undefined ? formatarTempo(entrada) : ''}</p>
                        </div>
                    </> : ''
            }

            {
                //Se ultimo ponto for diferente de nulo, exibe a saida
                ultimo_ponto.up_hora !== null || '' || undefined ?
                    <>
                        <p className="poppins text-blue-900 mt-2">Ultimo Ponto </p>
                        {
                            ultimo_ponto.tipo_ponto == 'SAIDA' ? <>
                                <div className={`a flex items-center bg-gradient-to-r from-rose-900 to-red-900 rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                                    <img src={'./setaesq.png'} className="w-8 h-8 m-2 p-1"></img>
                                    <p className="text-center poppins align-middle  px-2  ">{ultimo_ponto.up_hora !== null || '' || undefined ? formatarTempo(ultimo_ponto.up_hora) : ''}</p>
                                </div>
                            </>
                                :
                                <div className={` flex items-center bg-gradient-to-r from-lime-600 to-green-600 rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                                    <img src={'./setadir.png'} className="w-8 h-8 m-2 p-1"></img>
                                    <p className="text-center poppins align-middle  px-2  ">{ultimo_ponto.up_hora !== null || '' || undefined ? formatarTempo(ultimo_ponto.up_hora) : ''}</p>
                                </div>

                        }

                    </> : ''

            }
        </>
    );
}   