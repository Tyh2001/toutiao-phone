<template>
  <div>
    <!-- 修改性别组件 -->
    <!-- 选择器 -->
    <van-picker
      title="性别"
      show-toolbar
      :default-index="gender"
      :columns="columns"
      @confirm="completeGender"
      @cancel="$emit('genderShow')"
    />
  </div>
</template>

<script>
// 编辑用户个人资料
import { changeUserProfile } from '@/api/user'
export default {
  name: 'UpdatGender',
  props: {
    // 用户性别
    gender: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'] // 性别选择器
    }
  },
  methods: {
    // 点击确认按钮 更新数据
    // value 是选中是字段内容
    // index 是索引值
    async completeGender (value, index) {
      // console.log(value, index)
      await changeUserProfile({
        gender: index
      })
      // 更改父组件的值
      this.$emit('gender', index)
      // 完成之后关闭弹窗
      this.$emit('genderShow')
      // 提示消息
      this.$toast({
        message: '修改成功',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-picker__cancel,
/deep/ .van-picker__confirm {
  color: #1988FA !important;
}
</style>
