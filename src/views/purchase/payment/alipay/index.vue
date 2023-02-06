<template>
  <div v-html="apply">
    {{ apply }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      apply: ''
    }
  },
  mounted() {
    this.apply = this.$route.query.param
    if (!this.apply) {
      this.$alert('支付跳转失败,请返回重试', '提示', {
        confirmButtonText: '确定',
        type: 'error',
        callback: action => {
          window.close()
        }
      })
      return
    }

    this.$nextTick(() => {
      document.forms[0].submit()
    })
  }
}
</script>

<style>
</style>
