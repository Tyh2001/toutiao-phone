<template>
  <div>
    <!-- 更改个人信息组件 -->
    <!-- 顶部导航栏 -->
    <van-nav-bar title="昵称" class="vanNavBar">
      <div slot="left" @click="$emit('usrNameShow')">取消</div>
      <div slot="right" @click="completeUserName">完成</div>
    </van-nav-bar>

    <!-- 输入框 -->
    <van-field
      v-model="userNameMessage"
      autosize
      type="textarea"
      maxlength="7"
      show-word-limit
    />
  </div>
</template>

<script>
// 编辑用户个人资料
import { changeUserProfile } from '@/api/user'
export default {
  name: 'updateeName',
  props: {
    // 用户昵称
    // userName: {
    //   type: String,
    //   required: true
    // }
    // 使用简写的方式
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      userNameMessage: this.value // 昵称
    }
  },
  methods: {
    // 完成更改昵称
    async completeUserName () {
      try {
        await changeUserProfile({
          name: this.userNameMessage
        })
        // 更改父组件的值
        this.$emit('input', this.userNameMessage)
        // 更改完成关闭弹出层
        this.$emit('usrNameShow')
        // 提示消息
        this.$toast({
          message: '修改成功',
          icon: 'success'
        })
      } catch (err) {
        // 如果满足这个条件 代表昵称重复
        if (err && err.response && err.response.status === 409) {
          this.$toast({
            message: '昵称重复',
            icon: 'warning'
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
