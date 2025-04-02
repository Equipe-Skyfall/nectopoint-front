
type Display = {
    entrada: string;
    ultimo_ponto: {tipo_ponto: any, up_hora: any};
    banco_de_horas: number;
    intervalo: Boolean;
}
export default function DisplayTempo(props : Display ){

    
    const {entrada, ultimo_ponto, banco_de_horas, intervalo} = props;
    console.log(props);
    
    const formatarTempo = (tempo: string) => {
        // Formata a string de tempo para o formato HH:MM
        //e subtrai 3 horas para o fuso horário
        
        let temposubtraido= Date.parse(tempo) - 10800000
        const tempofinal = new Date(temposubtraido).toISOString() 
        const tempoFormatado = (`${(tempofinal.split("T")[1].split(":")[0])}`) + ":" + (tempofinal).split("T")[1].split(":")[1]
        
        
        return tempoFormatado
    }

    
    return (
        <>
                    
            
                <div>
                <span className="flex w-64 justify-between grid grid-cols-2 gap-2">
                <div className={`flex items-center rounded-xl text-center w-auto p-2 justify-center ${!intervalo ? "bg-gray-500" : "bg-orange-900"}`}>
                <img src={!intervalo ? "./almoco.png" : "./fimalmoco.png"}  className="w-11 h-11 m-1 p-1"></img>
                </div>
                <span className='flex items-center bg-blue-600 rounded-xl text-center w-auto   p-2'> <img src='./time-left.png'  className="w-8 h-8 m-2 p-1"></img><p className={'text-white poppins'}> {banco_de_horas/60}h</p></span>
                
                </span>
                </div>
                
                
                {
                    //Se a entrada for diferente de nulo, exibe a entrada
                    entrada !== null||''||undefined ? 
                    <div className={`flex items-center bg-primarygreen rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                    <img src={'./setadir.png'}  className="w-8 h-8 m-2 p-1"></img>
                    <p className="text-center poppins align-middle  px-2  ">{entrada != null||''||undefined ? formatarTempo(entrada):''}</p>
                </div> : ''
                }
               
                {
                    //Se ultimo ponto for diferente de nulo, exibe a saida
                    ultimo_ponto.up_hora !== null||''||undefined ? 
                    <>{
                        ultimo_ponto.tipo_ponto == 'SAIDA'?  <>
                        <div className={`a flex items-center bg-primaryred rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                            <img src={'./setaesq.png'}  className="w-8 h-8 m-2 p-1"></img>
                            <p className="text-center poppins align-middle  px-2  ">{ultimo_ponto.up_hora !== null||''||undefined ? formatarTempo(ultimo_ponto.up_hora):''}</p>
                        </div> 
                    </>
                    :   
                    <div className={` flex items-center bg-primarygreen rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                    <img src={'./setadir.png'}  className="w-8 h-8 m-2 p-1"></img>
                    <p className="text-center poppins align-middle  px-2  ">{ultimo_ponto.up_hora !== null||''||undefined ? formatarTempo(ultimo_ponto.up_hora):''}</p>
                    </div> 
                       
                    }:
                   
                    </>:''

                }
        </>
    );
}   