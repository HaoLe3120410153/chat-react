import React from 'react'
import './detail.css'
import { auth} from '../../firebaseconfig';
import images from '../../constants/images'

const Detail = () => {
  return (
    <div className='detail'>
      <div className='user'>
        <img src={images.AvatarIcon} alt=''/>
        <h2>Jane Doe</h2>
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
        <button>Block User</button>
        <button className='logout' onClick={() =>  auth.signOut()}>Log Out</button>
      </div>
    </div>
  )
}

export default Detail