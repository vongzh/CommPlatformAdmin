
<template>
  <div ref="telService" class="drawer-container">
    <!-- // 如果要用按钮这里必须是个icon
    // 你先把功能实现了再说吧 -->
 
    <div slot="title">
    <el-button
      class="tipsBtn"
      type="warning"
      size="small"
      icon="el-icon-phone"
      @click="handleCustomerService"
    >客服</el-button> 
  </div>
  </div>
</template>

<script>
import call from "../../views/sales/components/call";
export default {
  name: 'TelService',
  props: {
    buttonTop: {
      default: 350,
      type: Number
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  mounted() {
    console.log(111111)
    this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.telService
    elx.remove()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
 
    insertToBody() {
      const elx = this.$refs.telService
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    },

 handleCustomerService() {
      if (this.qiyuLogin) {
        this.$message.success("客服系统已经登录过了");
        return;
      }

      this.qiyuLogin = true;
      this.$layer.iframe({
        content: {
          content: call, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            isSuccess: this.qiyuLogin
          }
        },
        fix: false,
        area: ["450px", "620px"],
        offset: "auto",
        shadeClose: false, // 点击遮罩是否关闭
        maxmin: true, // 开启最大化最小化
        shade: false,
        title: "客服",
        cancel: () => {
          // 关闭事件
          this.qiyuLogin = false;
        }
      });
    },

  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  z-index: 99999;
  position: absolute;
  right: 0;
  top: 45%;
}
</style>
 