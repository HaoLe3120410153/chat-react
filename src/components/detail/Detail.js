import React from 'react'
import './detail.css'
import { auth, db} from '../../firebaseconfig';
import images from '../../constants/images'
import useChatStore from '../../constants/chatStore';
import useUserStore from '../../constants/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Detail = () => {
  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changBlock} =
  useChatStore();
  const {currentUser} = useUserStore();
  const handleBlock = async() => {
    if( !user) return;
    const userDocRef = doc(db, "users", currentUser.id)
    try{
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      })
      changBlock()
    }catch(err){console.log(err)}
  }

  return (
    <div className='detail'>
      <div className='user'>
        <img src={user?.avatar || images.AvatarIcon} alt=''/>
        <h2>{user?.username}</h2>
        <p>Alo</p>
      </div>
      <div className='info'>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <img src={images.ArrowUpIcon} alt=''/>
          </div>
        </div>

        <div className='option'>
          <div className='title'>
            <span>Privacy & help</span>
            <img src={images.ArrowUpIcon} alt=''/>
          </div>
        </div>

        <div className='option'>
          <div className='title'>
            <span>Shared photos</span>
            <img src={images.ArrowDownIcon} alt=''/>
          </div>
          <div className='photos'>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src={images.image} alt=''/>
                <span>photo_2024_2.png</span>
              </div>
              <img src={images.DownLoadIcon} alt='' className='icon'/>
            </div>
          </div>
          <div className='photos'>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src={images.image} alt=''/>
                <span>photo_2024_2.png</span>
              </div>
              <img src={images.DownLoadIcon} alt='' className='icon'/>
            </div>
          </div>
          <div className='photos'>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src={images.image} alt=''/>
                <span>photo_2024_2.png</span>
              </div>
              <img src={images.DownLoadIcon} alt='' className='icon'/>
            </div>
          </div>
          <div className='photos'>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img src={images.image} alt=''/>
                <span>photo_2024_2.png</span>
              </div>
              <img src={images.DownLoadIcon} alt='' className='icon'/>
            </div>
          </div>
        </div>

        <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <img src={images.ArrowUpIcon} alt=''/>
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked"
            : isReceiverBlocked
            ? "User blocked"
            : "Blocked User"
          }
        </button>
        <button className='logout' onClick={() =>  auth.signOut()}>Log Out</button>
      </div>
    </div>
  )
}

export default Detail