import React, { useState, useEffect } from 'react';
import "./Chat.css";
import  { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, SearchOutlined} from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoodIcon from '@material-ui/icons/Mood';
import MicIcon from '@material-ui/icons/Mic';
import { useParams } from "react-router-dom";
import database from "./firebase";
import firebase from "firebase";
import { useStateValue } from "./StateProvider";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

function Chat() {

    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    const [emoji, setEmoji] = useState(false);

    // Every time roomId changes, a random number will be generated
    //This value will be assigned to the "seed" for the Avatar Image
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    //Perform this everytime the roomId changes, the room Name should change
    //to the chat that was clicked from the side bar
    useEffect(() => {
        if(roomId) {
            //set the roomName to the name of the chat that was clicked
            //To do this fetch from the DB > use the roomId
            database.collection("rooms")
            .doc(roomId)
            .onSnapshot((snapshot) => 
                setRoomName(snapshot.data().name));

            database.collection("rooms")
            .doc(roomId)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) =>
                setMessages(snapshot.docs.map((doc) => doc.data()))
            );
        }
    }, [roomId]);

    const addEmoji = (e) => {
        let chosenEmoji = e.native;
        setInput(input + chosenEmoji);
    };

    const closeEmojiPicker = () => {
        if(emoji) {
            setEmoji(false);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        console.log("You typed >>>", input);

        // add the message entered into the database
        // assign the server timestamp, to display the time based on the user's time zone
        database.collection("rooms").doc(roomId).collection("messages").add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        setInput("");
    };

    return (
        
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>

                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    {/* last seen will be the timestamp from the last message */}
                    <p>
                        Last seen{" "}
                        {messages.length !== 0 
                        ? new Date(
                            messages[messages.length - 1]?.
                            timestamp?.toDate())
                            .toLocaleString()
                        : "unknown. Please enter a message."}
                    </p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message) => (
                    <p className={`chat__message ${message.name === user.displayName && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message}
                        <span className="chat__timestamp">
                            {new Date(message.timestamp?.toDate()).toLocaleString()}
                        </span>
                    </p>
                ))}
            </div>

            <div className="chat__footer">
                <IconButton>
                    <MoodIcon 
                    className="chat__emojiIcon" 
                    onClick={ () => setEmoji(!emoji)}
                    />
                    {emoji ? <Picker onSelect={addEmoji} /> : null}
                </IconButton>

                <form>
                    <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    onClick={closeEmojiPicker} 
                    placeholder="Type a message" 
                    type="text" 
                    />
                    <button onClick={sendMessage} type="submit">Send</button>
                </form>

                <IconButton>
                    <MicIcon /> 
                </IconButton>
            </div>
        </div>
    )
}

export default Chat