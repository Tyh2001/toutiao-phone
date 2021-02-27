<template>
  <div>
    <!--
      首页阅读文章 如果选到了其他频道看了谋篇文章之后
      返回出来那么就会重新加载了一遍组件 那么
      keep-alive 防止组件销毁而重新渲染问题
      但是加了这个之后也会有一个新的问题：其他组件的声明周期就不会重新被渲染了
      那么以后点击的所有文章的内容都和第一次点击的内容的一样的了
      使用 :include="[layoutIndex]" 这个属性可以规定那那些被缓存
      这是一个数组 里面放需要缓存组件的名字
    -->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less" scoped>
</style>
