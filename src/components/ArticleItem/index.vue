<template>
  <div>
    <!-- 文章列表内容组件 -->
    <van-cell-group>
      <!--
        动态路由 传递参数到路由 参数的文章的 id
        这样可以根据不同的文章显示不同的内容
      -->
      <van-cell
        :to="{
          name: 'article',
          params: {
            articleId: article.art_id,
          },
        }"
      >
        <!-- 标题 -->
        <div slot="title" class="title van-multi-ellipsis--l2">
          {{ article.title }}
        </div>

        <div slot="label">
          <!-- 三张图片 -->
          <div v-if="article.cover.type === 3" class="coverWrap">
            <van-image
              v-for="(img, index) in article.cover.images"
              :key="index"
              class="itemImg"
              :src="img"
            />
          </div>
          <!-- 作者 - 评论 - 发布时间 -->
          <div>
            <span class="explain">{{ article.aut_name }}</span>
            <span class="explain">{{ article.comm_count }}</span>
            <span class="explain">{{ article.pubdate | relativeTime }}</span>
          </div>
        </div>

        <!-- 发布一张图片 -->
        <div slot="default" class="imagesBox">
          <van-image
            class="images"
            v-if="article.cover.type === 1"
            :src="article.cover.images[0]"
          />
        </div>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    // 父组件传递来的每一项的文章数据
    article: {
      type: Object, // 传来的是一个对象
      required: true // 必须的
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
// 每张图片大小
/deep/ .van-image__img {
  width: 113px;
  height: 73px;
}
// 三张图片的盒子
.coverWrap {
  display: flex;
  padding: 15px 0;
  .itemImg {
    width: 113px;
    height: 73px;
    margin-right: 2px;
  }
}
.van-cell__value {
  flex: unset;
}
// 文章说明
.explain {
  font-size: 12px;
  color: #bababa;
  margin-right: 12px;
}
</style>
