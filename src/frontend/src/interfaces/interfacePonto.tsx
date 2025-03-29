import TipoPonto from './interfaceTipoPonto';
export default interface Ponto {
    tipo_ponto: TipoPonto; // Assuming TipoPonto is an enum or type defined elsewhere
    data_hora: Date; // Using Date instead of Instant
    tempo_entre_pontos: number | null; // Allowing null since it wasn't annotated as @NotNull in the original
}