<template>
  <iframe ref="call" class="call-frame" />
</template>

<script>
import { QiYuLogin } from '@/api/aftersale/aftersale'
export default {
  name: 'Call',
  data() {
    return {
      corp_code: '',
      token: ''
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    init() {
      this.qiyuLogin()

      // const that = this
      // setTimeout(() => {
      //   that.session({
      //     sessionid: '123',
      //     usernumber: '15000000000',
      //     staffid: 123123,
      //     staffname: '王政'
      //   }
      //   )
      // }, 5 * 1000)

      // setTimeout(() => {
      //   that.sessionClose({
      //     sessionid: '123'
      //   }
      //   )
      // }, 30 * 1000)
    },
    qiyuLogin() {
      QiYuLogin().then(res => {
        if (res.result) {
          const data = res.data
          this.corp_code = data.corp_code
          this.token = data.token
          this.$parent.qiyuLogin = res.result
          this.addScript(data.sdk_url)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    session(session) {
      this.$parent.currentCall = session
    },
    sessionClose(data) {
      this.$parent.callEnd(data)
    },
    addScript(url) {
      this.$nextTick(() => {
        const frame = this.$refs['call']
        const window = frame.contentWindow ? frame.contentWindow : frame.contentDocument
        window.onunload = () => {
          window.qiConnect.logoff()
        }
        const script = document.createElement('script')
        script.type = 'application/javascript'
        script.src = url
        script.onload = () => {
          window.qiConnect.on({
            onload: () => {

            },
            session: (session) => {
              this.session(session)
            },
            sessionClose: (data) => {
              this.sessionClose(data)
            }
          })
        }
        window.document.head.appendChild(script)

        const style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML = `#CONTAINER-CC-TOOLBAR {
                            position: absolute;
                            left: 50px;
                            top: 0;
                            height: 100%;
                            width: 350px;
                            z-index: 999999;
                            overflow: hidden;
                          }`
        window.document.head.appendChild(style)
      })
    }
  }
}
</script>

<style>
.call-frame {
  width: 100%;
  height: 100%;
  border: 0px;
  outline: none;
  padding-right: 0px;
}
</style>
