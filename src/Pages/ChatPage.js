import React ,{useState}from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";


const ChatPage = ()=>{
    const [selectedUser, setSelectedUser] = useState(null);
    console.log('gggggg');


    return(
        <div style={{display:'flex',  height: '100vh'}}>
        <Sidebar onUserSelect={setSelectedUser} />
        <ChatWindow selectedUser={selectedUser}/>
        </div>
    )
    
}

export default ChatPage;