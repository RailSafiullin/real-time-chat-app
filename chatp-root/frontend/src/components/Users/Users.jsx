import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import User from "../User/User";
import axios from "axios";
import { usersEmailLoader } from "../../utilities/apiLoaders";
const Users = () => {
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState([]);

    const handleSearch = async () => {
        try {
            console.log("!!!!!!!!!!users:");
            const response = await usersEmailLoader(searchInput)
            setUsers(response);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    

    return (
        <div className="flex flex-row h-screen">
            <div className="flex flex-col w-2/5 border">
                <div className="sticky top-0 mx-3">
                    <div>
                        <input
                            className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md my-3 py-2 px-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            placeholder="Найти по email..."
                            type="text"
                            name="search"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <button className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2 rounded-xl transition duration-300"
                        onClick={handleSearch}>Найти</button>
                    </div>
                </div>
                <div className="flex flex-col mx-3 mb-3 overflow-y-auto">
                    {users.map((user) => (
                        <User key={user.id} user={user} />
                    ))}
                </div>
            </div>
            <div className="w-full">
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Users;
