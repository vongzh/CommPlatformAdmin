<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">数据配置</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="数据键" prop="key">
                <el-input v-model="searchCondition.key" clearable placeholder="数据键" class="filter-item input-search" />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchDatas()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" @click="dataConfigVisiable=true" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchDatas()" />
        </el-button-group>
      </div>
      <el-table v-loading="loading" :data="dataList" :fit="true" border stripe highlight-current-row>
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="domain" label="领域" />
        <el-table-column prop="key" label="数据键" />
        <el-table-column prop="keyName" label="键名称" />
        <el-table-column prop="value" label="数据值" />
        <el-table-column prop="group" label="数据组" />
        <el-table-column prop="valueName" label="值名称" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="modifyTime" label="编辑时间" />
        <el-table-column label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editDataConfig(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div style="margin-top: 0.625rem;">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        :page-size="pageSize"
        :current-page="pageIndex"
        @current-change="handlePageChange"
      />
    </div>
    <el-dialog :visible.sync="dataConfigVisiable" label-position="left" :inline="true" width="" :close-on-click-modal="false" @close="closeForm">
      <div slot="title">
        <span>数据配置</span>
      </div>
      <el-form>
        <!-- <el-form-item label="数据键" label-width="100" required>
          <el-col :span="8">
            <el-input v-model="dataConfig.key" placeholder="请输入数据键" maxlength="50" show-word-limit/>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-input v-model="dataConfig.keyName" placeholder="请输入数据键名" maxlength="50" show-word-limit />
          </el-col>
        </el-form-item> -->
        <el-row>
          <el-col :span="12" style="margin-left:9px">
            <el-form-item label="数据键" prop="title" label-width="100">
              <el-col :span="12">
                <el-input v-model="dataConfig.key" placeholder="请输入数据键" maxlength="50" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="数据键名">
              <el-col :span="12">
                <el-input v-model="dataConfig.keyName" placeholder="请输入数据键名" maxlength="50" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="数据值" label-width="100" required>
          <el-col :span="8">
            <el-input v-model="dataConfig.value" placeholder="请输入数据值" maxlength="100" show-word-limit />
          </el-col>
          <el-col :span="8" :offset="1">
            <el-input v-model="dataConfig.valueName" placeholder="请输入数据值名" maxlength="50" show-word-limit/>
          </el-col>
        </el-form-item> -->

        <el-row>
          <el-col :span="12">
            <el-form-item label="数据值" required label-width="100">
              <el-col :span="12">
                <el-input v-model="dataConfig.value" style="float:left" placeholder="请输入数据值" maxlength="100" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="margin-left:9px">
            <el-form-item label="数据值名">
              <el-col :span="12">
                <el-input v-model="dataConfig.valueName" placeholder="请输入数据值名" maxlength="50" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="数据组" required label-width="100">
          <el-col :span="6">
            <el-input v-model="dataConfig.group" placeholder="请输入数据组" maxlength="50" show-word-limit />
          </el-col>
        </el-form-item>
        <el-col style="margin-left:20px">
          <el-form-item label="备  注" label-width="100">
            <el-col :span="6">
              <el-input v-model="dataConfig.memo" type="textarea" :rows="9" style="width:300%" placeholder="请输入备注" maxlength="500" show-word-limit />
            </el-col>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="saveDataConfig">提交</el-button>
        <el-button size="small" @click="closeForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { GetDataConfigs, DelateDataConfig, DataConfig } from '@/api/sys/sysconfig'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'DataConfig',
  directives: {
    waves
  },
  data() {
    return {
      searchCondition: {
        key: ''
      },
      searchConditionRequest: {},
      totalCount: 0,
      pageSize: 10,
      pageIndex: 1,
      dataList: [],
      dataConfigVisiable: false,
      dataConfig: {},
      loading: false
    }
  },
  created() {
    this.fetchDatas()
  },
  methods: {
    searchDatas() {
      this.searchConditionRequest = this.searchCondition

      this.pageIndex = 1
      this.fetchDatas(true)
    },
    fetchDatas(tip) {
      const param = { ...this.searchConditionRequest,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }
      this.loading = true

      GetDataConfigs(param).then(res => {
        this.dataList = res.data.rows
        this.totalCount = res.data.total

        if (tip) {
          this.$message('搜索成功')
        }
        this.loading = false
      })
    },
    handleDelete(config) {
      const tip = '删除后不能恢复,确定要删除吗?'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DelateDataConfig({
          id: config.id
        }).then(res => {
          if (res.data) {
            this.fetchDatas()
            this.$message('删除成功')
          } else {
            this.$message(res.message || '删除失败')
          }
        })
      })
    },
    editDataConfig(config) {
      this.dataConfigVisiable = true
      this.dataConfig = config
      this.fetchDatas()
    },
    saveDataConfig() {
      if (!this.dataConfig.key) {
        this.$message('请填写数据键')
        return
      }
      if (!this.dataConfig.value) {
        this.$message('请填写数据值')
        return
      }
      if (!this.dataConfig.group) {
        this.$message('请填写数据组值')
        return
      }

      this.dataConfig.domain = 'business'
      DataConfig(this.dataConfig).then(res => {
        if (res.data) {
          this.dataConfigVisiable = false
          this.dataConfig = {}
          this.fetchDatas()
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchDatas()
    },
    closeForm() {
      this.dataConfigVisiable = false
      this.dataConfig = {}
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>

<style scoped>
.content{
  margin: 10px;
}
.dialog-footer{
  text-align: center;
}
</style>
