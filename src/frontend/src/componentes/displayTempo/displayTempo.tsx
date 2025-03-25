type propsDisplayTempo = {
    img: string;
    hora: string;
    cor: string;
    
}
export default function DisplayTempo(props: propsDisplayTempo){
    const {img,hora,cor} = props;
    let horario = hora[0]+hora[1]+":"+hora[2]+hora[3];
    return (
        // Cria input padrao com placeholder, tamanho máximo e padrão de caracteres (Como props)
            <div className={`flex items-center bg-${cor}  rounded-xl text-center w-64 justify-between mx-auto px-2 my-2`}>
                <img src={img}  className="w-8 h-8 m-2 p-1"></img>
                <p className="text-center poppins align-middle  px-2  ">{horario}</p>
            </div>

    );
}   