import DashboardGestor from "../../Dashboard/dashboardGestor";
import Data from "../../hooks/data";
import { FaBell } from "react-icons/fa";

export default function homeGestor() {


    return (
        <>
            <div className="overflow-hidden pt-20 flex flex-col">
                <Data />
                
                <DashboardGestor/>
            </div>
        </>
    );
}  