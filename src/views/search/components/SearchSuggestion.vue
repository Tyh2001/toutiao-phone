<template>
  <div id="SearchSuggestion">
    <!-- 联想建议组件 -->
    <!--
      把输入框设置为要搜索的文本
      通过点击某一项来向父组件传递数据
      @click="$emit('search', suggestion)"
      通过点击事件触发自定义事件 将那一项的内容传递过去
    -->
    <van-cell
      v-for="(suggestion, index) in suggestions"
      :key="index"
      :title="suggestion"
      icon="search"
      @click="$emit('search', suggestion)"
    >
      <!-- 让联想到的数据高亮显示 -->
      <div slot="title" v-html="heighlight(suggestion)"></div>
    </van-cell>
  </div>
</template>

<script>
// 获取联想建议
import { getSearchSuggestions } from '@/api/search'
// 引入防抖包
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  props: {
    // 搜索框的内容
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: null // 联想建议
    }
  },
  // 用来监视数据的变化
  watch: {
    // 这里要监视 searchText 的变化 就是文本框里内容的变化
    // searchText () {
    //   console.log(1)
    // }
    // 下面的写法等价于上面的写法 下面的写法是完整的写法
    // handler 是自带的方法名称
    searchText: {
      handler: debounce(function () {
        getSearchSuggestions({
          q: this.searchText
        }).then(res => {
          // console.log(1)
          this.suggestions = res.data.data.options
        })
      }, 600),
      // async handler () {
      //   // console.log(1)
      //   const { data } = await getSearchSuggestions({
      //     q: this.searchText
      //   })
      //   console.log(data)
      //   this.suggestions = data.data.options
      // },
      // 在初始化的时候先调用一下
      immediate: true
    }
  },
  methods: {
    // 联想到的文字高亮显示
    heighlight (suggestion) {
      // RegExp 是正则表达式的构造函数 原生写法
      // 参数1：字符串
      // 参数2：匹配模式
      // 返回值：正则对象
      // g 是匹配全部 i 是不区分大小写
      // new RegExp(this.searchText, 'gi')
      const regExp = new RegExp(this.searchText, 'gi')
      return suggestion.replace(regExp, `<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style lang="less" scoped>
#SearchSuggestion {
  position: fixed;
  top: 54px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: auto;
}
</style>
