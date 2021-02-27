<template>
  <div>
    <!-- 顶部搜索栏 -->
    <div class="topBar">
      <van-button
        type="default"
        icon-prefix="toutiao"
        icon="sousuo"
        round
        to="/search"
      >
        搜索
      </van-button>
    </div>

    <!-- tab 标签 文章频道列表 -->
    <van-tabs
      v-model="active"
      title-active-color="#333333"
    >
      <!-- 汉堡按钮 -->
      <van-icon
        class="hamburgerBtn"
        class-prefix="toutiao"
        name="gengduo"
        @click="ChannelEditShow"
      />
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!--
          标签页组件有个功能：只有你第一次访问才会加载当前页面
          文章；列表组件
          作用：每次切换其他文章列表时候 第一次需要加载，加载完成一次之后就可以直接记载出来
          不需要重新加载 增加加载速度 提升用户体验
          因为上方的标签是遍历出来的 所以这个组件也是遍历出来的
          每次点击一个新的标签都会遍历出来一个新的组件
          :channel="channel" 将遍历出来的每一项传递给子组件
        -->
        <ArticleList :channel="channel" />
      </van-tab>
    </van-tabs>

    <!-- 弹出层 切换频道列表 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      :style="{ top: '0' }"
      round
      closeable
      close-icon-position="top-left"
      get-container="body"
    >
      <!--
        频道编辑内容以组件形式展现 方便维护管理
        :channels="channels" 将频道列表直接传递给子组件
        :active="active" 当前被激活的项传递给子组件
        @close="isChannelEditShow = false" 子组件通过自定义事件 让弹框关闭
        @updateActive="updateActive" 切换频道选中状态
        $event 表示事件参数 updateActive 自定义事件传的是什么 $event 就是什么
      -->
      <ChannelEdit
        :userChannels="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @updateActive="active = $event"
      />
    </van-popup>
  </div>
</template>

<script>
// 获取用户频道列表 -
import { getChannels } from '@/api/user'
// 文章列表组件
import ArticleList from './components/ArticleList'
// 频道编辑组件
import ChannelEdit from './components/ChannelEdit'
// 映射进 vuex
import { mapState } from 'vuex'
// 获取本地存储
import { getItem } from '@/utils/storage'
export default {
  name: 'homeIndex',
  components: {
    ArticleList, // 文章列表
    ChannelEdit // 频道编辑
  },
  data () {
    return {
      active: 0, // tab 控制标签默认被激活的项
      channels: [], // 用户频道列表
      isChannelEditShow: false // 弹出层显示状态
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChanndls() // 获取文章频道
  },
  methods: {
    // 获取文章频道
    async loadChanndls () {
      // 获取文章频道时要进行判断处理：
      // 如果用户已经登录 则直接调接口获取数据
      // 如果没有登录 则在本地存储中获取数据
      // 如果既没有登录 本地存储也没有数据 则展示推荐频道列表
      let channels = []
      if (this.user) {
        // 登录了 请求线上数据 获取到的数据先放到变量 channels 中
        // 最后再把 channels 赋值给 data 中的 channels
        const { data } = await getChannels()
        channels = data.data.channels
      } else {
        // 如果没有登录 判断是否有本地存储的数据
        // 如果有 就赋值给 channels 没有就展示推荐页
        // user-channels 是本地存储中数据的名称
        const localChannels = getItem('user-channels')
        if (localChannels) {
          // 如果本地存储有数据 把本地存储的数据赋值给变量
          channels = localChannels
        } else {
          // 如果没有登录 本地存储也没有数据 那就请求获取默认推荐的频道列表
          const { data } = await getChannels()
          channels = data.data.channels
        }
      }
      // 把 channels 赋值给 data 中的 channels
      this.channels = channels
      // 下面是之前的写法 -----------分割线-----------
      // const { data } = await getChannels()
      // this.channels = data.data.channels
      // console.log(data)
    },
    // 点击汉堡按钮弹出层显示
    ChannelEditShow () {
      this.isChannelEditShow = true
    }
  }
}
</script>

<style lang="less" scoped>
// 顶部导航栏
.topBar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #3296fa;
  // 搜索按钮
  .van-button {
    background-color: #5babfb;
    border: none;
    height: 32px;
    width: 277px;
    color: #fff;
    font-size: 13px;
  }
}
// 滑动的标签栏
/deep/ .van-tabs__nav {
  height: 40px;
  margin-right: 34px;
  position: relative;
  /deep/ .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
    padding: 0 35px 0 35px;
    color: #777777;
  }
}
// 汉堡按钮
.hamburgerBtn {
  position: absolute;
  top: 0px;
  right: 0px;
  right: 0px;
  width: 33px;
  text-align: center;
  line-height: 40px;
  font-size: 15px;
  color: #333333;
  background-color: rgba(255, 255, 255, 0.9);
  border-left: 1px solid #eee;
}
/deep/ .van-tabs__line {
  background-color: #3296fa;
  width: 15px;
  height: 3px;
  margin-bottom: 4px;
}
// 关闭按钮
/deep/ .van-icon {
  color: #222222;
}
</style>
