<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">课程列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="searchCondition.courseName" clearable placeholder="课程名称" class="filter-item input-search" />
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
          <el-table v-loading="tableLoading" :data="courseList" :fit="true" border highlight-current-row>
            <el-table-column prop="courseName" label="课程名称" />
            <el-table-column prop="duration" label="课程周期(天)" />
            <el-table-column prop="price" label="价格(分)" />
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


    <el-dialog :visible.sync="formVisiable" title="课程信息" width="450px" :close-on-click-modal="false" @close="handleReset('form')">
      <el-form ref="form" :rules="courseFormRules" :model="course" label-width="100px" :inline-message="true">
        <el-form-item label="课程名称" prop="courseName">
          <el-col :span="12">
            <el-input
              style="width:250px"
              v-model="course.courseName"
              placeholder="课程名称"
              maxlength="20"
              show-word-limit
            />
          </el-col>
        </el-form-item>
        <el-form-item label="课程周期(天)" prop="duration">
          <el-col :span="12">
           <el-input-number style="width:250px" controls-position="right" v-model="course.duration" label="课程周期"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="价格(分)" prop="price">
          <el-input
          style="width:250px"
            v-model="course.price"
            maxlength="10"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="课程状态" prop="isDelete">
        <el-switch
                v-model="course.isDelete"
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
    QueryCourse,
    SaveCourse
} from '@/api/data/data'
import { deepClone } from '@/utils/index'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Course',
  directives: {
    waves
  },
  data() {
    return {
      // 数据
      courseList: [],
      tableLoading: false,

      // 搜索表单
      searchCondition: {
        courseName: ''
      },

      // 新增表单
      formVisiable: false,
      course: {
        courseName: '',
        price: 0,
        duration: 0,
        isDelete: 0
      },
      courseFormRules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ], 
        duration: [
          { required: true, message: '请输入课程周期', trigger: 'change' }
        ], 
        price: [
          { required: true, message: '请输入价格', trigger: 'change' }
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
      this.QueryCourse()
    },
    QueryCourse(param) {
      this.tableLoading = true
      QueryCourse(param || {}).then(res => {
        this.courseList = res.data
        this.tableLoading = false
      })
    },
    handleEdit(row) {
        if(row && row.id)
            this.course = deepClone(row);
         this.formVisiable = true
    }, 
    handleSearch(type) {
      let param = {}
      if (type !== 'refresh') {
        param = this.searchCondition
      }
      this.QueryCourse(param)

      const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
      this.$message(tip)
    },
    handleReset(formName) {
      this.role = {}
      this.$refs[formName].resetFields()
    },
    handleCancel() {
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
    handlerSave() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        
        SaveCourse(this.course).then(res => {
          if (res.data) {
            this.QueryCourse()
            
            this.formVisiable = false
            this.$message('保存成功')
            this.course = {
                courseName: '',
                price: 0,
                duration: 0,
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
