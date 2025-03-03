import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Dados from "../../../interfaces/interfaceDados";

const BuscarDados = () => {
    const { data = [], isLoading, isError, refetch } = useQuery<Dados[]>({
        queryKey: ['chave-para-refetch'],
        queryFn: async () => {
            try {
                const response = await axios.get(`https://api.restful-api.dev/objects`);
                console.log(response.data)
                return response.data || [];
            } catch (error) {
                if (axios.isAxiosError(error)) {

                    const errorResponse = error.response;
                    console.error('Error status:', errorResponse?.status);

                } else {
                    console.error('An unknown error occurred:', error);
                }
                throw error;
            }
        },
        retry: false,
    });

    return {
        dados: data,
        isLoading,
        isError,
        refetch,
    };
};

export default BuscarDados;