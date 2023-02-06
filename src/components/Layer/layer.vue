<template lang="html">
  <component :is="getActiveName" :options="this.$data" />
</template>

<script>
import pzalert from './alert.vue'
import pzloading from './loading.vue'
import pzmsg from './msg.vue'
import pztips from './tips.vue'
import pzpage from './page.vue'
import pziframe from './iframe.vue'
import pzprompt from './prompt.vue'

export default {
  components: {
    pzalert,
    pzloading,
    pzmsg,
    pztips,
    pzpage,
    pziframe,
    pzprompt
  },
  data() {
    return {
      id: '',
      type: 0, // 0（alert默认）1（页面层）2（iframe层）3（loading）4（tips层）,5(msg),6(prompt)
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
    getActiveName() {
      const comps = [
        'pzalert',
        'pzpage',
        'pziframe',
        'pzloading',
        'pztips',
        'pzmsg',
        'pzprompt'
      ]
      return comps[this.$data.type]
    },
    isMsg: function() {
      return this.type === 5
    },
    isTips: function() {
      return this.type === 4
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less">
@import "./css/iconfont.css";
@import "./css/index.less";
</style>
