import {React, useEffect, useState, useRef} from 'react'
import './chat.css'
import images from '../../constants/images'
import EmojiPicker from 'emoji-picker-react'
import { onSnapshot, doc, arrayUnion, updateDoc, getDoc} from 'firebase/firestore';
import { db } from '../../firebaseconfig';
import useChatStore from '../../constants/chatStore';
import useUserStore from '../../constants/userStore';
import upload from '../../constants/upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser} = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        setChat(res.data());
      }
    );
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if(e.target.files[0]){
      setImg({
      file:e.target.files[0],
      url: URL.createObjectURL(e.target.files[0])
    })
    }
  };

  const handleSend = async () =>
    {
    if (text === "") return;
    try {
      let imgUrl = null
      if(img.file){
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach( async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true:false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
        }
      })
    } catch (err) {
      console.log("Error sending message:", err);
    }

    setImg({
      file: null,
      url: "",
    });
    setText("");
  };

  return (
    <div className='chat'>
      <div className='top'>
        <div className='user'>
          <img src={user?.avatar || images.AvatarIcon} alt='' />
          <div className='texts'>
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        <div className='icons'>
          <img src={images.PhoneIcon} alt='' />
          <img src={images.VideoIcon} alt='' />
          <img src={images.InFoIcon} alt='' />
        </div>
      </div>
      <div className='center'>
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
            <div className='texts'>
              {message.img && <img src={message.img} alt='' />}
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {img.url && (
          <div className='message own'>
          <div className='texts'>
            <img src={img.url} alt=''/>
          </div>
          </div>
          )}
        <div ref={endRef}></div>
      </div>
      <div className='bottom'>
        <div className='icons'>
          <label htmlFor='file'>
            <img src={images.img} alt='' />
          </label>
          <input type='file' id='file' style={{display: "none"}} onChange={handleImg}/>
          <img src={images.CameraIcon} alt='' />
          <img src={images.MicIcon} alt='' />
        </div>
        <input
          type='text'
          placeholder= {(isCurrentUserBlocked || isReceiverBlocked) ?'Khong the gui tin nhan':'Type a message...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className='emoji'>
          <img
            src={images.EmojiIcon}
            alt=''
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className='picker'>
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className='sendButton'
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >Send</button>
      </div>
    </div>
  );
}

export default Chat