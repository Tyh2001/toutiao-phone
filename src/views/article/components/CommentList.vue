<template>
  <div>
    <!-- 评论列表组件 -->
    <van-cell title="全部评论" />
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem
        v-for="(comment, index) in commentList"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click', $event)"
      />
      <!-- <van-cell
        v-for="(comment, index) in commentList"
        :key="index"
        :title="comment.content"
      /> -->
    </van-list>
  </div>
</template>

<script>
// 获取评论或评论回复
import { getComments } from '@/api/comment'
// 评论项
import CommentItem from './CommentItem'
export default {
  name: 'commentList',
  components: {
    CommentItem // 评论项
  },
  props: {
    // 文章内容
    // 如果获取文章评论 传递文章 id
    // 如果获取评论回复 传递评论 id
    source: {
      type: [Number, Object, String],
      required: true
    },
    // 父组件传递的新的评论内容
    commentList: {
      type: Array,
      // default: [] // 默认值是一个数组 因为不是必须要传递的
      // 数组或者对象的默认值必须通过函数返回
      default: function () {
        return []
      }
      // 简写为：
      // default: () => []
    },
    // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
    type: {
      type: String,
      default: 'a'
    }
  },
  data () {
    return {
      // 这个组件中不用直接单独定义评论数据是数组了
      // 因为上面 props 父组件传递来了一个数组 那么这个组件中直接向那个数组中存放数据
      // 父组件也可以同时往里面追加新的内容
      // 两个组件共同使用一个数组
      // 这个也可以同时展示出来了
      // commentList: [], // 评论内容
      loading: false,
      finished: false,
      offset: null, // 每页大小
      limit: 10 // 每页条数
    }
  },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getComments({
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset, // 页码 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 每页大小 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      // console.log(data)
      this.$emit('total_count', data.data.total_count)

      // 2.把数据放到列表中
      const { results } = data.data
      this.commentList.push(...results)

      // 3.将本次 loading 关闭
      this.loading = false

      // 4.判断是否还有数据
      if (results.length) {
        // 如果有 更新获取下一页的数据
        this.offset = data.data.last_id
      } else {
        // 如果没有 将 finished 设为 true 不再触发加载更多
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
