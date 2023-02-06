<template>
  <base-drag :options="options" :cls="cls">
    <div :id="id" class="vl-notify-content" :style="contentStyle" />
  </base-drag>
</template>

<script>
import helper from './helper/helper.js'
import drag from './components/drag/drag'

export default {
  components: {
    'base-drag': drag
  },
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
      cls: {
        'vl-notify-iframe': true
      },
      id: 'vlip' + new Date().getTime()
    }
  },
  computed: {
    contentStyle() {
      return {
        height: parseInt(this.options.area[1]) - 50 + 'px',
        minHeight: 'inherit',
        overflow: 'auto'
      }
    }
  },
  async mounted() {
    this.getContent()
    helper.hiddenScrollBar(this.options)
  },
  methods: {
    async getContent() {
      await helper.sleep(10)
      const propsData = helper.deepClone(this.options.content.data) || {}
      propsData['layerid'] = this.options.id
      propsData['lydata'] = this.options.content.data
      const instance = new this.options.content.content({
        // 具体参数信息，请参考vue源码
        parent: this.options.content.parent,
        propsData: propsData
      })
      instance.vm = instance.$mount()
      document.getElementById(this.id).appendChild(instance.vm.$el)
      this.options.layer.instancesVue[this.options.id].iframe = instance.vm
    },

    btnyes(event) {
      helper.btnyes(event, this.options)
    },
    btncancel(event) {
      helper.btncancel(event, this.options)
    }
  }
}
</script>
