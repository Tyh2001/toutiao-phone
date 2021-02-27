<template>
  <div>
    <!-- 修改生日组件 -->
    <!-- :default-index="gender" -->
    <!-- <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      @confirm="completeBirthday"
      @cancel="$emit('birthdayShowShow')"
    /> -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="生日选择"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('birthdayShowShow')"
      @confirm="completeBirthday"
    />
  </div>
</template>

<script>
// 编辑用户个人资料
import { changeUserProfile } from '@/api/user'
// 引入时间对象
// import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  props: {
    // 生日信息
    birthday: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1960, 0, 1), // 可选择的最小日期
      maxDate: new Date(2025, 10, 1), // 可以选择的最大日期
      currentDate: new Date(this.birthday) // 用来同步当前时间
    }
  },
  methods: {
    // 点击确认按钮时 更改生日信息
    async completeBirthday () {
      const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`
      await changeUserProfile({
        birthday: date
        // birthday: dayjs(this.currentDate).format('YYYY-MM-DD')
      })
      // 更改父组件的值
      this.$emit('birthday', date)
      // 更改完成关闭弹出层
      this.$emit('birthdayShowShow')
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
</style>
