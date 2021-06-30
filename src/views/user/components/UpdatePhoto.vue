<template>
  <div id="UpdateePhoto">
    <!-- 修改头像组件 -->
    <div class="photoBox">
      <img class="photoImg" :src="images" ref="photoImage" />
    </div>

    <!-- 底部导航栏 -->
    <van-nav-bar
      id="vanNavBar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('photoShowShow')"
      @click-right="onPhoto"
    />
  </div>
</template>

<script>
// 编辑用户个人头像
import { changeUserPhoto } from '@/api/user'
// 头像裁切
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'UpdateePhoto',
  props: {
    // 传递来的图片地址
    photoFile: {
      // type: Object,
      required: true
    }
  },
  data () {
    return {
      images: window.URL.createObjectURL(this.photoFile), // 预览的图片
      cropper: null // 裁切器实例
    }
  },
  mounted () {
    // 获取需要裁切的图片 dom
    const image = this.$refs.photoImage
    this.cropper = new Cropper(image, {
      aspectRatio: 1 / 1,
      viewMode: 1, // 裁切框不能移出图片范围
      dragMode: 'none', // 背景画布禁止移动
      // cropBoxMovable: false
      background: false
      // crop (event) {
      //   console.log(event.detail.x)
      //   console.log(event.detail.y)
      //   console.log(event.detail.width)
      //   console.log(event.detail.height)
      //   console.log(event.detail.rotate)
      //   console.log(event.detail.scaleX)
      //   console.log(event.detail.scaleY)
      // }
    })
    // console.log(cropper)
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob)
        })
      })
    },
    // 更换头像 传递数据
    async onPhoto () {
      // 显示保存中的状态 背景禁止点击
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0 // 持续展示 一直到相应结束
      })
      // 传递数据 更换头像
      // 如果要求 Content-Type 是 multipart / form-data
      // 那么一定要提交 FormData 数据对象
      // 专门用于文件上传的 不能提交 {} 对象 否则没有用

      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)

      // const fd = new FormData()
      // fd.append('参数要求的名称', 文件对象)
      // fd.append('photo', this.photoFile)
      await changeUserPhoto(fd)
      // 传递给父组件 改变头像状态
      this.$emit('updat-photo', window.URL.createObjectURL(file))

      // 关闭弹出层
      this.$emit('photoShowShow')

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
#UpdateePhoto {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  background-color: rgb(17, 17, 17) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
// 头像大小
.photoBox {
  .photoImg {
    display: block;
    max-width: 100%;
  }
}
// 底部导航栏
/deep/ #vanNavBar {
  position: fixed;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-color: transparent !important;
  // color: #fff;
}
</style>
