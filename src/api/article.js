/**
 * 文章相关
 */

import request from '@/utils/request'

// 获取频道新闻推荐
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}

// 获取新闻文章详情
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}

// 收藏文章
// **2021-2-8 收藏文章 已经不能实现 接口已失效**
export const collectionsArticle = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data
  })
}

// 取消收藏文章
// **2021-2-8 取消收藏文章 已经不能实现 接口已失效**
export const cancelCollectionsArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${articleId}`
  })
}

// 对文章点赞
// **2021-2-8 点赞 已经不能实现 接口已失效**
export const likingsArticle = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data
  })
}

// 取消对文章的点赞
// **2021-2-8 点取消赞 已经不能实现 接口已失效**
export const cancelLikingsArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

// Query 参数使用 params 设置
// Headers 参数使用 headers 设置
// Body 参数使用 data 设置
