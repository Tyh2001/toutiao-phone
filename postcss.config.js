/**
 * PostCSS 的配置文件
 * PostCSS 是基于 Node.js 运行的一个 css 的工具
 * 所以它的配置文件也是运行在 Node.js 中的
 */

// PostCSS 配置文件需要导出一个对象 
module.exports = {
  // 配置需要使用的相关插件
  plugins: {
    // 自动添加浏览器厂商声明前缀 用来兼容不同的浏览器
    // VueCli 已经配置了 autoprefixer
    // autoprefixer: {
    //   // browsers 用来配置要兼容的浏览器环境
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 把 px 转换为 rem
    'postcss-pxtorem': {
      // 转换的根元素基准值
      // 正常情况下是按照设计稿来的
      // 750 宽度的设计稿 750 / 10 = 75
      // 750 宽度的设计稿 375 / 10 = 37.5
      // Vant 组件库是基于逻辑像素 375 写的
      // 移动端页面一般都是以 iphone 6/7/8 为原型设计的
      // 设计稿都是基于物理像素 750 设计的
      // 所以如果设置成 75 那么我们就可以在设计稿中量多少写多少
      // 但是 Vant 样式就会变小 小了一半
      // 所以我们必须要设置成37.5
      // 所以我们设计稿量处理的长度必须要除以2
        rootValue: 37.5,

      // 需要转换的 css 属性 * 代表全部转换
      // 如果只是想转换字体的写法是
      // propList: ['font-size']
      propList: ['*']
    }
  }
}
