import { addTokenToHeaders } from "./tokenService";
import { apiBaseUrl, apiVersion } from './configCore';
import { json } from "react-router-dom";
// user -------------------------------------------------------------

const apiBase = apiBaseUrl + apiVersion

// Reusable function for making asynchronous API requests
// const fetchWithAuthHeaders = (url, headers) => {
const fetchWithAuthHeaders = (url, headers = {}) => {
    const updatedHeaders = addTokenToHeaders(headers);
    return fetch(url, { headers: updatedHeaders });
};

const usersLoader = () =>
    fetchWithAuthHeaders(`${apiBase}/user/all`);

const usersEmailLoader = async (email) => {
    const response = await fetchWithAuthHeaders(`${apiBase}/user/search?email=${email}`);
    const data = await response.json();
    console.log(data)
    return data;
}
const userProfileLoader = (userId) =>
    fetchWithAuthHeaders(`${apiBase}/user/info/${userId}`);

//const userProfileUpdateLoader = (userId) =>
//    fetchWithAuthHeaders(`${apiBase}/user/update/info/${userId}`);

const myProfileLoader = (userId) =>
    fetchWithAuthHeaders(`${apiBase}/user/info/me`);

const privateChatsLoader = () =>
    fetchWithAuthHeaders(
        `${apiBase}/chat/private/msg-recipients/`
    );

// chat -------------------------------------------------------------

const chatsLoader = () =>
    fetchWithAuthHeaders(`${apiBase}/chat/private/all`);

const messageLoader = (chatId) =>
    fetchWithAuthHeaders(
        `${apiBase}/chat/private/info/${chatId}`
    );

const messageLoader1_2 = async (chatId, page) => {
    const response = await fetchWithAuthHeaders(
        `${apiBase}/chat/private/info/messages/${chatId}?page=${page}` //&search_query=${searchQuery}&start_time=${startTime}&end_time=${endTime}`
    );
    const data = await response.json();
    console.log(data)
    return data.messages;
    //return response;
}

const messageLoader2 = async (chatId, page, searchQuery, startTime, endTime) => {
    let url = `${apiBase}/chat/private/info/messages/${chatId}?page=${page}`;

    if (searchQuery) {
        url += `&search_query=${searchQuery}`;
    }
    if (startTime) {
        url += `&start_time=${startTime}`;
    }
    if (endTime) {
        url += `&end_time=${endTime}`;
    }
    const response = await fetchWithAuthHeaders(url);
    const data = await response.json();
    console.log(data);
    return data;
};

// the following loaders are not directly being used in loader in react router
// thst's why these are async function

const authUserLoader = async () => {
    try {
        const response = await fetchWithAuthHeaders(
            `${apiBase}/chat/home`
        );
        // console.log(response)
        const user = await response.json();
        // console.log("auth user", user);
        return user;
    } catch (error) {
        console.error("Error fetching auth user:", error);
        throw error; // You can handle the error as needed
    }
};

const chatIdLoader = async (userId) => {
    /*
    // Make an HTTP POST request to create a new user
    fetch(`${apiBase}/user/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Send user data to the server
    })
        .then((response) => {
            if (response.status === 422) {
                // Validation error, email already in use
                return response.json().then((errorResponse) => {
                    console.log("Validation Failed:", errorResponse);
                    // Handle the error response on the client side
                });
            }
            if (response.status === 200) {
                // User created successfully
                return response.json().then((userResponse) => {
                    console.log("User Created:", userResponse);
                    // Handle the successful user creation response
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            // Handle other errors (e.g., network issues)
        });
    */

    try {
        const response = await fetchWithAuthHeaders(
            `${apiBase}/chat/private/recipient/chat-id/${userId}`
        );

        console.log(response);

        if (response.status === 404) {
            return null;
        } else if (response.status === 200) {
            const data = await response.json();
            // console.log('data.chat_id', data.chat_id);
            return data.chat_id;
        }
    } catch (error) {
        console.error("Error fetching chat ID:", error);
        throw error; // You can handle the error as needed
    }
};
// const chatIdLoader = async (userId) => {
//     try {
//         const response = await fetchWithAuthHeaders(
//             `${apiBase}/chat/private/recipient/chat-id/${userId}`
//         );
//         const data = await response.json();
//           console.log(data.chat_id)
//         return data.chat_id;
//     } catch (error) {
//         console.error("Error fetching chat ID:", error);
//         throw error; // You can handle the error as needed
//     }
// };

const newChatIdLoader = async (userId) => {
    console.log('newChatIdLoader', userId)
    try {
        const response = await fetchWithAuthHeaders(
            `${apiBase}/chat/private/recipient/create-chat/${userId}`
        );
        const data = await response.json();
        console.log(data)
        return data.chat_id;
    } catch (error) {
        console.error("Error fetching chat ID:", error);
        throw error; // You can handle the error as needed
    }
};



const userProfileUpdateLoader = async (userId, token, updatedData) => {
    try {
        const response = await fetch(`${apiBase}/user/update/info/${userId}`, {
            // Correct the request method here
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            method: "PUT",
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error("Error updating user profile");
        }
        //console.log(response)
        return response;
    } catch (error) {
        console.error("Error fetching user profile update:", error);
        throw error;
    }
};

export {
    authUserLoader,
    chatsLoader,
    messageLoader,
    messageLoader2,
    privateChatsLoader,
    usersLoader,
    userProfileLoader,
    myProfileLoader,
    chatIdLoader,
    newChatIdLoader,
    userProfileUpdateLoader,
    usersEmailLoader
};
