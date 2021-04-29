/**
 * 用户相关
 */

import request from '@/utils/request'
// 使用 Vuex 必须先加载
// import store from '@/store'

// 登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

// 获取短信验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

// 获取用户自己信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 获取用户频道列表
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
// 传递关注用户的 id
// **2021-2-8 关注功能已经不能实现 接口已失效**
export const followings = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data
  })
}

// 取消关注用户
// 取消关注人的 id
// **2021-2-8 关注功能已经不能实现 接口已失效**
export const cancelFollowings = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 编辑用户个人资料
export const changeUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}

// 编辑用户照片资料（头像）
export const changeUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
