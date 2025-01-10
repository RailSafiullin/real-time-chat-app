import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { chatIdLoader, newChatIdLoader, userProfileUpdateLoader } from "../../utilities/apiLoaders";
import { profileStyles, ulStyles, formStyles, inputStyles, buttonStyles, labelStyles } from "./MyProfileCSS"
import { getToken } from "../../utilities/tokenService";

const token = getToken();
const MyProfile = () => {
    const initialProfile = useLoaderData();
    const [profile, setProfile] = useState(initialProfile);

    const { first_name, last_name, email, username, phone, is_active, id } = profile;

    const [editing, setEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        id: id,
        first_name: first_name || "",
        last_name: last_name || "",
        email: email || "",
        username: username || "",
        phone: phone || "",
    });

    const handleInputChange = (e) => {
        setEditedProfile({
            ...editedProfile,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await userProfileUpdateLoader(id, token, editedProfile);

            if (response.ok) {
                const updatedProfile = await response.json();
                // You can update the profile state or display a success message
                setEditedProfile(updatedProfile);
                setProfile({ ...initialProfile, ...updatedProfile });
                console.log("Profile updated:", updatedProfile);
            } else {
                console.error("Error updating profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }

        setEditing(false);
    };
    const handleCancelClick = () => {
        setEditing(false);
        setEditedProfile({
            first_name,
            last_name,
            //email,
            username,
            phone,
        });
    };
    const profileItems = [
        {
            label: "First Name:",
            name: "first_name",
            value: editedProfile.first_name ?? "",
        },
        {
            label: "Last Name:",
            name: "last_name",
            value: editedProfile.last_name ?? "",
        },
        {
            label: "User Name:",
            name: "username",
            value: editedProfile.username,
        },
        {
            label: "Phone:",
            name: "phone",
            value: editedProfile.phone ?? "",
        },
    ];


    return (
        <div className="flex justify-center items-center h-screen">
            {editing ? (
                <form style={formStyles}>
                    {profileItems.map((item, index) => (
                        <div key={index}>
                            <label style={labelStyles}>{item.label}</label>
                            <input
                                type="text"
                                name={item.name}
                                value={item.value}
                                onChange={handleInputChange}
                                style={inputStyles}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleSaveClick} style={buttonStyles}>
                        Сохранить
                    </button>
                    <button type="button" onClick={handleCancelClick} style={buttonStyles}>
                        Отмена
                    </button>
                </form>
            ) : (
                <>
                    <div style={profileStyles}>
                        <ul style={ulStyles}>
                            <li><strong>UserID:</strong> {id}</li>
                            <li><strong>Логин:</strong> {username}</li>
                            <li><strong>Имя:</strong> {first_name}</li>
                            <li><strong>Фамилия:</strong> {last_name}</li>
                            <li><strong>Электронная почта:</strong> {email}</li>
                            <li><strong>Телефон:</strong> {phone}</li>
                            <li><strong>Статус:</strong> {is_active ? "Active" : "Not Active"}</li>
                        </ul>
                        <button type="button" onClick={handleEditClick} style={buttonStyles}>
                            Edit
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyProfile;
