import React from 'react'
import './userInfo.css'
import images from '../../../constants/images'
import useUserStore from '../../../constants/userStore'


const UserInfo = () => {

  const {currentUser} = useUserStore();

  return (
    <div className='userInfo'>
      <div className='user'>
        <img src={currentUser.avatar || images.AvatarIcon} alt=''/>
        <h2>{currentUser.username}</h2>
      </div>
      <div className='icons'>
        <img src={images.MoreIcon} alt=''/>
        <img src={images.VideoIcon} alt=''/>
        <img src={images.EditIcon} alt=''/>
      </div>
    </div>
  )
}

export default UserInfo