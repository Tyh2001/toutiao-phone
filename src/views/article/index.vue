<template>
  <div id="articleIndex">
    <!-- 文章详情页面 -->
    <!-- 导航菜单 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />
    <!-- 文章内容 -->
    <div class="ArticleContent">
      <!-- 标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center>
        <!-- 用户昵称 -->
        <div slot="title" class="userName">{{ article.aut_name }}</div>
        <!-- 发布日期 -->
        <div slot="label" class="label">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-image round slot="icon" class="userImg" :src="article.aut_photo" />
        <!-- 关注 / 取消关注按钮 -->
        <van-button
          class="followBtn"
          :type="article.is_followed ? 'default' : 'danger'"
          size="mini"
          :icon="article.is_followed ? '' : 'plus'"
          round
          @click="onFollow"
          :loading="BtnLoading"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>

      <!-- 文章内容 -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      />

      <!-- 评论列表 -->
      <!-- 这里要把新的评论列表数据传递给子组件 -->
      <CommentList
        :source="articleId"
        :commentList="commentList"
        @total_count="totalCountItem = $event"
        @reply-click="onReplyClick"
      />
    </div>

    <!-- 底部区域 -->
    <van-cell center class="bottomBox">
      <!-- 写评论的按钮 -->
      <van-button
        type="default"
        size="mini"
        class="commentBtn"
        round
        @click="commentShow = true"
        >写评论</van-button
      >

      <!-- 评论 -->
      <van-icon class-prefix="toutiao" name="pinglun" :badge="totalCountItem" />

      <!-- 点赞 -->
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'orange' : ''"
        @click="onAttitude"
      />

      <!-- 收藏 -->
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : ''"
        @click="onCollectionsArticle"
      />

      <!-- 转发 -->
      <van-icon class-prefix="toutiao" name="fenxiang" />
    </van-cell>

    <!-- 评论框弹出层 -->
    <van-popup v-model="commentShow" position="bottom">
      <CommentPost :target="articleId" @post-success="onPostSuccess" />
    </van-popup>

    <!-- 评论回复弹出层 -->
    <van-popup v-model="commentReplyShow" position="bottom">
      <!-- 评论回复组件 -->
      <!--
        因为这个组件的弹出层是懒加载 所以在没有打开弹出层的情况下
        组件是没有被渲染出来的 那么第一次点击一个评论回复的弹窗之后
        因为第一次的弹窗没有被销毁 那么第二次点击还会再次渲染第一次弹窗的内容
        所以必须要关闭之后把组件销毁掉 打开再重新渲染
        所以这里用到了 v-if="commentReplyShow"
        让弹出层关闭之后 commentReplyShow 也就等于 false 那么就会被销毁掉
        再次点击 commentReplyShow = true 也就重新渲染出来了
      -->
      <CommentReply
        v-if="commentReplyShow"
        :comment="replyComment"
        @close="commentReplyShow = false"
        :articleId="articleId"
      />
    </van-popup>
  </div>
</template>

<script>
// 加载 github-markdown css 样式库
import './style/github-markdown-css.css'
// 获取新闻文章详情 - 收藏文章 - 取消收藏文章 - 对文章点赞 - 取消对文章的点赞
import {
  getArticleById,
  collectionsArticle,
  cancelCollectionsArticle,
  likingsArticle,
  cancelLikingsArticle
} from '@/api/article'
// vant 图片预览组件 **这个组件想要使用必须单独加载**
import { ImagePreview } from 'vant'
// 关注用户 - 取消关注
import { followings, cancelFollowings } from '@/api/user'
// 评论列表组件
import CommentList from './components/CommentList'
// 评论框组件
import CommentPost from './components/CommentPost'
// 评论回复组件
import CommentReply from './components/CommentReply'
// 在组件中获取动态路由参数：
// 方式一：this.$router.params.xxx
// 方式二：props 传参 推荐
// vant 组件图片预览写法
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 1
// })
export default {
  name: 'articleIndex',
  props: {
    // 文章 id 这里要拿着 id 来请求对应的文章参数
    articleId: {
      // 因为这里要传递超出整数范围的值 可能是三种类型
      type: [String, Number, Object],
      required: true
    }
  },
  components: {
    CommentList, // 评论列表组件
    CommentPost, // 评论框组件
    CommentReply // 评论回复组件
  },
  data () {
    return {
      article: {}, // 文章内容
      BtnLoading: false, // 按钮的 loading 状态
      commentShow: false, // 评论弹出层显示状态
      commentList: [], // 评论内容
      totalCountItem: 0, // 评论数量
      commentReplyShow: false, // 评论回复弹出层显示状态
      replyComment: {} // 当前评论回复对象
    }
  },
  created () {
    this.loadgetArticleById() // 获取新闻文章详情
  },
  methods: {
    // 获取新闻文章详情
    async loadgetArticleById () {
      const { data } = await getArticleById(this.articleId)
      // console.log(data)
      this.article = data.data
      // 数据改变影响视图更新不是立即的(dom数据)
      // 所以如果是要在修改数据之后马上操作被改数据影响视图中的 DOM
      // 需要把这个数据放到 this.$nextTick 中
      // this.$nextTick 是 vue 中提供的一个方法
      this.$nextTick(() => {
        // 为了代码简洁 操作逻辑又疯转了一个方法进行调用
        this.handlePerviewImage()
      })
    },
    // 图片预览的方法
    handlePerviewImage () {
      // 1.这里要获取文章 dom 的容器
      const articleContent = this.$refs['article-content']
      // console.log(articleContent)
      // 2.得到容器中所有的 img 标签
      const imags = articleContent.querySelectorAll('img')
      // console.log(imags)
      // 搜集所有图片的地址
      const imagesSrc = []
      // 循环的时候也要有个 index 参数用来初始化图片起始位置
      // 3.循环 img 标签 给 img 标签注册点击事件
      imags.forEach((img, index) => {
        // 每次遍历都把图片的 src 放到新的数组中
        imagesSrc.push(img.src)
        img.onclick = function () {
          // 4.在事件处理函数中调用 Vant 的 ImagePreview 方法 实现图片预览
          ImagePreview({
            // images 是 vant 中定义的方法 值的一个数组
            // 那么这里就把遍历所有图片的 src 数组赋值给 imags 即可
            images: imagesSrc, // 预览图片的列表
            startPosition: index // 图片的起始位置
          })
        }
      })
    },
    // 关注 / 取消关注
    // **2021-2-8 关注功能已经不能实现 接口已失效**
    async onFollow () {
      // 如果是已经关注了 article.is_followed = true
      // 那么点击就执行取消关注操作
      // aut_id 是作者 id
      this.BtnLoading = true
      if (this.article.is_followed) {
        await cancelFollowings(this.article.aut_id)
        // this.article.is_followed = false
      } else {
        // 否则那么就执行关注操作
        await followings({
          target: this.article.aut_id // 传递作者 id
        })
        // this.article.is_followed = true
      }
      this.BtnLoading = false
      this.article.is_followed = !this.article.is_followed
    },
    // 收藏文章 / 取消收藏
    // **2021-2-8 收藏文章 已经不能实现 接口已失效**
    async onCollectionsArticle () {
      if (this.article.is_collected) {
        // 如果为真 就取消收藏
        await cancelCollectionsArticle(this.article.art_id)
      } else {
        // 否则就收藏
        await collectionsArticle({
          target: this.article.art_id
        })
      }
      this.article.is_collected = !this.article.is_collected
    },
    // 点赞 / 取消点赞
    // **2021-2-8 点赞 已经不能实现 接口已失效**
    async onAttitude () {
      // 如果等于0或者-1代表米有点赞 那么点击执行点赞操作
      if (this.article.attitude === 0 || this.article.attitude === -1) {
        await likingsArticle({
          target: this.article.art_id
        })
        this.article.attitude = 1
      } else {
        // 否则执行取消点赞操作
        await cancelLikingsArticle(this.article.art_id)
        this.article.attitude = 0
      }
    },
    // 接收子级传递来的评论数据对象进行发布
    onPostSuccess (comment) {
      // console.log(comment)
      // 要把评论放到评论列表顶部
      this.commentList.unshift(comment)
      // 关闭评论弹出框
      this.commentShow = false
      // 更新评论总数量
      this.totalCountItem++
    },
    // 当 CommentItem 组件中的 回复按钮被点击时
    onReplyClick (comment) {
      // console.log(comment)

      this.replyComment = comment
      // 展示评论的弹出层
      this.commentReplyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
#articleIndex {
  .ArticleContent {
    position: fixed;
    top: 46px;
    left: 0px;
    right: 0px;
    bottom: 44px;
    overflow-y: auto;
    // 标题
    .title {
      font-size: 19px;
      color: #3a3a3a;
      padding: 0px 14px;
    }
    // 用户信息
    .van-cell {
      // 用户名
      .userName {
        font-size: 11px;
        color: #333333;
        margin-left: 8px;
        height: 17px;
      }
      // 用户头像
      .userImg {
        width: 35px;
        height: 35px;
      }
      // 发布时间
      .label {
        font-size: 11px;
        color: #b4b4b4;
        margin-left: 8px;
      }
      // 关注按钮
      .followBtn {
        width: 85px;
        height: 30px;
      }
    }
  }
  // 文章内容
  .markdown-body {
    padding: 20px;
  }
  // 底部内容
  .bottomBox {
    position: fixed;
    height: 43px;
    border-top: 1px solid #d8d8d8;
    left: 0px;
    right: 0px;
    bottom: 0px;
    // 评论按钮
    .commentBtn {
      width: 140px;
      // 按钮中是文字
      .van-button__text {
        color: #a7a7a7;
        font-size: 13px;
        position: relative;
        right: 33px;
        top: 1px;
      }
    }
    // 图标
    .van-icon,
    .toutiao {
      font-size: 21px;
      color: #777777;
      margin-left: 23px;
      position: relative;
      top: 4px;
    }
  }
}
</style>
