<template>
  <el-slider v-model="fontSize" :step="25" @change="handleSetSize" />
</template>

<script>
export default {
  data() {
    return {
      fontSize: 100
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let fontSize = 100
      switch (this.$store.getters.size) {
        case 'default':
          fontSize = 100
          break
        case 'medium':
          fontSize = 75
          break
        case 'small':
          fontSize = 50
          break
        case 'mini':
          fontSize = 25
          break
        default:
          fontSize = 100
          break
      }
      this.fontSize = fontSize
    },
    handleSetSize(size) {
      let fontSizeDesc = ''
      switch (size) {
        case 100:
          fontSizeDesc = 'default'
          break
        case 75:
          fontSizeDesc = 'medium'
          break
        case 50:
          fontSizeDesc = 'small'
          break
        case 25:
          fontSizeDesc = 'mini'
          break
        default:
          fontSizeDesc = 'default'
          break
      }

      this.$ELEMENT.size = fontSizeDesc
      this.$store.dispatch('app/setSize', fontSizeDesc)
      this.refreshView()
      this.$message({
        message: '字体大小切换 ' + fontSizeDesc,
        type: 'success'
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      const { fullPath } = this.$route

      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }
}
</script>
