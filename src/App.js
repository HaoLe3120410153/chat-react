import {React, useEffect} from 'react'
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import List from './components/list/List';
import Login from './components/login/Login';
import Notification from './components/notification/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import useUserStore from './constants/userStore';
import useChatStore from './constants/chatStore';
import { auth} from './firebaseconfig';


const App = () => {
  const {currentUser, isLoading, fetchUserInfo} = useUserStore();
  const {chatId} = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List/>
            {chatId && <Chat/>}
            {chatId && <Detail/>}
          </>
        ) : (
          <Login />
        )
      }
      <Notification/>
    </div>
  )
}

export default App
