<template>
  <div class="full-page">
    <div class="full-page-header">
      <slot name="header">
      </slot>
    </div>
    <div class="full-page-content">
      <slot name="content"></slot>
    </div>
    <div class="full-page-footer">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FullPage',
  methods: {
    initHeight () {
      const content = document.querySelector('.full-page-content')
      const clientHeight = document.body.clientHeight || document.body.offsetHeight
      const computedHeight = clientHeight - 151
      if (!content) {
        return
      }
      content.style.height = computedHeight + 'px'
      // 获取可见区域高度
    }
  },
  mounted () {
    this.initHeight()
    window.onresize = () => {
      this.initHeight()
    }
  }
}
</script>
<style lang="less">
  .full-page{
    width: 100%;
    &-header{
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #eee;
      padding-left: 20px;
      background-color: #fff;
    }
    &-content{
      background-color: #fff;
      width: 98%;
      margin: 20px auto;
      overflow-y: auto;
      p{
        margin: 0px;
        overflow-y: hidden;
      }
    }
  }
</style>
