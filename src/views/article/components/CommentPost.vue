<template>
  <div id="CommentPost">
    <!-- 发布评论组件 -->
    <!-- trim 修饰符 自动去除空的内容 以免发布内容全部是空格 -->
    <van-field
      v-model.trim="message"
      autosize
      type="textarea"
      maxlength="50"
      show-word-limit
    />
    <div class="releaseBtn" @click="onPost">发布</div>
  </div>
</template>

<script>
// 添加评论或评论回复
import { addComments } from '@/api/comment'
export default {
  name: 'CommentPost',
  props: {
    // 评论的目标id
    target: {
      type: [String, Number, Object],
      required: true
    },
    // 文章 id
    articleId: {
      type: [String, Number, Object],
      default: null // 默认值 不传就是 null
    }
  },
  data () {
    return {
      message: '' // 输入框内容
    }
  },
  methods: {
    async onPost () {
      const { data } = await addComments({
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.articleId === null ? null : this.articleId.toString() // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      // console.log(data)
      // 发布成功之后交给父级去展示
      this.$emit('post-success', data.data.new_obj)
      // 发布之后清空文本框的内容
      this.message = ''
      this.$toast.success('发布成功')
    }
  }
}
</script>

<style lang="less" scoped>
#CommentPost {
  display: flex;
  .releaseBtn {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(102, 102, 102);
    font-size: 15px;
  }
}
</style>
