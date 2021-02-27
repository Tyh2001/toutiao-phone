<template>
  <div id="ArticleList" ref="article-list">
    <!-- 首页文章列表组件 -->
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isPullDownLoading"
      :success-text="successText"
      success-duration="1500"
      @refresh="onRefresh"
    >
      <!-- List 列表 滚动到底部会加载更多 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!--
          文章列表标题
          之前使用 Vant 组件遍历 现在自己定义组件进行遍历
          :article="article" 将每一项的对象传递给子组件
        -->
        <!-- 文章的每一项内容 -->
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 获取频道新闻推荐 -
import { getArticles } from '@/api/article'
// 文章列表组件
import ArticleItem from '@/components/ArticleItem'
// 添加防抖处理
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  props: {
    // 父组件传递来的文章列表数据
    channel: {
      type: Object, // 传来的是一个对象
      required: true // 必须的
    }
  },
  components: {
    ArticleItem // 文章列表组件
  },
  data () {
    return {
      articles: [], // 数据文章列表
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制加载结束的状态
      timestamp: null, // 当前的时间戳
      isPullDownLoading: false, // 下滑加载状态
      successText: '', // 下拉刷新提示的文本
      scrollTop: 0 // 滚动距离顶部的距离
    }
  },
  mounted () {
    // 解决缓存页面之后返回页面返回顶而不是在之前位置的问题部的问题
    // 获取元素滚动距离顶部的距离
    const ArticleList = this.$refs['article-list']
    ArticleList.onscroll = debounce(() => {
      // 获取距离顶部的距离
      // console.log(ArticleList.scrollTop)
      // console.log(ArticleList.scrollTop)
      this.scrollTop = ArticleList.scrollTop
    }, 50)
  },
  // 缓存之后 created 和 mounted 不再执行
  // 那么 activated 和 deactivated 这两个生命周期钩子会即系执行
  activated () {
    // 把记录到顶部的距离重新设置回去
    // console.log('从缓存中被激活')
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  // deactivated () {
  //   console.log('组件失去活动了')
  // },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 id
        timestamp: this.timestamp || Date.now(), // 相当于页码 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // console.log(data)

      // 2.把数据放到数组中 *是 push 进去的
      const { results } = data.data
      this.articles.push(...results)

      // 3.设置本次加载状态 它可以判断是否需要加载下一次，否则将会永远加载
      this.loading = false

      // 4.当数据全部加载完成
      // 如果数组中还有值
      if (results.length) {
        // 更新获取下一页的数据页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了 把加载状态设置为结束 不再出发加载更多
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 下拉刷新 组件自己就会展示 loading 状态
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 id
        timestamp: Date.now(), // 相当于页码 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // console.log(data)

      // 2.把数据放到数据列表中(往顶部追加)
      const { results } = data.data
      this.articles.unshift(...results)

      // 3.关闭 loading
      this.isPullDownLoading = false

      this.successText = `已更新${results.length}条数据` // 下拉刷新提示的文本
    }
  }
}
</script>

<style lang="less" scoped>
// 让整个列表成为固定定位
#ArticleList {
  position: fixed;
  right: 0px;
  left: 0px;
  top: 90px;
  bottom: 50px;
  overflow: auto;
}
</style>
