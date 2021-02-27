<template>
  <div id="CommentItem">
    <!-- 评论项组件 -->
    <!-- 用户头像 -->
    <div class="userPhotoBox">
      <!-- 用户头像 -->
      <van-image
        round
        class="userPhoto"
        slot="icon"
        :src="comment.aut_photo"
      />
    </div>

    <!-- 评论内容信息 -->
    <div class="rightBox">
      <div class="commentItem">
        <!-- 用户昵称 -->
        <div class="userName">{{ comment.aut_name }}</div>

        <!-- 评论内容 -->
        <div class="content">{{ comment.content }}</div>

        <div class="TimeBtn">
          <!-- 评论时间 -->
          <span class="time">{{ comment.pubdate | dataTime('MM-DD HH:mm') }}</span>

          <!-- 回复按钮 -->
          <van-button
            class="replyBtn"
            type="default"
            round
            size="mini"
            @click="$emit('reply-click', comment)"
          >
            {{ comment.reply_count }}回复
          </van-button>
        </div>
      </div>

      <!-- 右侧点赞数量 -->
      <div class="likeBox" @click="onCommentLike">
        <van-icon
          :color="comment.is_liking ? 'orange' : ''"
          :name="comment.is_liking ? 'good-job' : 'good-job-o'"
        />
        <span class="like_count">{{ comment.like_count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 对评论或评论回复点赞 - 取消对评论或评论回复点赞
import { likingsComments, clearLikingsComments } from '@/api/comment'
export default {
  name: 'CommentItem',
  props: {
    // 评论项
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  methods: {
    // 点赞评论
    async onCommentLike () {
      const commentId = this.comment.com_id.toString()
      // 如果是真 就取消点赞
      if (this.comment.is_liking) {
        await clearLikingsComments(commentId)
        // 点赞数量-1
        this.comment.like_count--
      } else {
        await likingsComments(commentId)
        this.comment.like_count++
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
#CommentItem {
  display: flex;
  padding: 15px;
  // 用户头像
  .userPhotoBox {
    width: 36px;
    .userPhoto {
      width: 36px;
      height: 36px;
    }
  }
  // 右边内容
  .rightBox {
    display: flex;
    justify-content: space-between;
    margin-left: 13px;
    // 昵称 - 评论 - 时间
    .commentItem {
      width: 274px;
      // 昵称
      .userName {
        font-size: 13px;
        color: #406599;
      }
      // 评论内容
      .content {
        font-size: 15px;
        color: #222222;
      }
      .TimeBtn {
        display: flex;
        align-items: center;
        // 时间
        .time {
          font-size: 9px;
          color: #222222;
        }
        // 回复按钮
        .replyBtn {
          margin-left: 20px;
          background-color: #f4f5f6;
          height: 24px;
          .van-button__text {
            font-size: 11px;
            color: #282828;
          }
        }
      }
    }
    // 点赞盒子
    .likeBox {
      display: flex;
      justify-content: center;
      .van-icon {
        font-size: 15px;
        color: #000000;
        display: inline-block;
      }
      .like_count {
        font-size: 15px;
      }
    }
  }
}
</style>
