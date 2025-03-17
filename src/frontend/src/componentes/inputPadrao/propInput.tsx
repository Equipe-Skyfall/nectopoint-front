export default interface propsInput {
    placeholder: string;
    length: number;
    pattern: string;
    id: string;
    type?: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}