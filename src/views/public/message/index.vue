<template>
  <div class="content">
    <el-card>
      <div slot="header">
        <span>消息</span>
      </div>
      <el-row>
        <MdInput v-model="msg" placeholder="输入消息内容">消息内容</MdInput>
      </el-row>
      <el-row style="margin-top: 3.125rem">
        <el-select v-model="to" placeholder="发送对象">
          <el-option :value="0" label="全部">全部</el-option>
          <el-option :value="50" label="客户">客户</el-option>
          <el-option :value="10" label="用户">用户</el-option>
          <el-option :value="100" label="系统用户">系统用户</el-option>
        </el-select>
      </el-row>
      <div class="tools">
        <el-button class="filter-item" type="primary" size="small" @click="sendMsg">发送</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import MdInput from '@/components/MDinput'
import signalR from '@/signalr/SignalR'
export default {
  components: {
    MdInput
  },
  data() {
    return {
      msg: '',
      to: 0
    }
  },
  methods: {
    sendMsg() {
      try {
          if (!this.msg) {
            this.$message('请输入消息')
            return
          }
          if (!signalR) {
            this.$message('服务器连接失败')
            return
          }
          signalR.sendMsg('SendToAll', { Body: this.msg, To: this.to })
      } catch (error) {
          console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.content {
  margin: 50px;
}
.tools {
  margin-top: 20px;
}
</style>
