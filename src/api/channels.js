/**
 * 频道相关
 */

import request from '@/utils/request'

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 批量修改用户频道列表
// **注：2021.2.6 该操作已失效 接口已经不能用**
export const addUserChannel = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}

// 删除指定用户频道
// **注：2021.2.6 该操作已失效 接口已经不能用**
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
