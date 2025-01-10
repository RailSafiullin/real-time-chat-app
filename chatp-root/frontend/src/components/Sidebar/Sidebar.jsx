import React from "react";
import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";

const Sidebar = ({ username }) => {
    const menuItems = [
        { name: "Чаты", path: "/cp/chat" },
        { name: "Профиль", path: "/cp/me" },
        //{ name: "Группы", path: "/cp/groups" },
        { name: "Пользователи", path: "/cp/users" },
        { name: "Настройки", path: "/cp/settings" },
    ];
    
    return (
        // <div className="flex flex-row lg:flex-col w-full lg:w-[150px] justify-between text-white bg-gray-800 lg:h-screen lg:top-0 lg:left-0">
        <div className="flex flex-row lg:flex-col text-white justify-between bg-indigo-900 lg:overflow-y-auto lg:h-screen lg:top-0 lg:left-0 p-2">
            <div className="p-4 items-center">
                <h1 className="text-2xl font-bold">ChatP</h1>
            </div>

            {/* Menu Items */}
            <div className="lg:ml-4 flex items-center lg:items-start ">
                <ul className="flex lg:flex-col lg:items-start">
                {menuItems.map((item, index) => (
                        <li key={index} className="mr-2 lg:my-2 ">
                            <Link
                                to={item.path}
                                className="block py-2 px-4 rounded-md bg-gray-800 hover:bg-gray-900 transition-colors duration-200 hover:text-amber-400"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <div className="px-4">
                    <h1 className="block py-2 px-4 rounded-md text-xl font-bold">{username}</h1>
                </div>
                {/* <h1 className="text-sm font-bold">Profile Photo</h1> */}
                <Logout />
            </div>
        </div>
    );
};

export default Sidebar;
