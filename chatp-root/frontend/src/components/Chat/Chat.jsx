import React from "react";
import ActiveLink from "../ActiveLink/ActiveLink";

const Chat = ({ chat }) => {
    const { recipient_id, chat_id } = chat;
    return (
        <div className="flex flex-col justify-center mb-1 w-full">
            {/* <div className="flex flex-col my-2 h-20 w-full justify-center bg-slate-100 border border-blue-500 rounded-md"> */}
            <ActiveLink to={`/cp/chat/private/${chat_id}`}>
                <div className="h-[80px]">
                    <p className="text-xs">Chat with: {recipient_id}</p>
                    <small className="text-xs">Chat id: {chat_id}</small>
                </div>
            </ActiveLink>
        </div>
    );
};

export default Chat;