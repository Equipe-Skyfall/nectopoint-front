import propsInput from "./propInput";
export default function InputPadrao(props: propsInput) {
    const {placeholder, length, pattern, id} = props;

    return (
        // Cria input padrao com placeholder, tamanho máximo e padrão de caracteres (Como props)
            <input  type="text" id={id} maxLength={length} required pattern={pattern} className=" text-black  bg-zinc-200 rounded-xl w-72 p-2 mx-auto my-2 br" placeholder={placeholder} />       
    );
}   