import React, { useState, useEffect } from "react";
import { Avatar, IconButton }  from "@material-ui/core";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import "./Sidebar.css";
import { SearchOutlined } from "@material-ui/icons";
import SidebarChat from "./SidebarChat";
import database from "./firebase";
import { useStateValue } from "./StateProvider";

function SideBar() {

    const [rooms, setRooms] = useState([]);
    const [{ user }, dispatch] = useStateValue();
    const [logout, setLogout] = useState(false);
    const [sidebarSearch, setSidebarSearch] = useState(false);
    const [search, setSearch] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const matcher = (s, values) => {
        const re = RegExp(`.*${s.toLowerCase().split("").join(".*")}.*`);
        return values.filter((v) => v.data.name.toLowerCase().match(re));
    };

    useEffect(() => {
        // Everytime the DB gets updated, take the latest snapshot
        const unMount = database.collection("rooms").onSnapshot((snapshot) =>
            setRooms(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                }))            
            )
        );

        //return function will be called on component unmount
        return () => {
            unMount();
        }
    }, []);

    // Every time the searchInput changes, perform the Search Functionality
    useEffect(() => { 
        if(rooms.length > 0) {
            setSearch(matcher(searchInput, rooms));
        }
        if(searchInput === "") {
            setSidebarSearch(false);
        }
    }, [searchInput]);

    // Run this method if the input value in the search bar is changed
    const handleChange = (e) => {
        setSidebarSearch(true);
        setSearchInput(e.target.value);
    }

    // Log out when exit icon is clicked
    const exitApp = () => {
        localStorage.removeItem("uid");
        window.location.reload();
        setLogout(true);
    }

    return (
        <div className="sidebar">
          
          <div className="sidebar__header">
            <Avatar src={user?.photoURL}/>
            <div className="sidebar__headerRight">
                <IconButton>
                    <DonutLargeIcon />
                </IconButton>

                <IconButton>
                    <ChatIcon />
                </IconButton>
                
                <div onClick={exitApp}>
                    <IconButton>
                        <ExitToAppIcon />
                    </IconButton>            
                </div>                    
            </div>      
          </div>

          <div className="sidebar__search">
              <div className="sidebar__searchContainer">
                  <SearchOutlined />
                  {/* <Input className="sidebar__searchbar" placeholder="Search or start new chat" inputProps={{ 'aria-label': 'description' }} /> */}
                  <input 
                    placeholder="Search or start a new chat"
                    value = {searchInput}
                    type="text"
                    onChange={handleChange}
                  />
              </div>       
          </div>

          {sidebarSearch ? (
            <div className="sidebar__chats">
                <SidebarChat addNewChat/>

                {/* Display the room which matches the search input */}
                {search.map((room) => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>
          ): (
            <div className="sidebar__chats">
                <SidebarChat addNewChat/>

                {/* Display each room from the database */}
                {rooms.map((room) => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>
          )}

          <div className="sidebar__footer">
              <p>&copy; Preyansh Kachhia {new Date().getFullYear()}</p>
          </div>
        </div>
    )
}

export default SideBar