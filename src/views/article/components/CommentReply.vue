<template>
  <div id="CommentReply">
    <!-- 评论回复组件 -->
    <van-nav-bar
      :title="`${ comment.reply_count } 条回复`"
      class="vanNavBar"
    >
      <div slot="left">
        <van-icon
          name="arrow-left"
          @click="$emit('close')"
        />
      </div>
    </van-nav-bar>

    <!-- 评论内容 -->
    <CommentItem
      :comment="comment"
    />

    <p class="allComment">全部评论</p>

    <CommentList
      :source="comment.com_id"
      type="c"
      :list="commentList"
    />

    <!-- 底部区域 -->
    <div class="bottomBox">
      <!-- 写评论的按钮 -->
      <van-button
        type="default"
        size="mini"
        class="commentBtn"
        round
        @click="commentShow = true"
      >写评论</van-button>
    </div>

    <!-- 评论弹出层 -->
    <van-popup v-model="commentShow" position="bottom">
      <!-- 评论组件 -->
      <!-- 使用这个组件需要传递两个参数 -->
      <CommentPost
        :target="comment.com_id"
        :articleId="articleId"
        @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
// 评论项组件
import CommentItem from './CommentItem'
// 评论列表重用
import CommentList from './CommentList'
// 评论组件
import CommentPost from './CommentPost'
export default {
  name: 'CommentReply',
  props: {
    // 查看评论的回复项
    comment: {
      type: Object,
      required: true
    },
    // 文章 id
    articleId: {
      type: [Object, String, Number],
      required: true
    }
  },
  components: {
    CommentItem, // 评论项组件
    CommentList, // 评论列表重用
    CommentPost // 评论组件
  },
  data () {
    return {
      commentShow: false, // 弹出层显示状态
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    // 将发布成功的评论放到列表的顶部
    onPostSuccess (comment) {
      // console.log(comment)
      // 将发布成功的评论放到列表的顶部
      this.commentList.unshift(comment)
      // 更新评论数量
      this.comment.reply_count++
      // 关闭弹出层超显示状态
      this.commentShow = false
    }
  }
}
</script>

<style lang="less" scoped>
#CommentReply {
  /deep/ .vanNavBar {
    background-color: #fff !important;
    // 标题文字
    .van-nav-bar__title,
    .van-icon {
      color: #000 !important;
    }
  }
  // 全部评论说明文字
  .allComment {
    font-size: 15px;
    color: #323233;
    padding: 20px 10px 20px 20px;
  }
  // 底部评论按钮
  .bottomBox {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    border-top: 1px solid #eee;
    .commentBtn {
      width: 225px;
    }
  }
}
</style>
