<template>
  <div id="SearchHistory">
    <!-- 历史记录 -->
    <van-cell title="搜索历史">
      <div v-if="isdeleteShow">
        <!-- 全部删除 更新历史记录变成一个空数组 -->
        <span @click="$emit('AllDelete', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isdeleteShow = false">完成</span>
      </div>
      <!-- 删除按钮 -->
      <van-icon
        v-else
        name="delete-o"
        @click="isdeleteShow = true"
      />
    </van-cell>
    <!-- 内容单元格 -->
    <van-cell
      v-for="(searchHistorie, index) in searchHistories"
      :key="index"
      :title="searchHistorie"
      @click="onDelet(index, searchHistorie)"
    >
      <!-- 删除按钮 -->
      <van-icon
        name="close"
        v-show="isdeleteShow"
      />
    </van-cell>
  </div>
</template>

<script>
// 设置本地存储的数据
// import { setItem } from '@/utils/storage'
export default {
  name: 'SearchHistory',
  // props 数据不能重新赋值 比如 xxx = xxx
  // 如果想要重新赋值 那么就要父组件自己修改
  props: {
    // 搜索的历史记录
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isdeleteShow: false // 删除历史记录的按钮显示状态
    }
  },
  methods: {
    // 删除历史记录的某一项
    // 传递索引值和当前的文本
    onDelet (index, searchHistorie) {
      // 如果是删除的状态 点击列表才会执行删除的操作
      if (this.isdeleteShow) {
        // 删除数据要处理：
        // 1. 修改本地存储数据
        // 2. 请求接口删除线上数据
        this.searchHistories.splice(index, 1)
        // 删除历史记录后台没有删除单个的功能 只有删除全部是接口
        // 这里只要把本地存储的数控处理一下就好了
        // 不用设置本地存储了 父组件通过监视统一处理了
        // setItem('search-histories', this.searchHistories)
        return
      }

      // 非删除状态那么点击就会进行搜索
      // 触发父组件的 onSearch 方法进行搜索 传递点击的那个历史记录的内容进行搜索
      this.$emit('search', searchHistorie)
    }
  }
}
</script>

<style lang="less" scoped>
#SearchHistory {
  position: fixed;
  top: 54px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  overflow: auto;
}
</style>
