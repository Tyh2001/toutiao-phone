<template>
  <div id="MyIndex">
    <!-- 登录用户上方资料 -->
    <div class="userInfo" v-if="user">
      <van-cell-group :border="false">
        <van-cell center>
          <!-- 头像 -->
          <div slot="icon">
            <van-image
              width="50"
              height="50"
              round
              fit="cover"
              class="userImg"
              :src="userInfo.photo"
            />
          </div>
          <div slot="title" class="userName">{{ userInfo.name }}</div>
          <van-button class="editBtn" size="small" round to="user/profile"
            >编辑资料</van-button
          >
        </van-cell>
      </van-cell-group>

      <!-- 宫格 -->
      <van-grid :border="false">
        <van-grid-item>
          <div slot="text" class="number">{{ userInfo.art_count }}</div>
          <div slot="text" class="numberText">头条</div>
        </van-grid-item>
        <van-grid-item>
          <div slot="text" class="number">{{ userInfo.follow_count }}</div>
          <div slot="text" class="numberText">关注</div>
        </van-grid-item>
        <van-grid-item>
          <div slot="text" class="number">{{ userInfo.fans_count }}</div>
          <div slot="text" class="numberText">粉丝</div>
        </van-grid-item>
        <van-grid-item>
          <div slot="text" class="number">{{ userInfo.like_count }}</div>
          <div slot="text" class="numberText">获赞</div>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 未登录状态上方展示 -->
    <div class="userInfo" v-else>
      <!-- 告诉自己是从哪里来的 方便路由跳转 -->
      <div
        class="OutuserImgBox"
        @click="
          $router.push({
            name: 'login',
            query: {
              redirect: '/my',
            },
          })
        "
      >
        <img class="OutuserImg" src="./images/头像.png" />
      </div>
      <div class="onLoginTitle">登录 / 注册</div>
    </div>

    <!-- 资料卡下方 -->
    <!-- 收藏/历史 导航 -->
    <van-grid column-num="2">
      <van-grid-item icon-prefix="toutiao" icon="shoucang" text="收藏" />
      <van-grid-item icon-prefix="toutiao" icon="lishi" text="历史" />
    </van-grid>

    <!-- 单元格 -->
    <!-- 消息通知 -->
    <van-cell class="bottomCell" title="消息通知" is-link v-if="user" />
    <!-- 小智同学 -->
    <van-cell class="bottomCell md-4" title="小智同学" is-link to="userChat" />
    <!--
      退出登录
      v-if="user" 通过登录状态来判断
      如果登录就渲染 否则就不渲染
    -->
    <van-cell
      v-if="user"
      class="bottomCell ignOut"
      title="退出登录"
      @click="onLogout"
    />
  </div>
</template>

<script>
// mapState 是一个方法
// 使用这样的方法拿到数据
import { mapState } from 'vuex'
// 获取用户自己的信息 -
import { getUserInfo } from '@/api/user'
export default {
  name: 'myIndex',
  data () {
    return {
      userInfo: {} // 当前登录用户信息
    }
  },
  // computed 计算属性
  computed: {
    // 把 vuex 中的数据映射的项目中
    // 获取到 state 中的 user
    ...mapState(['user'])
  },
  created () {
    this.loadgetUserInfo() // 获取用户自己的信息
  },
  methods: {
    // 退出登录
    onLogout () {
      this.$dialog.confirm({
        title: '退出确认',
        message: '退出当前账号，将不能同步收藏，发布评论等云端分享等'
      })
        // 确认执行这里
        .then(() => {
          // 确认清除用户状态
          // 点击确认后需要将 vuex 中的 user 变为 null 即可退出登录
          // 修改 state 中的数据需要交给 mutations
          // 所以这里将 mutations 里的 setUser 值修改为 null
          // 再由 mutations 将 user 改为 null
          // 本地存储也由 mutations 清空
          this.$store.commit('setUser', null)
        })
      // 取消执行这里
      // .catch(() => {
      //   // on cancel
      // })
    },
    // 获取用户自己的信息
    // async loadgetUserInfo () {
    //   const { data } = await getUserInfo()
    //   console.log(data)
    // }
    loadgetUserInfo () {
      getUserInfo().then(res => {
        // console.log(res)
        this.userInfo = res.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
#MyIndex {
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  background-color: #f5f7f9;
}
// 资料卡
.userInfo {
  background-image: url("./images/banner.png");
  background-repeat: no-repeat;
  height: 180px;
  // 去掉上面头像昵称宫格的背景色
  .van-cell-group {
    background-color: unset;
    height: 115px;
    box-sizing: border-box;
    padding: 38px 0 0 16px;
    .van-cell {
      background-color: unset;
    }
  }
  // 去掉上面四个宫格的背景色
  /deep/ .van-grid-item__content {
    background-color: unset;
    height: 65px;
  }
  // 用户头像
  .userImg {
    width: 65px;
    height: 65px;
    border: 1px solid #fff;
  }
  // 昵称
  .userName {
    color: #fff;
    font-size: 14px;
    padding-left: 11px;
  }
  // 保存按钮
  .editBtn {
    height: 16px;
    line-height: 16px;
    color: #666666;
  }
  // 宫格
  .number,
  .numberText {
    color: #fff;
  }
  .number {
    font-size: 13px;
  }
  .numberText {
    font-size: 12px;
  }
  // 未登录状态展示的样式-------
  .OutuserImgBox {
    width: 66px;
    margin: auto;
    padding-top: 55px;
    .OutuserImg {
      width: 66px;
      height: 66px;
      border-radius: 55%;
    }
  }
  .onLoginTitle {
    color: #fff;
    text-align: center;
    font-size: 13px;
    margin-top: 8px;
  }
}
/deep/ .van-grid {
  padding-bottom: 4.5px;
  .van-grid-item {
    height: 70px;
    .toutiao-shoucang {
      font-size: 23px;
      color: #eb5253;
    }
    .toutiao-lishi {
      font-size: 23px;
      color: #ff9d1d;
    }
    .van-grid-item__text {
      font-size: 14px;
      color: #333333;
    }
  }
}
// 下面三个选项
.bottomCell {
  height: 50px;
}
// 退出登录
.ignOut {
  color: #d86262;
  text-align: center;
}
.md-4 {
  margin-bottom: 4.5px;
}
</style>
