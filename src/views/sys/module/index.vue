<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">模块列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="模块名称" prop="moduleName">
                <el-input v-model="searchCondition.moduleName" clearable placeholder="模块名称" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="模块标记" prop="meta">
                <el-input v-model="searchCondition.meta" clearable placeholder="模块标记" class="filter-item input-search" />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleSearch('search')">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="handleReset('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" @click="handleEdit()" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
        </el-button-group>
      </div>
      <div class="content">
        <div class="table">
          <el-table v-loading="tableLoading" :data="moduleList" :fit="true" border highlight-current-row>
            <el-table-column prop="moduleName" label="模块名称" />
            <el-table-column prop="meta" label="模块标记" />
            <el-table-column prop="typeDesc" label="类型" />
            <el-table-column prop="path" label="路径" />
            <el-table-column prop="control" label="权限控制">
              <template slot-scope="scope">
                {{ scope.row.control === YNEnum.Y?'是':'否' }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="table-opt">
                  <el-button size="mini" type="info" @click="handleEdit(scope.row.id)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-dialog :visible.sync="formVisiable" title="模块" width="600px" :close-on-click-modal="false" @close="handleReset('form')">
      <el-form ref="form" :model="module" :rules="moduleFormRules" label-width="100px" :inline-message="true">
        <el-form-item label="模块名称" prop="moduleName">
          <el-col :span="12">
            <el-input
              v-model="module.moduleName"
              placeholder="名称"
              maxlength="20"
              style="width:350px"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="模块标识" prop="meta">
          <el-col :span="12">
            <el-input
              v-model="module.meta"
              placeholder="标识"
              style="width:350px"
              maxlength="20"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-col :span="12">
            <el-select v-model="module.type" style="width:350px">
              <el-option label="页面" :value="10" />
              <el-option label="按钮/接口" :value="20" />
            </el-select>
            <!-- <el-input v-model="module.type" placeholder="类型" /> -->
          </el-col>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-col :span="12">
            <el-input
              v-model="module.path"
              style="width:350px"
              placeholder="名称"
              maxlength="100"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="权限控制" prop="control">
          <el-col :span="12">
            <el-radio v-model="module.control" :label="1">是</el-radio>
            <el-radio v-model="module.control" :label="0">否</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="module.description"
            style="width:350px"
            rows="6"
            type="textarea"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlerSave">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getModule,
  getModules,
  deleteModule,
  saveModule
} from '@/api/sys/module'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'Module',
  directives: {
    waves
  },
  data() {
    return {
      moduleList: [],
      tableLoading: false,

      // 搜索表单
      searchCondition: {
        moduleName: '',
        meta: '',
        path: '',
        type: ''
      },

      // 新增表单
      formVisiable: false,
      module: {
        control: 1
      },
      YNEnum: {
        Y: 1,
        N: 0
      },
      moduleFormRules: {
        moduleName: [
          { required: true, message: '请输入模块名称', trigger: 'change' }
        ],
        meta: [
          { required: true, message: '请输入模块标识', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getModules()
    },
    getModules(param) {
      this.tableLoading = true
      getModules(param || {}).then(res => {
        this.moduleList = res.data

        this.tableLoading = false
      })
    },
    handleSearch(type) {
      let param = {}
      if (type !== 'refresh') {
        param = this.searchCondition
      }
      this.getModules(param)

      const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
      this.$message(tip)
    },
    handleReset(formName) {
      this.module = {}
      this.$refs[formName].resetFields()
    },
    handleDelete(module) {
      const tip = '删除后不能恢复,确定要删除' + module.moduleName + '?'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModule({
          id: module.id
        }).then(res => {
          if (res.data) {
            this.getModules()
            this.$message('删除成功')
          } else this.$message(res.message || '删除失败')
        })
      })
    },
    handleEdit(id) {
      this.formVisiable = true
      if (id) {
        getModule({
          id: id
        }).then(res => {
          this.module = res.data
        })
      }
    },
    handleCancel() {
      this.handleReset('form')
      this.formVisiable = false
    },
    handlerSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }

        const module = this.module
        saveModule(module).then(res => {
          if (res.data) {
            this.getModules()
            this.formVisiable = false
            this.$message('保存成功')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer{
  text-align: center;
}
</style>
