/**
 * 初始化 dayjs 相关配置 用来调整日期
 */

import Vue from 'vue'
import dayjs from 'dayjs'
// 配置使用中文语言包
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用相对时间
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// 把处理相对时间的代码包装诶为全局过滤器
// 然后就可以在任何组件下使用了
// 过滤去就是一个可以在模板中调用的函数而已
// 在组件的模板中使用过滤器方法：{{ xxx | relativeTime }}
// | 前的内容会作为参数传递给过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
// 但是这样做必须要先引入 Vue
Vue.filter('relativeTime', value => {
  // console.log('哈哈哈')
  return dayjs(value).from(dayjs())
})

Vue.filter('dataTime', (value, format) => {
  // console.log('哈哈哈')
  return dayjs(value).format(format)
})

// 日期格式化
// dayjs().format('YYY-MM-DD HH:mm:ss')

// 计算从一个时间到现在过去了多久
// dayjs('2021-01-01 12:22:23').from(dayjs())
