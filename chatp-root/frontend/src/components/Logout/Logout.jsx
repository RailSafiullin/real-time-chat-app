import React from "react";
import { removeToken } from "../../utilities/tokenService";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        removeToken();
        navigate("/");
    };
    return (
        <button className="block py-2 px-4 rounded-md bg-gray-800 rounded-md bg-gray-800 ml-4 mb-6 hover:bg-gray-900 transition-colors duration-200 hover:text-amber-400 text-white" onClick={handleLogoutClick}>
            <h1 className="text-l font-bold">Log out</h1>
        </button>
    );
};

export default Logout;
// 