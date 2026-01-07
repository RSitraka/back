import {
    IoHome,
} from "react-icons/io5";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { FaBuilding } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const nexellRed = "text-[#C62828]";
    const nexellText = "text-[#555555]";
    const nexellIcon = "text-[#208060]";
    const hoverEffect = `
        hover:bg-gradient-to-r hover:from-[#208060] hover:to-[#6090A0] 
        hover:text-white hover:shadow-md
        group transition-all duration-300 ease-in-out rounded-lg
    `;

    const itemContainer = `cursor-pointer flex gap-2 px-4 py-2 items-center text-sm font-bold ${nexellText} ${hoverEffect}`;

    return (
        <div className="w-full backdrop-blur-md bg-white/80 border-b border-[#555555]/10 shadow-sm px-6 py-3 flex flex-row items-center justify-between">            
            
            <div className="flex flex-col cursor-pointer" onClick={() => navigate("/")}>
                <h2 className={`text-2xl font-extrabold tracking-tight ${nexellRed}`}>
                    nexell
                </h2>
                <span className="text-[0.6rem] font-semibold tracking-widest text-[#555555] opacity-80 hidden lg:block">
                    NEXT EVOLUTION FOR EXCELLENCY
                </span>
            </div>

            <div className="flex flex-row gap-2 items-center overflow-x-auto">
                <div
                    onClick={() => navigate("/")}
                    className={itemContainer}>
                    <IoHome className={`${nexellIcon} group-hover:text-white text-lg transition-colors`} />
                    <span className="hidden md:block">Accueil</span>
                </div>

                <div
                    onClick={() => navigate("/sites")}
                    className={itemContainer}>
                    <FaBuilding className={`${nexellIcon} group-hover:text-white text-lg transition-colors`} />
                    <span className="hidden md:block">Sites & Travaux</span>
                </div>

                <div
                    onClick={() => navigate("/employé")}
                    className={itemContainer}>
                    <FaUsers className={`${nexellIcon} group-hover:text-white text-lg transition-colors`} />
                    <span className="hidden md:block">Employés</span>
                </div>

                <div
                    onClick={() => navigate("/matériaux")}
                    className={itemContainer}>
                    <FaUsers className={`${nexellIcon} group-hover:text-white text-lg transition-colors`} />
                    <span className="hidden md:block">Matériaux</span>
                </div>

                <div
                    onClick={() => navigate("/dashboard")}
                    className={`${itemContainer}`} >
                    <RiDashboardHorizontalFill className={`${nexellIcon} group-hover:text-white text-lg transition-colors`} />
                    <span className="hidden md:block">Tableau de bord</span>
                </div>
            </div>
        </div>
    )
}
export default Navbar