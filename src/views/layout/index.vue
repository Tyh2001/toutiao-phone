<template>
  <div>
    <!--
      首页阅读文章 如果选到了其他频道看了谋篇文章之后
      返回出来那么就会重新加载了一遍组件 那么
      keep-alive 防止组件销毁而重新渲染问题
      但是加了这个之后也会有一个新的问题：其他组件的声明周期就不会重新被渲染了
      那么以后点击的所有文章的内容都和第一次点击的内容的一样的了
    -->
    <keep-alive>
      <router-view/>
    </keep-alive>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/qa" icon="search">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="friends-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layoutIndex',
  data () {
    return {
      active: 0 // 底部导航栏默认选中第几个
    }
  },
  mounted () {
    // 缓存组件
    this.$store.commit('addCachePages', 'layoutIndex')
  }
}
</script>

<style lang="less" scoped>
</style>
