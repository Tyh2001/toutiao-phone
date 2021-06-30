<template>
  <div>
    <!-- 搜索页面模块 -->
    <!-- 1.搜索框 -->
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form action="/">
      <van-search
        background="#3296fa"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 2.搜索结果 -->
    <SearchResult v-if="isResultShow" :searchText="searchText" />

    <!-- 3.搜索联想建议  -->
    <!-- 如果文本框里有内容就展示 -->
    <SearchSuggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    />

    <!-- 4.历史记录 -->
    <SearchHistory
      :searchHistories="searchHistories"
      v-else
      @search="onSearch"
      @AllDelete="searchHistories = []"
    />
  </div>
</template>

<script>
// 引入联想建议组件
import SearchSuggestion from './components/SearchSuggestion'
// 引入历史记录组件
import SearchHistory from './components/SearchHistory'
// 引入搜索结果组件
import SearchResult from './components/SearchResult'
// 设置本地存储 - 获取本地存储
import { setItem, getItem } from '@/utils/storage'
// 获取用户搜索历史
// import { getUserHistories } from '@/api/search'
export default {
  name: 'searchIndex',
  components: {
    SearchSuggestion, // 联想建议组件
    SearchHistory, // 历史记录组件
    SearchResult // 搜索结果组件
  },
  data () {
    return {
      searchText: '', // 搜索框的内容
      isResultShow: false, // 控制搜索结果的显示状态
      // searchHistories: [] // 搜索历史记录
      // 历史记录存储到的本地存储中 这里直接获取即可
      // 如果本地存储没有数据就使用读取到的数据 如果没有 就是一个空数组
      // searchHistories: getItem('search-histories') || [] // 搜索历史记录
      searchHistories: [] // 搜索历史记录
    }
  },
  // 这里来监视搜索历史记录的变化
  // 在这里来做持久化 只要发生变化 就重新设置本地存储
  // 写了这么个代码 所有设置这个本地存储的就全部都不用写了 直接监视所有
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  created () {
    this.loadgetUserHistories() // 获取用户搜索历史
  },
  methods: {
    // 事件在点击键盘上的搜索/回车按钮后触发
    onSearch (searchText) {
      // 点击联想建议之后文本框里也会变成点击的内容
      // 把输入框设置为要搜索的文本
      this.searchText = searchText

      // 将历史记录存起来
      // indexOf 找到匹配字符的索引
      // 如果有重复的内容 先把重复的内容移除 再把新的记录展示到最上方
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项移除
        this.searchHistories.splice(index, 1)
      }
      // unshift 方法：让最新的排在前面
      this.searchHistories.unshift(searchText)

      // 如果已经登录 则把数据存储到线上
      // 我们只要调用获取搜索结果的接口 后端会自动给我们存储用户搜索的历史记录
      // 如果没有登陆 则需要把历史记录存储到本地
      // setItem('search-histories', this.searchHistories) // 把搜索的历史记录存储到本地

      // 当搜索之后 搜索结果是显示状态
      this.isResultShow = true
    },
    // 获取用户搜索历史 后端只记录最后的4个历史记录
    // 因为后台帮助我们存储的历史记录太少了 只有4条
    // 所以这里将后端返回的数据和本地存储的数据合并到一起
    async loadgetUserHistories () {
      // 如果本地存储有数据就获取 否则就是空数组
      const searchHistories = getItem('search-histories') || []
      // 如果用户已经登录
      // 这里因为接口满足不了我们是需求 就不获取后台的四条历史记录了
      // 直接将所有搜索记录直接设置本地存储
      // if (this.$store.state.user) {
      //   const { data } = await getUserHistories() // 获取到的线上的存储数据
      //   // console.log(data.data.keywords)
      //   // new Set([]) 是 es6 的新语法 数组去重
      //   // Set 类似数组 但是并不是一个数组 这里还要把转换之后的再次转换成数组
      //   // 合并数组 [...数组,...数组]
      //   // 把 Set 转换为数组 [...Set对象]
      //   // 所以最终结果是 [...new Set([...数组,...数组])]
      //   searchHistories = [...new Set([
      //     ...searchHistories,
      //     ...data.data.keywords
      //   ])]
      // }
      this.searchHistories = searchHistories
    }
  }
}
</script>

<style lang="less" scoped>
</style>
