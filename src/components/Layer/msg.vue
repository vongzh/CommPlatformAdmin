<template>
  <label :id="options.id" class="vl-notify vl-notify-msg" v-html="options.content" />
</template>

<script>
import helper from './helper/helper.js'
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
      timeout: ''
    }
  },
  async mounted() {
    await helper.sleep(this.options.time * 1000)
    this.btnyes()
  },
  methods: {
    btnyes(event) {
      const o = document.getElementById(this.options.id)
      if (o) {
        helper.btnyes(event, this.options)
      }
    }
  }
}
</script>
