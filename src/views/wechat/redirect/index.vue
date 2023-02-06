<template>
  <div style="text-align:center">
    <div v-if="result">
      <i>用户已经授权</i>
      <br>
      <i>{{ msg }}</i>
    </div>
    <div v-else>
      <i>用户拒绝了授权</i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: '',
      state: '',
      result: false,
      msg: ''
    }
  },
  created() {
    const { query } = this.$route
    this.code = query.code
    this.state = query.state
    this.result = this.code && this.code !== ''

    if (this.result) {
      this.$store
        .dispatch('user/wechatlogin', { code: this.code, state: this.state })
        .then((res) => {
          if (window.top !== window.self) {
            window.top.location = 'https://www.51zhu.cn'
          }
        }).catch(err => {
          this.msg = err.message || '登录失败'
          console.log(err)
        })
    }
  },
  render: function(h) {
    return h()
  }
}
</script>
