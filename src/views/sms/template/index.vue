/* eslint-disable no-empty */
<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">短信模板</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="模板关键词" prop="key">
                <el-input v-model="searchCondition.key" clearable placeholder="模板关键词" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="模板内容" prop="content">
                <el-input v-model="searchCondition.content" clearable placeholder="模板内容" class="filter-item input-search" />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="searchSMSTemplates()">搜索</el-button>
              <el-button v-waves class="filter-item" type="warning" size="small" icon="el-icon-close" @click="resetForm('searchForm')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <div class="tools">
        <el-button-group>
          <el-button v-waves size="medium" icon="el-icon-plus" @click="handlerSaveTemplate()" />
          <el-button v-waves size="medium" icon="el-icon-refresh" @click="fetchSMSTemplateList(true)" />
        </el-button-group>
      </div>
      <div>
        <el-table v-loading="onLoading" :data="templateList" :fit="true" border stripe highlight-current-row>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.smsPlatforms" :fit="true" border stripe highlight-current-row>
                <el-table-column prop="platform" label="平台" width="200" />
                <el-table-column prop="templateId" label="平台模板编号">
                  <template v-slot="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.templateId" maxlength="50" show-word-limit />
                    <el-link v-else :underline="false">{{ scope.row.templateId }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="sort" label="平台排序">
                  <template v-slot="scope">
                    <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sort" :max="10" :min="0" />
                    <el-link v-else :underline="false">{{ scope.row.sort }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="isEnabled" label="状态" width="80">
                  <template v-slot="scope">
                    <el-tag :type="scope.row.isEnabled === YN.Y?'success':'danger'" @click="handlerEnabledPlatform(scope.row.id)">{{ scope.row.isEnabled === YN.Y ?'启用':'禁用' }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="135">
                  <template slot-scope="scope">
                    <el-button v-if="scope.row.isEdit" type="text" size="small" @click="savePlatform(scope.row)">保存</el-button>
                    <el-button v-if="scope.row.isEdit" type="text" size="small" @click="scope.row.isEdit = false,fetchSMSTemplateList()">取消</el-button>
                    <el-button v-if="!scope.row.isEdit" type="text" size="small" @click="scope.row.isEdit = true">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="placeDesc" label="模板场景" />
          <el-table-column prop="key" label="模板关键词" />
          <!-- <el-table-column prop="templateId" label="模板编号" /> -->
          <el-table-column prop="content" label="模板内容" />
          <el-table-column prop="desc" label="模板描述" />
          <el-table-column prop="createTime" label="创建时间">
            <template v-slot="scope">
              <el-link :underline="false" style="color: darkgrey;font-size: small;">{{ scope.row.createTime }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handlerAddPlatform(scope.row)">新增平台</el-button>
              <el-button type="primary" size="mini" @click="handlerSaveTemplate(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteSMSTemplate(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 0.625rem;">
        <el-pagination
          background
          layout="sizes,total, prev, pager, next, jumper"
          :total="totalCount"
          :page-size="pageSize"
          :current-page="pageIndex"
          :page-sizes="[10,20, 50, 100]"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <el-dialog :visible="formVisiable" title="短信模板" :close-on-click-modal="false" width="40%"  @close="closeTemplate()">
      <el-form ref="templateForm" :model="smsTemplate" label-width="100px" :rules="templateFormRules">
        <!-- <el-form-item label="平台" prop="platform">
          <el-col :span="16">
            <el-checkbox-group v-model="smsTemplate.platform" size="small">
              <el-checkbox-button :label="1">腾讯云</el-checkbox-button>
              <el-checkbox-button :label="2">华为云</el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-form-item> -->
        <el-form-item label="模板场景" prop="place">
          <el-col>
            <el-select v-model="smsTemplate.place" :disabled="smsTemplate.id>0">
              <el-option label="注册" :value="1" />
              <el-option label="找回密码" :value="2" />
              <el-option label="退款" :value="5" />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="模板关键词" prop="key">
          <el-col :span="16">
            <el-input v-model="smsTemplate.key" placeholder="关键词" maxlength="10" show-word-limit />
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="模板编号" prop="templateId">
          <el-col :span="16">
            <el-input v-model="smsTemplate.templateId" placeholder="编号" />
          </el-col>
        </el-form-item> -->
        <el-form-item label="模板内容" prop="content">
          <el-col :span="16">
            <!-- <el-input v-model="smsTemplate.desc" type="textarea" placeholder="描述" maxlength="20" show-word-limit /> -->
            <el-input v-model="smsTemplate.content" rows=" 4 "  type="textarea" placeholder="内容" maxlength="200" show-word-limit />
          </el-col>
        </el-form-item>
        <el-form-item label="模板描述" prop="desc">
          <el-col :span="16">
          <el-input v-model="smsTemplate.desc" rows=" 4 "  type="textarea" placeholder="描述" maxlength="20" show-word-limit />
          </el-col>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="saveSMSTemplate()">保存</el-button>
          <el-button @click="closeTemplate">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible="platformFormVisibale" title="短信平台" :close-on-click-modal="false" @close="closePlatformForm()">
      <el-form ref="platformForm" :model="smsPlatform" label-width="135px">
        <el-form-item label="模板信息">
          <el-col :span="16">
            <el-col :span="3">
              <el-tag type="info">{{ getSmsPlaceName(smsTemplate.place) }}</el-tag>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-tag type="success">{{ smsTemplate.key }}</el-tag>
            </el-col>
          </el-col>
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-col :span="16">
            <el-checkbox-group v-model="smsPlatform.platform" size="small" @change="unCheckedPlatform">
              <el-checkbox-button v-for="p in platform" :key="p.key" :label="p.key">{{ p.name }}</el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-form-item>
        <template v-for="(pt,i) in smsPlatform.platform">
          <el-form-item :key="pt" :label="getPlatformName(pt) + '模板编号'" prop="templateId">
            <el-col :span="16">
              <el-input v-model="smsPlatform.templateId[i]" placeholder="编号" maxlength="20" show-word-limit />
            </el-col>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="addPlatform">保存</el-button>
          <el-button @click="closePlatformForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSMSTemplates,
  GetSMSTemplate,
  SaveSMSTemplate,
  DeleteSMSTemplate,
  AddPlatform,
  EnabledPlatform,
  UpdatePlatform
} from '@/api/sms/sms'
import waves from '@/directive/waves'
import { deepClone } from '@/utils/index'
export default {
  name: 'SMSTemplate',
  directives: {
    waves
  },
  data() {
    return {
      pageSize: 10,
      pageIndex: 1,
      searchCondition1: {
        key: '',
        content: ''
      },
      searchCondition: {
        key: '',
        content: ''
      },
      onLoading: false,
      templateList: [],
      totalCount: 0,
      formVisiable: false,
      smsTemplate: {
        place: '',
        key: '',
        conent: '',
        desc: ''
      },
      platformFormVisibale: false,
      smsPlatform: {
        platform: [],
        templateId: []
      },
      templateFormRules: {
        place: [
          { required: true, message: '请选择模板场景', trigger: 'change' }
        ],
        key: [
          { required: true, message: '请输入模板KEY', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入模板内容', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入模板描述', trigger: 'change' }
        ]
      },
      platform: [{
        key: 'TENCENTCLOUD',
        name: '腾讯云'
      },
      {
        key: 'HUAWEICLOUD',
        name: '华为云'
      }
      ],
      YN: {
        Y: 1,
        N: 0
      }
    }
  },
  created() {
    this.fetchSMSTemplateList()
  },
  methods: {
    searchSMSTemplates() {
      this.searchCondition1 = deepClone(this.searchCondition)
      this.pageIndex = 1
      this.fetchSMSTemplateList(true)
    },
    fetchSMSTemplateList(tip) {
      const that = this
      const param = { ...this.searchCondition1,
        PageSize: this.pageSize,
        PageIndex: this.pageIndex
      }

      this.onLoading = true
      GetSMSTemplates(param).then(res => {
        that.templateList = res.data.rows.map((value, index, array) => {
          value.smsPlatforms.map((value, index, array) => {
            value.isEdit = false
            return value
          })
          return value
        })
        that.totalCount = res.data.total

        this.onLoading = false
        if (tip) {
          this.$message('搜索成功')
        }
      })
    },
    saveSMSTemplate() {
      this.$refs['templateForm'].validate((valid) => {
        if (!valid) {
          return
        }
        SaveSMSTemplate(this.smsTemplate).then(res => {
          if (res.data) {
            this.fetchSMSTemplateList()
            this.closeTemplate()
            this.resetForm('templateForm')
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '保存失败'
            })
          }
        })
      })
    },
    getSMSTemplate(id) {
      GetSMSTemplate(id).then(res => {
        this.smsTemplate = res.data
      })
    },
    deleteSMSTemplate(id) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteSMSTemplate(id).then(res => {
          if (res.data) {
            this.fetchSMSTemplateList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败'
            })
          }
        })
      }).catch(() => {

      })
    },
    closeTemplate() {
      this.formVisiable = false
      this.smsTemplate = {}
      this.resetForm('templateForm')
    },
    handlerSaveTemplate(id) {
      if (id) {
        this.getSMSTemplate(id)
      }

      this.formVisiable = true
    },
    handlerAddPlatform(template) {
      this.smsTemplate = template
      this.platformFormVisibale = true
    },
    handlerEnabledPlatform(id) {
      EnabledPlatform(id).then(res => {
        if (res.data) {
          this.fetchSMSTemplateList()
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '操作失败'
          })
        }
      })
    },
    addPlatform() {
      const data = { ...this.smsPlatform,
        smsTemplateId: this.smsTemplate.id
      }

      if (!data.platform || data.platform.length === 0) {
        this.$message.info('请选择平台')
        return
      }
      if (!data.templateId || data.templateId.length === 0 || data.platform.length !== data.templateId.length) {
        this.$message.info('请输入模板编号')
        return
      }

      AddPlatform(data).then(res => {
        if (res.data) {
          this.closePlatformForm()
          this.fetchSMSTemplateList()
          this.$message({
            type: 'success',
            message: '保存成功1'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '保存失败'
          })
        }
      })
    },
    closePlatformForm() {
      this.platformFormVisibale = false
      this.smsTemplate = {
        // place: '',
        // key: '',
        // conent: '',
        // desc: ''
      }
      this.resetForm('platformForm')
      // this.resetForm('templateForm')
    },
    handlePageChange(index) {
      this.pageIndex = index
      this.fetchSMSTemplateList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.fetchLogs()

    },
    savePlatform(platform) {
      UpdatePlatform(platform.id, platform.templateId, platform.sort).then(res => {
        if (res.data) {
          this.fetchSMSTemplateList()
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '保存失败'
          })
        }
      })
    },
    getSmsPlaceName(id) {
      let name = ''
      switch (id) {
        case 1:
          name = '注册'
          break
        case 2:
          name = '找回密码'
          break
        case 5:
          name = '退款'
          break
      }
      return name
    },
    getPlatformName(id) {
      let name = ''
      switch (id) {
        case 'TENCENTCLOUD':
          name = '腾讯云'
          break
        case 'HUAWEICLOUD':
          name = '华为云'
          break
      }
      return name
    },
    unCheckedPlatform(val) {
      if (this.smsPlatform.platform.length > 1) {
      // console.log(this.smsPlatform.templateId.length, this.smsPlatform.templateId, this.smsPlatform.platform.length, this.smsPlatform.platform)
        this.smsPlatform.platform.splice(this.smsPlatform.platform, 1)
        // if (this.smsPlatform.templateId.length >= 1) {
        //   this.smsPlatform.templateId.splice(this.smsPlatform.templateId, 1)
        // }
      }
    },
    resetForm(form) {
      this.$refs[form].resetFields()
    }
  }
}
</script>

<style>
  .el-table__expanded-cell {
    margin: 0 !important;
    padding: 0 !important;
  }
.el-table th > .cell{
  color: white;
}
</style>

<style scoped>
  .content {
    margin: 10px;
  }
</style>
