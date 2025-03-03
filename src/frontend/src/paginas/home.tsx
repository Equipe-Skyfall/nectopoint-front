import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    },[]);

    return (
        <>
        <div className="overflow-hidden">
            <div className="text-center">
                <img src="/" alt="homeLogo"/>
                <h1>NectoPoint</h1>
            </div>
            <div className="flex">
                Conteúdo
            </div>
            <Link to='/user-page'>Ir para primeira página</Link>
        </div >
        </>
    );
}   