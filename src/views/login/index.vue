<template>
  <div class="loginIndex">
    <!-- 导航菜单 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 表单 -->
    <!--
      当表单提交的时候回触发 submit事件
      只有表单验证通过才会调用 submit 方法
      所以直接绑定登录按钮的点击事件
      绑定到这里只有表单验证通过才可以发送请求
      表单验证不通过不会发送请求
      :show-error="false" 是否在校验不通过时标红输入框
      :show-error-message="false" 是否在校验不通过时在输入框下方展示错误提示
      validate-first 是否在某一项校验不通过时停止校验
    -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      ref="login-form"
      validate-first
      @submit="onLogin"
      @failed="onFailed"
    >
      <!-- 手机号 -->
      <van-field
        clearable
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        name="mobile"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <!-- 验证码 -->
      <van-field
        v-model="user.code"
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <!-- 获取验证码倒计时 -->
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="showTime"
            center
            @finish="showTime = false"
          />
          <van-button
            v-if="!showTime"
            class="obtainBtn"
            size="small"
            :loading="loading"
            round
            center
            @click.prevent="onSendSms"
          >获取验证码</van-button>
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <div class="btnBox">
        <!-- 登录的点击事件绑定给了表单 -->
        <van-button type="info" block>登录</van-button>
      </div>
    </van-form>

    <!-- 说明 -->
    <p class="describe">任何手机号都可以登录</p>
    <p class="describe">接收验证码时间可能会较长</p>
    <p class="describe">可以使用万能验证码 246810</p>
  </div>
</template>

<script>
// 登录 - 获取短信验证码
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'loginIndex',
  data () {
    return {
      // 用户信息
      user: {
        mobile: '13911111112', // 手机号
        code: '246810' // 验证码
      },
      // 表单验证 required：必填项
      formRules: {
        // 手机验证
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '手机号格式错误' }

        ],
        // 验证码验证
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^[0-9]{6}$/, message: '验证码格式错误' }
        ]
      },
      showTime: false, // 倒计时显示状态
      loading: false // 按钮的禁用状态
    }
  },
  methods: {
    // 登录
    onLogin () {
      Toast.loading({
        message: '登录中...', // 展示的文字
        forbidClick: true, // 展示时候背景不能点击
        duration: 0 // 展示时长为 0 时toast 不会消失
      })
      login(this.user).then(res => {
        // console.log(res)
        Toast({
          message: '登录成功',
          icon: 'success'
        })
        // 登录成功后 将用户信息数据(token)等数据放到 Vuex 的容器中
        this.$store.commit('setUser', res.data.data)

        // 在跳转页面之前把 layoutIndex 的缓存清除
        this.$store.commit('clearCachePages', 'layoutIndex')

        this.$router.push('/')
        // this.$router.push(this.$router.query.redirect || '/')
      }).catch(err => {
        Toast.fail('登录失败，手机号或验证码错误')
        console.log(err)
      })
    },
    // async 方法
    // async onLogin () {
    //   const res = await login(this.user)
    //   console.log(res)
    // }
    // 提交表单且验证不通过后触发
    onFailed (error) {
      // 如果 error.errors[0] 有值 就弹窗提示
      if (error.errors[0]) {
        Toast({
          position: 'top',
          message: error.errors[0].message
        })
      }
    },
    // 获取验证码
    async onSendSms () {
      // this.$refs['login-form'].validate('mobile')
      this.loading = true // 禁用按钮
      try {
        await this.$refs['login-form'].validate('mobile')

        // 验证通过 请求发送验证码
        await sendSms(this.user.mobile)

        this.showTime = true // 显示倒计时
      } catch (err) {
        // console.log('验证失败', err)
        // console.dir(err)
        let message = ''
        if (err && err.request && err.request.status === 429) {
          // 如果频发发送验证码
          message = '操作频繁'
        } else if (err.name === 'mobile') {
          // 手机验证不通过
          message = err.message
        } else {
          // 未知错误
          message = '系统异常，稍后再试'
        }
        // 提示错误信息
        Toast({
          position: 'top',
          message
        })
        this.loading = false // 取消禁用按钮
      }
    }
  }
}
</script>

<style lang="less" scoped>
.loginIndex {
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  background-color: #f5f7f9;
}
// 获取验证码的按钮
.obtainBtn {
  background-color: #ededed;
  width: 80px;
  height: 23px;
  // 按钮上的文字
  .van-button__text {
    color: #666666;
    font-size: 10px;
  }
}
// 登录按钮盒子
.btnBox {
  padding: 26px 14px;
  // 登录按钮
  .van-button {
    background-color: #6db4fb;
    // 按钮里的文字
    .van-button__text {
      font-size: 15px;
    }
  }
}
// 条款
.describe {
  text-align: center;
  font-size: 15px;
  color: #666666;
}
</style>
