<template>
  <div id="userChat">
    <!-- 小智同学页面 -->
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 中间的聊天内容 -->
    <van-cell-group class="vanCellGroup">
      <!-- 聊天内容遍历 -->
      <van-cell
        v-for="(msg, index) in messages"
        :key="index"
        :value="msg"
      />
    </van-cell-group>

    <!-- 下方文本框 -->
    <van-field
      v-model="text"
      center
      clearable
    >
      <template #button>
        <van-button
          size="small"
          type="primary"
          @click="onSend"
        >发送</van-button>
      </template>
    </van-field>
  </div>
</template>

<script>
// 引入 socket.io 用来实时通信
// import io from 'socket.io-client'
export default {
  name: 'userChat',
  data () {
    return {
      text: '', // 文本框输入的内容
      socket: null, // WebSocket 通信对象
      messages: [] // 消息列表
    }
  },
  created () {
    // 建立连接 连接地址要看接口文档的地址

    // <--------------分割线 - 上-------------->
    // 小智同学功能接口暂时不能实现 中间注释内容为写好内 由于接口问题 功能暂不能实现
    // 出错时间**2021-02-10**

    // 这个地址路径有问题 功能不能实现 地址改好后可使用
    // const socket = io('http://ttapi.research.itcast.cn/')

    // this.socket = socket

    // // 连接建立成功会触发 connect 这个回调
    // socket.on('connect', function () {
    //   console.log('连接建立成功')
    // })

    // // 这个没啥用
    // // socket.on('evnt', function (data) {})

    // // 断开连接会触发 disconnect 这个回调
    // socket.on('disconnect', function () {
    //   console.log('断开连接了')
    // })

    // // 监听 message 事件 接收服务端的消息
    // // 这里的 message 也是要根据文档要求来写的
    // socket.on('message', data => {
    //   console.log(data)
    //   对方给我的消息
    //   this.messages.push(data)
    // })

    // <--------------分割线 - 下-------------->
    // 小智同学功能接口暂时不能实现 中间注释内容为写好内 由于接口问题 功能暂不能实现
    // 出错时间**2021-02-10**

    // 发送消息
    // socket.emit('消息类型', 消息内容)
    // 接收消息
    // socket.on('消息类型', function (data) {
    // data 消息
    // })
  },
  methods: {
    // 发送消息
    onSend () {
      // 发送消息
      // socket.emit('消息类型', 消息内容)
      // 消息类型要看接口文档要求
      // 这是要发送的数据对象

      // <--------------分割线 - 上-------------->
      // 小智同学功能接口暂时不能实现 中间注释内容为写好内 由于接口问题 功能暂不能实现
      // 这里采用模拟数据 不能发送 直接将文本框输入的内容添加进入数组进行展示伪聊天内容
      // 出错时间**2021-02-10**

      // const data = {
      //   msg: this.text, // 聊天的内容
      //   timestamp: Date.now() // 聊天发送时间戳
      // }
      // this.socket.emit('message', data)

      // // 把用户发出去的消息存储到数组中 进行展示聊天内容
      // this.messages.push(data)

      // <--------------分割线 - 下-------------->
      // 小智同学功能接口暂时不能实现 中间注释内容为写好内 由于接口问题 功能暂不能实现
      // 这里采用模拟数据 不能发送 直接将文本框输入的内容添加进入数组进行展示伪聊天内容
      // 出错时间**2021-02-10**

      // 将文本框输入的内容直接添加进入数组中
      this.messages.push(this.text)

      // 点击发送按钮之后清空文本框的内容
      this.text = ''
    }
  }
}
</script>

<style lang="less" scoped>
#userChat {
  // 聊天内容
  .vanCellGroup {
    position: fixed;
    top: 46px;
    bottom: 53px;
    left: 0px;
    right: 0px;
    overflow-y: auto;
    background-color: #f5f5f6;
  }
  // 输入框
  .van-field {
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }
}
</style>
