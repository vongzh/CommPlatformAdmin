<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">限流配置</span>
        <el-card>
          <el-link :underline="false">客户端限流</el-link>
          <el-switch
            v-model="throttlePolicy.clientThrottling"
            active-color="#13ce66"
            inactive-color="#ff4949"
            style="margin-left: 0.9375rem;"
            @change="saveThrottlePolicy()"
          />
          <el-link :underline="false" style="margin-left: 9.375rem">终结点限流</el-link>
          <el-switch
            v-model="throttlePolicy.endpointThrottling"
            active-color="#13ce66"
            inactive-color="#ff4949"
            style="margin-left: 0.9375rem;"
            @change="saveThrottlePolicy()"
          />
          <el-link :underline="false" style="margin-left: 9.375rem">IP限流</el-link>
          <el-switch
            v-model="throttlePolicy.ipThrottling"
            active-color="#13ce66"
            inactive-color="#ff4949"
            style="margin-left: 0.9375rem;"
            @change="saveThrottlePolicy()"
          />
        </el-card>
      </el-collapse-item>
    </el-collapse>
    <el-tabs type="border-card">
      <el-tab-pane label="客户端">
        <el-col :span="14">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="mini" icon="el-icon-plus" @click="editRules(whiteListTypeEnum.CLIENT)" />
            </el-button-group>
          </div>
          <el-table :data="clientRules" :fit="true" highlight-current-row>
            <el-table-column prop="key" label="客户端令牌" />
            <el-table-column prop="perSecond" label="秒" />
            <el-table-column prop="perMinute" label="分钟" />
            <el-table-column prop="perHour" label="小时" />
            <el-table-column prop="perDay" label="天" />
            <el-table-column prop="perWeek" label="周" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="editRules(whiteListTypeEnum.CLIENT,scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" @click="deleteRule(whiteListTypeEnum.CLIENT,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" :offset="2">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="mini" icon="el-icon-plus" @click="saveWhiteList(whiteListTypeEnum.CLIENT)" />
            </el-button-group>
          </div>
          <el-table :data="throttlePolicy.clientWhitelist" :fit="true" highlight-current-row>
            <el-table-column label="白名单客户端">
              <template v-slot="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-delete" @click="removeWhiteList(whiteListTypeEnum.CLIENT,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="终结点">
        <el-col :span="14">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="mini" icon="el-icon-plus" @click="editRules(whiteListTypeEnum.ENDPOINT)" />
            </el-button-group>
          </div>
          <el-table :data="endpointRules" :fit="true" highlight-current-row>
            <el-table-column prop="key" label="终结点令牌" />
            <el-table-column prop="perSecond" label="秒" />
            <el-table-column prop="perMinute" label="分钟" />
            <el-table-column prop="perHour" label="小时" />
            <el-table-column prop="perDay" label="天" />
            <el-table-column prop="perWeek" label="周" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="editRules(whiteListTypeEnum.ENDPOINT,scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" @click="deleteRule(whiteListTypeEnum.ENDPOINT,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" :offset="2">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="mini" icon="el-icon-plus" @click="saveWhiteList(whiteListTypeEnum.ENDPOINT)" />
            </el-button-group>
          </div>
          <el-table :data="throttlePolicy.endpointWhitelist" :fit="true" highlight-current-row>
            <el-table-column label="白名单终结点">
              <template v-slot="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-delete" @click="removeWhiteList(whiteListTypeEnum.ENDPOINT,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="IP">
        <el-col :span="14">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="mini" icon="el-icon-plus" @click="editRules(whiteListTypeEnum.IP)" />
            </el-button-group>
          </div>
          <el-table :data="ipRules" :fit="true" highlight-current-row>
            <el-table-column prop="key" label="IP" />
            <el-table-column prop="perSecond" label="秒" />
            <el-table-column prop="perMinute" label="分钟" />
            <el-table-column prop="perHour" label="小时" />
            <el-table-column prop="perDay" label="天" />
            <el-table-column prop="perWeek" label="周" />
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="editRules(whiteListTypeEnum.IP,scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" @click="deleteRule(whiteListTypeEnum.IP,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6" :offset="2">
          <div class="tools">
            <el-button-group>
              <el-button v-waves size="mini" icon="el-icon-plus" @click="saveWhiteList(whiteListTypeEnum.IP)" />
            </el-button-group>
          </div>
          <el-table :data="throttlePolicy.ipWhitelist" :fit="true" highlight-current-row>
            <el-table-column label="白名单IP">
              <template v-slot="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="text" icon="el-icon-delete" @click="removeWhiteList(whiteListTypeEnum.IP,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="全局">
        <el-link :underline="false">是否包含被限流请求</el-link>
        <el-switch
          v-model="throttlePolicy.stackBlockedRequests"
          active-color="#13ce66"
          inactive-color="#ff4949"
          style="margin-left: 0.9375rem;"
          @change="saveThrottlePolicy()"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog :visible="ruleVisiable" :close-on-click-modal="false" @close="closeRuleForm">
      <div slot="title">
        <span>限流规则配置</span>
      </div>
      <el-form :model="rule" label-position="right" label-width="100px">
        <el-form-item label="规则对象" required>
          <el-col :span="10">
            <el-select v-model="rule.type" disabled placeholder="请选择">
              <el-option label="客户端" :value="whiteListTypeEnum.CLIENT" />
              <el-option label="终结点" :value="whiteListTypeEnum.ENDPOINT" />
              <el-option label="IP" :value="whiteListTypeEnum.IP" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="规则值">
          <el-col :span="10">
            <el-input v-model="rule.key" :disabled="disabledvalue" size="medium" placeholder="请输入规则对象" />
          </el-col>
        </el-form-item>
        <el-form-item label="秒" required>
          <el-col :span="10">
            <el-input-number v-model="rule.perSecond" :min="0" controls-position="right" />
          </el-col>
        </el-form-item>
        <el-form-item label="分钟" required>
          <el-col :span="10">
            <el-input-number v-model="rule.perMinute" :min="0" controls-position="right" />
          </el-col>
        </el-form-item>
        <el-form-item label="小时" required>
          <el-col :span="10">
            <el-input-number v-model="rule.perHour" :min="0" controls-position="right" />
          </el-col>
        </el-form-item>
        <el-form-item label="天" required>
          <el-col :span="10">
            <el-input-number v-model="rule.perDay" :min="0" controls-position="right" />
          </el-col>
        </el-form-item>
        <el-form-item label="周" required>
          <el-col :span="10">
            <el-input-number v-model="rule.perWeek" :min="0" controls-position="right" />
          </el-col>
        </el-form-item>
        <el-form-item />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeRuleForm()">取 消</el-button>
        <el-button size="small" type="primary" @click="saveRule(rule)">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetThrottlePolicy,
  SetThrottlePolicy
} from '@/api/sys/throttle'
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
export default {
  directives: {
    waves
  },
  data() {
    return {
      throttlePolicy: {
        clientThrottle: false,
        endpointThrottle: false,
        ipThrottle: false,
        stackBlockedRequests: false
      },
      disabledvalue: false,
      clientRules: [],
      endpointRules: [],
      ipRules: [],
      whiteListTypeEnum: {
        CLIENT: 1,
        ENDPOINT: 2,
        IP: 3
      },
      ruleVisiable: false,
      rule: {
        perSecond: 0,
        perMinute: 0,
        perHour: 0,
        perDay: 0,
        perWeek: 0
      }
    }
  },
  watch: {
    'throttlePolicy.clientRules': {
      handler(val, oldVal) {
        this.clientRules = []

        for (const att in val) {
          const attVal = {
            key: att,
            ...(val[att])
          }
          this.clientRules.push(attVal)
        }
      },
      deep: true
      // immediate: true
    },
    'throttlePolicy.endpointRules': {
      handler(val, oldVal) {
        this.endpointRules = []

        for (const att in val) {
          const attVal = {
            key: att,
            ...(val[att])
          }
          this.endpointRules.push(attVal)
        }
      },
      deep: true
      // immediate: true
    },
    'throttlePolicy.ipRules': {
      handler(val, oldVal) {
        this.ipRules = []

        for (const att in val) {
          const attVal = {
            key: att,
            ...(val[att])
          }
          this.ipRules.push(attVal)
        }
      },
      deep: true
      // immediate: true
    }
  },
  created() {
    this.fetchThrottlePolicy()
  },
  methods: {
    fetchThrottlePolicy() {
      GetThrottlePolicy().then(res => {
        this.throttlePolicy = res.data
      })
    },
    saveWhiteList(type) {
      this.$prompt('请输入白名单信息', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputPattern: /^.{0,200}$/,
        inputErrorMessage: '信息长度应在200位以内'
      }).then(({
        value
      }) => {
        switch (type) {
          case this.whiteListTypeEnum.CLIENT:
            this.throttlePolicy.clientWhitelist.push(value)
            break
          case this.whiteListTypeEnum.ENDPOINT:
            this.throttlePolicy.endpointWhitelist.push(value)
            break
          case this.whiteListTypeEnum.IP:
            this.throttlePolicy.ipWhitelist.push(value)
            break
        }

        this.saveThrottlePolicy()
      }).catch()
    },
    removeWhiteList(type, value) {
      switch (type) {
        case this.whiteListTypeEnum.CLIENT:
          this.throttlePolicy.clientWhitelist.splice(this.throttlePolicy.clientWhitelist.indexOf(value), 1)
          break
        case this.whiteListTypeEnum.ENDPOINT:
          this.throttlePolicy.endpointWhitelist.splice(this.throttlePolicy.endpointWhitelist.indexOf(value), 1)
          break
        case this.whiteListTypeEnum.IP:
          this.throttlePolicy.ipWhitelist.splice(this.throttlePolicy.ipWhitelist.indexOf(value), 1)
          break
      }

      this.saveThrottlePolicy()
    },
    saveThrottlePolicy() {
      SetThrottlePolicy(this.throttlePolicy).then(res => {
        if (res.data) {
          this.$message({
            type: 'info',
            message: '设置成功'
          })
          this.fetchThrottlePolicy()
        } else {
          this.$message({
            type: 'waring',
            message: '设置失败'
          })
        }
      })
    },
    editRules(type, rule) {
      if (rule) {
        this.ruleVisiable = true
        this.rule = rule
        this.rule.type = type
        this.fetchThrottlePolicy()
        this.disabledvalue = true
      } else {
        this.rule.type = type
        this.ruleVisiable = true
        this.fetchThrottlePolicy()
        this.disabledvalue = false
      }
    },
    closeRuleForm() {
      this.ruleVisiable = false
      this.rule = {}
    },
    saveRule(rule) {
      switch (this.rule.type) {
        case this.whiteListTypeEnum.CLIENT:
          this.throttlePolicy.clientRules[rule.key] = { ...this.rule }
          break
        case this.whiteListTypeEnum.ENDPOINT:
          this.throttlePolicy.endpointRules[rule.key] = { ...this.rule }
          break
        case this.whiteListTypeEnum.IP:
          this.throttlePolicy.ipRules[rule.key] = { ...this.rule }
          break
      }
      SetThrottlePolicy(this.throttlePolicy).then(res => {
        if (res.data) {
          this.closeRuleForm()
          this.fetchThrottlePolicy()
          this.$message({
            type: 'info',
            message: '规则设置成功'
          })
        } else {
          this.$message({
            type: 'waring',
            message: '规则设置失败'
          })
        }
      })
    },
    deleteRule(type, value) {
      switch (type) {
        case this.whiteListTypeEnum.CLIENT:
          delete this.throttlePolicy.clientRules[value.key]
          break
        case this.whiteListTypeEnum.ENDPOINT:
          delete this.throttlePolicy.endpointRules[value.key]
          break
        case this.whiteListTypeEnum.IP:
          delete this.throttlePolicy.ipRules[value.key]
          break
      }
      SetThrottlePolicy(this.throttlePolicy).then(res => {
        if (res.data) {
          this.fetchThrottlePolicy()
          this.$message({
            type: 'info',
            message: '规则删除成功'
          })
        } else {
          this.$message({
            type: 'waring',
            message: '规则删除失败'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .content {
    margin: 10px;
  }

</style>
