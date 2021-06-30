<template>
  <div id="userIndex">
    <!-- 个人信息 编辑资料页面 -->
    <!-- 顶部导航栏 -->
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" />

    <!-- 单元格列表 -->
    <van-cell-group>
      <!-- 选择头像的上传框 -->
      <input
        type="file"
        ref="photoFile"
        accept="image/*"
        @change="onFileChange"
        hidden
      />
      <van-cell
        title="头像"
        value="内容"
        is-link
        center
        @click="$refs.photoFile.click()"
      >
        <div>
          <van-image width="30" height="30" round :src="userInfo.photo" />
        </div>
      </van-cell>
      <!-- 昵称 -->
      <van-cell
        title="昵称"
        :value="userInfo.name"
        is-link
        @click="usrNameShow = true"
      />
      <!-- 性别 -->
      <van-cell
        title="性别"
        :value="userInfo.gender === 0 ? '男' : '女'"
        is-link
        @click="genderShow = true"
      />
      <!-- 生日 -->
      <van-cell
        title="生日"
        :value="userInfo.birthday"
        is-link
        @click="birthdayShowShow = true"
      />
    </van-cell-group>

    <!-- 修改昵称弹出层 -->
    <van-popup
      v-model="usrNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!--
        当你传递给子组件的数据既要使用又要修改
        例如这里的 name
        这种情况下我们可以使用 v-model 简写
        v-model="name"
        默认名字叫 value 的数据
        监听 input 事件 @input="useeer.name = $event"
        v-model 本质还是组件通信 就是简化了一段代码
        **组件上 v-model 只能使用一次**
      -->
      <UpdateName
        v-model="userInfo.name"
        @usrNameShow="usrNameShow = false"
        v-if="usrNameShow"
      />

      <!-- <UpdateName
        :userName="userInfo.name"
        @usrNameShow="usrNameShow = false"
        @update-name="userInfo.name = $event"
      /> -->
    </van-popup>

    <!-- 修改性别弹出层 -->
    <van-popup v-model="genderShow" position="bottom">
      <!-- 修改性别组件 -->
      <UpdateGender
        @genderShow="genderShow = false"
        @gender="userInfo.gender = $event"
        :gender="userInfo.gender"
        v-if="genderShow"
      />
    </van-popup>

    <!-- 修改性别弹出层 -->
    <van-popup v-model="birthdayShowShow" position="bottom">
      <!-- 修改生日组件 -->
      <UpdateBirthday
        v-if="birthdayShowShow"
        @birthdayShowShow="birthdayShowShow = false"
        :birthday="userInfo.birthday"
        @birthday="userInfo.birthday = $event"
      />
    </van-popup>

    <!-- 修改性别弹出层 -->
    <van-popup
      v-model="photoShowShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 修改头像组件 -->
      <UpdatePhoto
        v-if="photoShowShow"
        :photoFile="file"
        @photoShowShow="photoShowShow = false"
        @updat-photo="userInfo.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
// 获取用户自己的资料
import { getUserProfile } from '@/api/user'
// 更改个人信息子组件
import UpdateName from './components/UpdateName'
// 更改性别组件
import UpdateGender from './components/UpdateGender'
// 更改生日组件
import UpdateBirthday from './components/UpdateBirthday'
// 更改性别组件
import UpdatePhoto from './components/UpdatePhoto'
export default {
  name: 'userIndex',
  components: {
    UpdateName, // 更改个人信息组件
    UpdateGender, // 更改性别组件
    UpdateBirthday, // 更改生日组件
    UpdatePhoto // 更改性别组件
  },
  data () {
    return {
      userInfo: {}, // 用户个人信息
      message: '', // 昵称输入框
      usrNameShow: false, // 修改昵称的弹出层
      genderShow: false, // 修改性别弹出层
      birthdayShowShow: false, // 修改生日弹出层
      photoShowShow: false, // 修改头像弹出层
      file: null // 选择图片的地址
    }
  },
  created () {
    this.loadgetUserProfile() // 获取用户信息
  },
  methods: {
    // 获取用户信息
    async loadgetUserProfile () {
      const { data } = await getUserProfile()
      // console.log(data)
      this.userInfo = data.data
    },
    // 上传文件当文本框发生改变时
    onFileChange () {
      // 当选择文件之后要展示弹出层
      this.photoShowShow = true

      // 在弹出层里面展示图片裁切预览图片
      // 先获取到选择的图片
      // const blob = window.URL.createObjectURL(this.$refs.photoFile.files[0])
      const file = this.$refs.photoFile.files[0]
      console.log(file)
      this.file = file
      // 清空文本框
      this.$refs.photoFile.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
// 列表
// .van-cell {
//   height: 50px;
// }
// 顶部导航栏
/deep/ .vanNavBar {
  background-color: #fff !important;
  // 标题文字
  .van-nav-bar__title,
  .van-icon {
    color: #000 !important;
  }
  .van-nav-bar__left,
  .van-nav-bar__right {
    color: #1988fa;
  }
}
</style>
