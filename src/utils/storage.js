/**
 * 本地存储封装模块
 */

/**
 * 获取本地存储
 * @param {String} name 存储数据的名称
 */
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // data 可能是一个 JSON 格式字符串 需要在 try 里尝试转换为 JSON 格式字符串
  // 如果是一个 JSON 格式字符串 则不需要转换 直接返回
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 设置本地存储
 * @param {String} name 存储数据的名称
 * @param {Object} value 存储数据的值
 */
export const setItem = (name, value) => {
  // 如果 value 是 JSON 格式字符串 就要转换为 JSON 字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

/**
 * 删除本地存储
 * @param {String} name 要删除的数据的名称
 */
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
