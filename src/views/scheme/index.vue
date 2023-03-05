<template>
  <div class="app-container">
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" @click="handleEdit()" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="handleSearch('refresh')" />
        </el-button-group>
      </div>
      <div class="content">
        <div class="table">
          <el-table v-loading="tableLoading" :data="schemeList" :fit="true" border highlight-current-row>
            <el-table-column prop="schemeName" label="方案名称" />
            <el-table-column prop="serviceRate" label="服务费比例" >
              <template slot-scope="scope">
                        {{ scope.row.serviceRate }}%
              </template>
            </el-table-column>
            <el-table-column prop="totalNumber" label="期数" />
            <el-table-column prop="isDelete" label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isDelete === 1?'danger':'success'">
                        {{scope.row.isDelete === 1?'禁用':'启用'}}
                    </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="table-opt">
                  <el-button size="mini" type="info" @click="handleEdit(scope.row)">编辑</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>


    <el-dialog :visible.sync="formVisiable" title="方案信息" width="450px" :close-on-click-modal="false" @close="handleReset('form')">
      <el-form ref="form" :rules="schemeFormRules" :model="scheme" label-width="100px" :inline-message="true">
        <el-form-item label="方案名称" prop="schemeName">
          <el-col :span="12">
            <el-input
              style="width:250px"
              v-model="scheme.schemeName"
              placeholder="方案名称"
              maxlength="20"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="服务费比例" prop="serviceRate">
          <el-col :span="12">
           <el-input-number style="width:250px" controls-position="right" v-model="scheme.serviceRate" label="服务费比例"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="周期" prop="totalNumber">
            <el-input-number style="width:250px" controls-position="right" v-model="scheme.totalNumber" label="周期"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="isDelete">
        <el-switch
                v-model="scheme.isDelete"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value=0
                :inactive-value=1>
        </el-switch>
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
    QueryScheme,
    SaveScheme
} from '@/api/data/data'
import { deepClone } from '@/utils/index'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Scheme',
  directives: {
    waves
  },
  data() {
    return {
      // 数据
      schemeList: [],
      tableLoading: false,

      // 新增表单
      formVisiable: false,
      scheme: {
        schemeName: '',
        serviceRate: 0,
        totalNumber: 0,
        isDelete: 0
      },
      schemeFormRules: {
        schemeName: [
          { required: true, message: '请输入方案名称', trigger: 'change' }
        ], 
        serviceRate: [
          { required: true, message: '请输入服务费比例', trigger: 'change' }
        ], 
        totalNumber: [
          { required: true, message: '请输入周期', trigger: 'change' }
        ]
      },
      YN: {
        N: 0,
        Y: 1
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.QueryScheme()
    },
    QueryScheme(param) {
      this.tableLoading = true
      QueryScheme(param || {}).then(res => {
        this.schemeList = res.data
        this.tableLoading = false
      })
    },
    handleEdit(row) {
        if(row && row.id)
            this.scheme = deepClone(row);
         this.formVisiable = true
    }, 
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    handleCancel() {
      this.scheme = {}
      this.formVisiable = false
      this.handleReset('form')
    },
    formatter(row, column,cellValue,index){
        if(cellValue === 0 )
            return '启用';
        if(cellValue === 1 )
            return '禁用';
        return '未知' 
    },
    handleSearch(type) {
      this.QueryScheme()

      const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
      this.$message(tip)
    },
    handlerSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        
        SaveScheme(this.scheme).then(res => {
          if (res.data) {
            this.QueryScheme()
            
            this.formVisiable = false
            this.$message('保存成功')
            this.scheme = {
                schemeName: '',
                serviceRate: 0,
                totalNumber: 0,
                isDelete: 0
            }
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
