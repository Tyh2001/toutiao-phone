<template>
  <div id="SearchResult">
    <!-- 搜索结果组件 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(search, index) in searchs"
        :key="index"
        :title="search.title"
      />
    </van-list>
  </div>
</template>

<script>
// 获取搜索结果
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    // 文本框里搜索的内容 用来查询搜索的结果
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      searchs: [], // 搜索结果
      loading: false, // 加载的 loading
      finished: false, // 是否全部加载完成
      page: 1, // 每页数量，不传每页数量由后端决定
      per_page: 10 // 搜索关键词
    }
  },
  methods: {
    // List 组件加载数据
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getSearchResult({
        page: this.page, // 页数，不传默认为1
        per_page: this.per_page, // 每页数量
        q: this.searchText // 搜索关键词
      })
      // console.log(data)

      // 2.将数据放到数据列表中
      const { results } = data.data
      this.searchs.push(...results)

      // 3.关闭本次的 Loading
      this.loading = false

      // 4.判断是否还有数据 如果有 则获取下一页数据的页码 如果没有 则把 finished 设置为 true 关闭加载更多
      if (results.length) {
        // 如果还有数据 就更新页码 加载下一页
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
#SearchResult {
  position: fixed;
  top: 54px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: auto;
}
</style>
