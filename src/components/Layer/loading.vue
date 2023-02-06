<template>
  <label :id="options.id" :class="setClass">
    <span />
    <i v-if="options.content!=''" v-html="options.content" />
  </label>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // timeout: ""
    }
  },
  computed: {
    setClass() {
      const cls = {
        'vl-notify': true,
        'vl-notify-msg': true,
        'vl-notify-loading': true
      }
      if (this.options.content === '') {
        delete cls['vl-notify-msg']
      }
      return cls
    }
  },
  mounted() {
    setTimeout(() => {
      this.options.layer.close(this.options.id)
    }, this.options.time * 1000)
  }
}
</script>
