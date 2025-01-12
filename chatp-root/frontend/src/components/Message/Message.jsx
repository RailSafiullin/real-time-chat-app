import React, { useEffect, useState, useRef } from "react";
import Message from "../Message/Message";
import { useLoaderData, useLocation } from "react-router-dom";
import NoMessage from "../NoMessage/NoMessage";
import SendMessage from "../SendMessage/SendMessage";
import { getToken } from "../../utilities/tokenService";
import MessageBoxTop from "../MessageBoxTop/MessageBoxTop";


import { messageLoader2 } from "../../utilities/apiLoaders";

import axios from "axios";

import './CustomScrollbar_v2.css';

const Messages = () => {
    // Load data from API
    const chat = useLoaderData();

    //console.log(chat);

    // Data destructuring
    const { chat_id, type, messages, user_id, recipient_profile } = chat;
    const token = getToken();

    // Reference for the chat container
    const messageContainerRef = useRef(null);

    // Previous messages from Api
    const [previousMessages, setPreviousMessages] = useState([]);
    useEffect(() => {
        setPreviousMessages(messages);
    }, [messages]);

    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            setCurrentPage(1);
            const { messages: messages_load, has_next } = await messageLoader2(chat_id, 1, searchQuery, startTime, endTime);
            setPreviousMessages(messages_load);
            setHasNext(has_next);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const [clickedOnRecipient, setClickedOnRecipient] = useState(false);
    const handleRecipientProfileClick = () => {
        setClickedOnRecipient(true);
    };

    const [currentPage, setCurrentPage] = useState(1); // Optional for perceived page behavior
    const [hasNextPage, setHasNextPage] = useState(true); // Optional, assume messages exist initially
    const [isLoading, setIsLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const handleLoadMore = async () => {
        try {

            setIsLoading(true);
            const { messages: messages_load, has_next } = await messageLoader2(chat_id, currentPage + 1, searchQuery, startTime, endTime);
            setCurrentPage(currentPage + 1);
            //console.log(messages_load)
            //console.log(has_next)
            setHasNext(has_next);

            //console.log(messages)
            setPreviousMessages([...messages_load, ...previousMessages]);
            scrollToMessage(messages_load.length)

        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setIsLoading(false); // Clear loading state (optional)
        }
    };

    //--------------------------------------start handle SOCKET--------------------------------------------------
    // State to store the WebSocket instance
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        // const url = `ws://127.0.0.1:8000/ws/chat/${chat_id}`;
        const url = `ws://127.0.0.1:8000/ws/chat/${type}/${chat_id}/token=${token}`;

        // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
        // Create a WebSocket instance
        const newSocket = new WebSocket(url);

        newSocket.onopen = () => {
            console.log(`WebSocket connection established for ${chat_id}`);
        };

        newSocket.onmessage = (event) => {
            console.log(event);

            const parsedMessage = JSON.parse(event.data);
            console.log("Received Message:", parsedMessage);

            setPreviousMessages([...previousMessages, parsedMessage]);
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        setSocket(newSocket);

        return () => {
            // Clean up WebSocket when component unmounts
            console.log("WebSocket cleaned up.");
            newSocket.close();
        };
    }, [previousMessages]);

    // Handler to send a message
    const handleSendMesaage = (messageText) => {
        if (!messageText.trim()) {
            // Display an error message or alert to the user
            alert("Please enter a non-empty message.");
            return;
        }
        if (socket) {
            // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
            socket.send(messageText);
        }
    };

    //--------------------------------------end handle SOCKET--------------------------------------------------
    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight;
        }
    };
    //const handleScroll = (event) => {
    //    const { scrollTop, scrollHeight, offsetHeight } = event.target;
    //    if (scrollTop + offsetHeight <= scrollHeight-50 && !isLoading) {
    //        handleLoadMore();
    //    }
    //};


    const scrollToMessage = (messageIndex) => {
        if (messageContainerRef.current) {
            const targetMessage = messageContainerRef.current.childNodes[messageIndex];
            if (targetMessage) {
                messageContainerRef.current.scrollTop = targetMessage.offsetTop;
            }
        }
    };

    const globalStyles = `
    .custom-scrollbar {
        scrollbar-width: inherit;
        scrollbar-color: #00724c #f5f5f5;
        scroll-behavior: auto;
        
        
        ::-webkit-scrollbar-track {background-color: #f5f5f5;}
        ::-webkit-scrollbar-thumb {
            background-color: #005218;
            border-radius: 20px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }
        ::-webkit-scrollbar-thumb:hover {background-color: #00724c;}    
        ::-webkit-scrollbar-corner {background-color: #f5f5f5;}
    }
`;

    // Inject the global styles
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(globalStyles);
    document.adoptedStyleSheets = [sheet];

    return (
        <div className="">
            {/* <div className="grid grid-cols-1 border border-r-slate-200 bg-white content-end h-screen"> */}
            < div className="flex flex-col border border-r-slate-200 bg-white content-end h-screen" >
                {/* <div className="grid grid-cols-1 bg-gradient-to-t from-cyan-700 to-blue-800 content-end h-screen"> */}
                <div>
                    <MessageBoxTop
                        recipientData={recipient_profile}
                        handleRecipientProfileClick={
                            handleRecipientProfileClick
                        }
                    />
                </div >
                <div
                    ref={messageContainerRef}
                    className="flex flex-col h-full center overflow-y-auto custom-scrollbar "
                >
                    {
                        hasNext ?
                            <button onClick={handleLoadMore} disabled={isLoading}>{isLoading == true ? "Загрузка" : "Загрузить больше"}</button>
                            : <></>}
                    {/* max-h-80vh for 80% of view height*/}
                    {
                        previousMessages.length !== 0 ? (
                            previousMessages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message}
                                    currentUserId={user_id}
                                />
                            ))
                        ) : (
                            <NoMessage />
                        )
                    }
                </div >
                <div className="bg-white border-t-1 sticky rounded-lg bottom-0 ">
                    <div className="flex flex-row ">
                        <button onClick={() => setIsSearchVisible(!isSearchVisible)}
                            style={{ paddingLeft: "10px" }}>
                            {isSearchVisible ? (
                                <span className="flex justify-end">
                                    <h4 style={{ fontSize: "24px", cursor: "pointer" }}></h4> &#9664;
                                </span>
                            ) : (
                                <span>
                                    <p>Поиск</p>
                                </span>
                            )}
                        </button>
                        {isSearchVisible && (
                            <div className="flex flex-col justify-between items-center">
                                <div className="flex flex-row justify-between items-center">
                                    <input
                                        type="text"
                                        placeholder="Поиск..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <label htmlFor="start-time" style={{ paddingRight: "10px" }}>От:</label>
                                    <input
                                        id="start-time"
                                        type="datetime-local"
                                        placeholder="Выберите начальное время"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <label htmlFor="end-time" style={{ paddingRight: "10px" }}>До:</label>
                                    <input
                                        id="end-time"
                                        type="datetime-local"
                                        placeholder="Выберите конечное время"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex flex-row justify-end">
                                    <button onClick={handleSearch} disabled={isLoading} style={{ paddingRight: "30px" }}>
                                        {isLoading ? "Поиск..." : "Найти"}
                                    </button>
                                    <button onClick={() => {
                                        setSearchQuery("");
                                        setStartTime("");
                                        setEndTime("");
                                    }}>
                                        Сбросить
                                    </button>
                                </div>
                            </div>)}
                    </div>
                    <SendMessage
                        handleSendMesaage={handleSendMesaage}
                    />
                </div>
            </div >
        </div >
    );
};

export default Messages;
