import React from "react";
import propsInput from "./propInput";

export default function InputPadrao(props: propsInput) {
    const { placeholder, length, pattern, id, type = "text", value, onChange } = props;

    return (
        <input
            type={type} // Use o tipo passado como prop (ou "text" como padrão)
            id={id}
            maxLength={length}
            required
            pattern={pattern}
            value={value} 
            onChange={onChange} 
            className="text-gray-800 bg-zinc-200 rounded-xl sm:w-80 p-3 mx-auto my-3 br text-center"
            placeholder={placeholder}
        />
    );
}