<template>
  <label
    :id="options.id"
    class="vl-notify vl-notify-tips"
    :class="[this.options.tips[1],'vl-notify-tips-'+ this.options.tips[0]]"
    v-html="options.content"
  >
    <em />
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
      timeout: ''
    }
  },
  computed: {
    offset() {
      return this.getOffset()
    }
  },
  async mounted() {
    const self = this
    if (this.options.time == 0) {
      this.options.time = 2
    }

    setTimeout(function() {
      self.btnyes()
    }, self.options.time * 1000)

    await this.getOffset()
  },
  methods: {
    'btnyes': function() {
      const o = document.getElementById(this.options.id)
      if (o) {
        if (typeof (this.options.yes) === 'function') {
          this.options.yes()
        }
        this.options.layer.close(this.options.id)
        // delete this.$layer.instances[this.options.id];
        // o.remove();
      }
    },
    sleep: function(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    async getOffset() {
      await this.sleep(1)
      let o = document.querySelector(this.options.title) // 用title传递that元素
      const bound = o.getBoundingClientRect()
      const oTips = document.querySelector('#' + this.options.id)
      const boundTips = oTips.getBoundingClientRect()

      const scrollTop = 0 // this.getScrollTop();
      let left = o.offsetLeft
      let top = o.offsetTop - scrollTop
      const jiantou = 8 + 1
      while (o.offsetParent) {
        o = o.offsetParent
        left += o.offsetLeft
        top += o.offsetTop
      }

      let offset = {}
      switch (this.options.tips[0]) {
        case 0:
          offset = {
            left: left + 'px',
            top: top - boundTips.height - jiantou + 'px'
          }
          break
        case 1:
          offset = {
            left: (left + bound.width + jiantou) + 'px',
            top: top + 'px'
          }
          break
        case 2:
          offset = {
            left: left + 'px',
            top: (top + bound.height + jiantou) + 'px'
          }
          break
        case 3:
          offset = {
            left: (left - boundTips.width - jiantou) + 'px',
            top: top + 'px'
          }
          break
      }
      oTips.style.left = offset.left
      oTips.style.top = offset.top
      // return offset;
    },
    getScrollTop() {
      var scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    }
  }
}
</script>
