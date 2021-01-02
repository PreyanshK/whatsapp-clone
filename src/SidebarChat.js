import React , { useState, useEffect } from 'react';
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import database from './firebase';
import { Link } from "react-router-dom";

function SidebarChat({ id, name, addNewChat }) {
    
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");

    // Every time this component loads, a random number will be generated
    //This value will be assigned to the "seed" for the Avatar Image
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        if (id) {
            database.collection("rooms")
            .doc(id)
            .collection("messages")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => (
                setMessages(snapshot.docs.map((doc) =>
                doc.data()))
            ))
        }
    }, [id]);

    const createNewChat = () => {
        const chatName = prompt("Please enter a name for a chat room");

        if(chatName) {
            // Using the entered name, add the new chat into the database
            //Automatically display this new chat in the side chat bar
            database.collection("rooms").add({
                name: chatName,
            })
        }
    }


    if (addNewChat) {
        return (
            <div onClick={createNewChat} className="sidebarChat sidebarChat__newChat">                  
                <GroupAddIcon  style={{fill: "white"}}/>
                <div className="sidebarChat__newChat_text">
                    <h2>New Chat</h2>
                </div> 
            </div>
        )

    } else {
        
        return (
            <Link to={`/rooms/${id}`}>    
                <div className="sidebarChat">
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/> 
                    <div className="sidebarChat__info">
                        <h2>{name}</h2>
                        <p>
                            {id !== "" && messages.length > 0
                                ? messages[0]?.message
                                : "Start a new chat ..." 
                            }
                        </p>
                    </div> 
                </div>
            </Link>
        )
    }
}

export default SidebarChat
