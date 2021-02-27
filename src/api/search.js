/**
 * 搜索模块
 */

import request from '@/utils/request'

// 获取全部频道列表
export const getSearchSuggestions = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}

// 获取搜索结果
export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: 'app/v1_0/search',
    params
  })
}

// 获取用户搜索历史
export const getUserHistories = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search/histories'
  })
}
