<template>
  <div :id="id + '_mask'" class="vl-notify-mask" :style="setOpacity" @click="close" />
</template>

<script>
import helper from './helper/helper.js'

export default {
  props: {},
  data() {
    return {
      id: '',
      type: 0, // 0（alert默认）1（页面层）2（iframe层）3（loading）4（tips层）,5(msg)
      title: '信息',
      content: '',
      area: 'auto',
      offset: 'auto',
      icon: -1,
      btn: '确定',
      time: 0,
      shade: true,
      yes: '',
      cancel: ''
    }
  },
  computed: {
    setOpacity() {
      if (this.type == 3) {
        return {
          opacity: 0
        }
      } else if (this.type == 2) {
        // iframe层级 需要给遮罩层设置z-index
        return {
          'z-index': parseInt(this.getStyle(this.id, 'z-index')) - 1
        }
      }
      return {}
    }
  },
  mounted() { },
  methods: {
    getStyle(el, styleProp) {
      const x = document.getElementById(el)
      let y = 0
      if (window.getComputedStyle) {
        y = document.defaultView
          .getComputedStyle(x, null)
          .getPropertyValue(styleProp)
      } else if (x.currentStyle) {
        y = x.currentStyle[styleProp]
      }
      return y
    },
    close(event) {
      if (this.shadeClose) {
        helper.clickMaskCloseAll(event, this.layer, this.id)
      }
    }
  }
}
</script>

<style lang="css">
.vl-notify-mask {
  background-color: #ccc;
  opacity: 0.4;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
