<template>
  <div id="channelEdit">
    <!-- 频道编辑组件 -->
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div slot="title">我的频道</div>
      <van-button
        plain
        type="danger"
        size="mini"
        round
        @click="isEdit = !isEdit"
      >
        {{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>

    <!--
      宫格 展示我的频道列表
      @click="onUserChannelClick(index)" 事件需要执行删除操作 需要将索引值传递过去
      要判断 推荐 频道不能删除 所以推荐上方删除图片也不能显示出来
      :class="{ active : index === active }" 动态绑定 如果当前激活的索引值等于 index 那么我的频道中就激活显示
    -->
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(Mychannels, index) in userChannels"
        :key="index"
        :text="Mychannels.name"
        :icon="isEdit && index !== 0 ? 'close' : ''"
        class="gridItem"
        :class="{ active: index === active }"
        @click="onUserChannelClick(Mychannels, index)"
      />
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div slot="title">频道推荐</div>
    </van-cell>

    <!-- 宫格 展示频道推荐列表 -->
    <van-grid :gutter="10">
      <!--
        这里 推荐的频道列表 = 全部频道 - 我的频道
        所以用都了计算属性 直接遍历计算属性中的 recommendChannels
        就是 全部频道 - 我的频道 得出的结果
        @click="onAddChannel(allChannel)"  点击频道列表中的项 添加至我的频道中 这里要将频道项传递过去
      -->
      <van-grid-item
        v-for="(allChannel, index) in recommendChannels"
        :key="index"
        :text="allChannel.name"
        @click="onAddChannel(allChannel)"
      />
    </van-grid>
  </div>
</template>

<script>
// 获取全部频道列表 - 批量修改用户频道列表 - 删除指定用户频道
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channels'
// 引入 vuex 获取到其中的数据
import { mapState } from 'vuex'
// 引入封装的本地存储方法
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    // 我的频道列表
    userChannels: {
      type: Array,
      required: true
    },
    // 当前被激活的项
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 全部频道列表
      isEdit: false // 控制关闭图片的显示状态
    }
  },
  // 计算属性
  // 计算属性 会依赖数据的变化而变化 一旦里面的值发生变化 那么计算属性就会重新求值运算
  // 那么这样的话 下面通过 onAddChannel 方法实现 点击频道列表中的项 添加至我的频道中 就可以实时更新效果了
  // 推荐的频道列表 = 全部频道 - 我的频道
  computed: {
    ...mapState(['user']),
    // 推荐的频道列表
    recommendChannels () {
      // allChannels 是 全部频道列表
      // userChannels 是 我的频道列表
      // filter 方法：过滤数据 根据方法返回的布尔值 true 来收集数据
      // filter 方法：查找满足条件的所有元素 **返回数组**
      // return this.allChannels.filter(channel => {
      //   // return true 这里如果返回 true 就证明所有的元素全部都要 那么就全部都显示 false 就是全部都不显示
      //   // 这里会对每个元素都进行遍历
      //   // 这里要判断 channel 是否属于用户频道 来返回对应的布尔值
      //   // find 方法：查找满足条件的单个元素 **返回布尔值**
      //   return !this.userChannels.find(userChannel => {
      //     // 找到满足该条件的元素 如果满足条件就不要 返回false
      //     return userChannel.id === channel.id
      //   })
      // })
      // // ------------ 分割线 ------------
      // for循环方法
      const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        let flag = false
        for (let i = 0; i < this.userChannels.length; i++) {
          if (this.userChannels[i].id === channel.id) {
            // 如果所有频道项都属于用户频道 那么就返回 true 然后 break 跳出循环
            flag = true
            // console.log(flag)
            break
          }
        }
        // 如果 flag 是 false 那么就将其添加到数组中
        if (!flag) {
          // console.log(flag)
          arr.push(channel)
        }
      })
      return arr
    }
  },
  created () {
    this.loadgetAllChannels() // 获取全部频道列表
  },
  methods: {
    // 获取全部频道列表
    async loadgetAllChannels () {
      const { data } = await getAllChannels()
      // console.log(data)
      this.allChannels = data.data.channels
    },
    // 点击频道列表中的项 添加至我的频道中
    // 接收传递来的参数
    async onAddChannel (channel) {
      // console.log(channel)
      this.userChannels.push(channel)
      // 数据持久化
      if (this.user) {
        // 如果已经登录了 数据存储到线上 **注：2021.2.6 该操作已失效 接口已经不能用**
        await addUserChannel({
          channels: [
            {
              id: channel.id, // 频道的 id 就是传递过来数据的 id
              seq: this.userChannels.length // 顺序序号 上方已经添加过了 这里直接将数组长度传递过去
            }
          ]
        })
      } else {
        // 如果没有登录 数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    // 点击我的频道每一项时
    onUserChannelClick (Mychannels, index) {
      // index !== 0 是要判断 推荐频道不能删除
      if (this.isEdit && index !== 0) {
        // 编辑操作 删除频道
        this.deleteChannel(Mychannels, index)
      } else {
        // 非编辑状态 切换频道
        this.switchChannel(index)
      }
    },
    // 删除频道
    async deleteChannel (Mychannels, index) {
      // 如果删除的是当前激活项之前的频道 那么高亮的索引会有问题 激活的就不是本身了，删除之后的不会影响
      // 那么这里要进行判断
      if (index <= this.active) {
        // 更新激活的索引值 删除激活前的频道 让当前的索引值 -1
        this.$emit('updateActive', this.active - 1)
      }
      // splice方法：从指定索引开始 包括这个索引 往后删除一位
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        // 如果已经登录了 持久化到线上
        // **注：2021.2.6 该操作已失效 接口已经不能用**
        await deleteUserChannel(Mychannels.id)
      } else {
        // 否则持久化到本地存储中
        setItem('user-channels', this.userChannels)
      }
    },
    // 切换频道
    switchChannel (index) {
      // console.log(index)
      // 切换频道选中状态
      this.$emit('updateActive', index)
      // 点击每一项都要先关闭弹框 向父组件发送数据
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
#channelEdit {
  padding-top: 54px;
  // 按钮
  .van-button {
    width: 50px;
    height: 23px;
    color: #f85a5a;
  }
  // 单元格样式
  /deep/ .van-grid-item__content {
    background-color: #f4f5f6;
    width: 80px;
    height: 43px;
    border-radius: 3px;
    position: relative;
    // 文字颜色
    // /deep/ .van-grid-item__text {
    .gridItem {
      // color: #222222;
      margin-top: 0;
      font-size: 12px;
    }
    // 关闭按钮
    .van-icon {
      font-size: 14px;
      position: absolute;
      right: -4px;
      top: -4px;
    }
  }
}
// 高亮项
.active {
  /deep/ .van-grid-item__text {
    color: red;
  }
}
</style>
