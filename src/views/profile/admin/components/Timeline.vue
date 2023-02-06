<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item,index) of timeline"
        :key="index"
        :timestamp="item.timestamp"
        placement="top"
      >
        <el-card>
          <h4>{{ item.title }}</h4>
           <p> {{ item.content }}</p>
            <p>业务参数:{{ item.businessParam }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-row v-if="timeline.length >= pageSize" style="text-align:center">
      <div v-loading="loading" style="height:60px;padding-top:30px;">
        <el-link v-if="!loading" @click="moreOperationLogTimes">查看更多</el-link>
      </div>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import { GetOperationLogTimes } from '@/api/sys/log'
export default {
  data() {
    return {
      timeline: [
        // {
        //   timestamp: '2019/12/31',
        //   title: '系统测试',
        //   content: '系统测试通知'
        // }
      ],
      pageIndex: 1,
      pageSize: 5,
      loading: false
    }
  },
  created() {
    this.getOperationLogTimes()
  },
  methods: {
    moreOperationLogTimes() {
      this.loading = true

      this.pageIndex++

      this.getOperationLogTimes(true)
    },
    getOperationLogTimes(append) {
      const param = { pageIndex: this.pageIndex, pageSize: this.pageSize }
      GetOperationLogTimes(param).then(res => {
        if (res.data && res.data.rows && res.data.rows.length > 0) {
          const opts = res.data.rows.map(log => {
            return {
              title: log.resourceTypeDesc,
              content: log.logContent,
              businessParam: log.businessParam,
              timestamp: log.optTime
            }
          })

          if (append) {
            this.timeline.push(...opts)

            this.loading = false
          } else {
            this.timeline = opts
          }
        } else {
          if (append) {
            this.$message.info('没有更多了')
            this.loading = false
          } else {
            this.timeline.push({
              timestamp: moment(new Date()).format('L'),
              title: '暂无操作',
              content: '暂无操作'
            })
          }
        }
      })
    }
  }
}
</script>
