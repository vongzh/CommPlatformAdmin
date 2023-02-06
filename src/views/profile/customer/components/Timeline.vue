<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2019/12/31',
          title: '系统测试',
          content: '系统测试通知'
        },
        {
          timestamp: '2020/01/10',
          title: '系统上线',
          content: '系统上线通知'
        }
      ]
    }
  }
}
</script>
