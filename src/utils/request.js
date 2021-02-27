import axios from 'axios'
// 使用 Vuex 必须先加载
import store from '@/store'
import JSONbig from 'json-bigint'
// 加载 Vant 弹出框
import { Toast } from 'vant'

import router from '@/router'

// 再次创建一个实例 防止加载之前的会走拦截器
// 用来回去新的 token
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 解决安全整数范围
  transformResponse: [function (data) {
    // 后端返回的可能不是 JSON 格式字符串
    // 如果不是的话 那么 JSONbig.parse 调用会报错
    // 所以使用 try catch 来捕获异常 处理异常发生
    try {
      // 如果转换成功 则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // 如果转换失败 则进入这里
      // 我们直接把数据原封不动的返回给请求使用
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // console.log(config)
  if (store.state.user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  // const { user } = store.state
  // if (user) {
  //   config.headers.Authorization = `Bearer ${user.token}`
  // }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
// 任何响应都会进入这里
request.interceptors.response.use(function (response) {
  // 任何位于 2xx 的状态码都会触发此功能
  // 对相应数据进行处理
  return response
}, async function (error) {
  // 任何错误都会进入这里
  // 任何超出2xx范围的状态代码都会触发此功能
  // 处理响应错误

  console.dir(error)
  // 获取到错误状态码
  const status = error.request.status

  if (status === 400) {
    // 客户端错误
    Toast.fail('客户端请求参数错误')
  } else if (status === 401) {
    // token 无效
    // 如果容器中没有 user 或者 user.token 直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 如果两个数据都没有 直接强制跳转到登录页面
      return redirectLogin()
    }

    // 如果有 refresh_token 则去请求信想 token
    // 使用 refresh_token 获取新的 token
    // 因为 refreshTokenReq 这个方法没有拦截器 所以这个请求的异常要单独处理
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 如果刷新 token 成功
      // 那到新的 token 之后更新到容器中去
      // console.log(data)
      user.token = data.data.token
      store.commit('setUser', user)

      // 再把失败的请求重新发布出去
      // error.config 是本次请求相关的配置对象
      // 这里使用 request 发送请求 会走自己的拦截器
      // 它的请求拦截器中通过 store 容器访问 token 容器数据
      return request(error.config)
    } catch (err) {
      // 刷新 token 失败了 直接跳转登录页面
      redirectLogin()
    }

    Toast.fail('token 无效')
  } else if (status === 403) {
    // 没有权限
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }

  // 抛出异常
  return Promise.reject(error)
})

// 封装跳转到登录页面的方法
function redirectLogin () {
  // 使用replace 不会形成历史记录
  // router.replace('/login')
  router.replace({
    name: 'login',
    // 传递查询参数 查询参数会以 ? 作为分隔符 放到 url 后面
    query: {
      // redirect 数据名是随便起的
      // router.currentRoute 和组件中 this.$router 是一样的
      // fullPath 获取当前路由的路径
      redirect: router.currentRoute.fullPath
    }
  })
}

// 导出
export default request
