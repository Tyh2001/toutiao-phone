import Vue from 'vue'
import Vuex from 'vuex'
// 获取本地存储数据 - 设置本地存储
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

// 设置本地存储的名称 是一个常量 防止获取本地存档时名称写错不报错的情况
const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    // user: null // 登录用户身份信息(token等数据)
    // user: JSON.parse(window.localStorage.getItem('user'))
    user: getItem(USER_KEY),

    cachePages: ['layoutIndex'] // 默认被缓存超页面
  },
  mutations: {
    setUser (state, data) {
      state.user = data // 让 state.user = 传递来的数据 data

      // 为了防止页面刷新数据丢失 这里还需要设置本地存储 但是本地存储只是为了防止数据丢失作用
      // 本地存储要将对象转换为 JSON 格式字符串
      // window.localStorage.setItem 本地存储方法
      // JSON.stringify(state.user) 转换为 JSON 格式字符串方法
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    },
    // 添加缓存页面
    addCachePages (state, pageName) {
      // 如果 state.cachePages 里不包含 pageName 就添加 pageName
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    clearCachePages (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        // 将它从缓存中移除
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
