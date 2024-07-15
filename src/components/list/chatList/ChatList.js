import React, { useState, useEffect, useRef } from 'react';
import './chatList.css';
import { images } from '../../../constants/index';
import AddUser from './addUser/AddUser';
import useUserStore from '../../../constants/userStore';
import useChatStore from '../../../constants/chatStore';
import { onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseconfig';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const addUserRef = useRef(null);

  const { currentUser } = useUserStore();
  const {chatId, changeChat } = useChatStore();

  console.log(chatId)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addUserRef.current && !addUserRef.current.contains(event.target)) {
        setAddMode(false);
      }
    };

    if (addMode) {
      document.addEventListener('mouseup', handleClickOutside);
    } else {
      document.removeEventListener('mouseup', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [addMode]);

  const toggleAddMode = (event) => {
    event.stopPropagation();
    setAddMode((prev) => !prev);
  };


  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();
        return { ...item, user };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const {user, ...rest} = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try{
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId,chat.user)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchBar'>
          <img src={images.SearchIcon} alt='' />
          <input type='text' placeholder='Search' />
        </div>
        <img
          src={addMode ? images.MinusIcon : images.PlusIcon}
          alt=''
          className='add'
          onClick={toggleAddMode}
        />
      </div>
      {chats.map((chat) => (
        <div 
          className='item'
          key={chat.chatId}
          onClick={()=>handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img src={chat.user.avatar||images.AvatarIcon} alt='' />
          <div className='texts'>
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && (
        <div ref={addUserRef}>
          <AddUser />
        </div>
      )}
    </div>
  );
};

export default ChatList;
