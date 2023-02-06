<template>
  <div v-if="show" id="cf" data-template="horizontal" data-theme="light">
    <span class="cf-wrapper">
      <a class="cf-text" @click="goNotice()">
        <strong>❤️</strong>
        <span>测试系统</span>
      </a>
      <a class="cf-powered-by" @click="close()">X</a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Notice',
  props: {},
  data() {
    return {
      show: true
    }
  },
  created() {},
  mounted() {
    const that = this
    setTimeout(() => {
      that.close()
    }, 3000)
  },
  methods: {
    goNotice() {
      this.$router.push({
        path: '/public/notice'
      })
    },
    close() {
      this.show = false
    }
  }
}
</script>

<style scoped>
  #cf[data-template][data-theme=dark],
  #cf[data-template][data-theme=dark] *,
  #cf[data-template][data-theme=light],
  #cf[data-template][data-theme=light] * {
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif
  }

  #cf[data-template][data-theme=dark] a,
  #cf[data-template][data-theme=light] a {
    box-shadow: none
  }

  div#cf[data-template=horizontal] span.cf-wrapper {
    font-size: 14px;
    box-sizing: border-box;
    width: 100%;
    line-height: 1.5;
    display: block;
    padding: 12px 11px;
    margin-bottom: 1rem;
    text-align: left;
  }

  div#cf[data-template=horizontal] span.cf-wrapper a.cf-text {
    text-decoration: none
  }

  div#cf[data-template=horizontal] span.cf-wrapper a.cf-text:before {
    margin-right: 4px;
    padding: 2px 6px;
    border-radius: 3px;
    content: "公告"
  }

  div#cf[data-template=horizontal] span.cf-wrapper a.cf-text span.cf-cta {
    text-decoration: underline
  }

  div#cf[data-template=horizontal] span.cf-wrapper a.cf-powered-by {
    text-decoration: none;
    float: right;
    font-size: 11px;
    line-height: 22px
  }

  div#cf[data-template=horizontal] span.cf-wrapper a.cf-powered-by:hover {
    text-decoration: underline;
    cursor: pointer
  }

  div#cf[data-template=horizontal][data-theme=dark] span.cf-wrapper {
    background-color: hsla(0, 0%, 100%, .2)
  }

  div#cf[data-template=horizontal][data-theme=dark] span.cf-wrapper a.cf-text {
    color: hsla(0, 0%, 100%, .7)
  }

  div#cf[data-template=horizontal][data-theme=dark] span.cf-wrapper a.cf-text:before {
    background-color: #4caf50;
    color: #fff
  }

  div#cf[data-template=horizontal][data-theme=dark] span.cf-wrapper a.cf-text span.cf-cta {
    color: #fff
  }

  div#cf[data-template=horizontal][data-theme=dark] span.cf-wrapper a.cf-powered-by {
    color: hsla(0, 0%, 100%, .5)
  }

  div#cf[data-template=horizontal][data-theme=light] span.cf-wrapper {
    background-color: #f8f8f8
  }

  div#cf[data-template=horizontal][data-theme=light] span.cf-wrapper a.cf-text {
    color: rgba(0, 0, 0, .6)
  }

  div#cf[data-template=horizontal][data-theme=light] span.cf-wrapper a.cf-text:before {
    background-color: #4caf50;
    color: #fff
  }

  div#cf[data-template=horizontal][data-theme=light] span.cf-wrapper a.cf-text span.cf-cta {
    color: #2c6ac7
  }

  div#cf[data-template=horizontal][data-theme=light] span.cf-wrapper a.cf-powered-by {
    color: rgba(0, 0, 0, .5)
  }

  @media screen and (max-width:859px) {
    div#cf[data-template=horizontal] a.cf-powered-by {
      display: none
    }
  }
</style>
