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

Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

Vue.filter('dataTime', (value, format) => {
  return dayjs(value).format(format)
})
