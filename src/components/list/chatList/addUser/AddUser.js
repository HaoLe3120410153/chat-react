import React, { useState } from 'react';
import { collection, query, where, getDocs, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../firebaseconfig';
import images from '../../../../constants/images';
import { doc, setDoc} from 'firebase/firestore';
import './addUser.css'
import useUserStore from '../../../../constants/userStore';
const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      console.log(newChatRef.id);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type='text' placeholder='UserName' name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className='user'>
          <div className='detail'>
            <img src={user.avatar || images.AvatarIcon} alt='' />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
