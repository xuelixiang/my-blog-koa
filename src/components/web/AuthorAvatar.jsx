import React from 'react'
import avatar from '@/assets/author_avatar.jpg'
import { Avatar } from 'antd'

const AuthAvatar = ({ size = 'default' }) => {
  return <Avatar src={avatar} size={size} />
}

export default AuthAvatar
