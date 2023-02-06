<template>
  <div class="app-container">
    <el-collapse value="search">
      <el-collapse-item name="search">
        <span slot="title" class="collapse-title">菜单列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="菜单标题" prop="title">
                <el-input
                  v-model="searchCondition.title"
                  clearable
                  placeholder="菜单标题"
                  class="filter-item input-search"
                />
              </el-form-item>
              <el-form-item label="菜单组件" prop="component">
                <el-input
                  v-model="searchCondition.component"
                  clearable
                  placeholder="菜单组件"
                  class="filter-item input-search"
                />
              </el-form-item>
              <el-form-item label="菜单路径" prop="path">
                <el-input
                  v-model="searchCondition.path"
                  clearable
                  placeholder="菜单路径"
                  class="filter-item input-search"
                />
              </el-form-item>
              <el-form-item label="菜单状态" prop="enabled">
                <el-select v-model="searchCondition.enabled" placeholder="状态" clearable>
                  <el-option label="禁用" value="0" />
                  <el-option label="启用" value="1" />
                </el-select>
              </el-form-item>

              <el-form-item label="父级" prop="parentId">
                <el-select v-model="searchCondition.parentId" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in parentselect"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

            </el-form>
            <div class="tools-btn">
              <el-button
                v-waves
                class="filter-item"
                type="primary"
                size="small"
                icon="el-icon-search"
                @click="handleSearch('search')"
              >搜索</el-button>
              <el-button
                v-waves
                class="filter-item"
                type="warning"
                size="small"
                icon="el-icon-close"
                @click="handleReset('searchForm')"
              >重置</el-button>
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
          <el-table
            v-loading="tableLoading"
            :data="menuList"
            :fit="true"
            border
            highlight-current-row
          >
            <el-table-column prop="title" label="菜单标题" width="109" />
            <el-table-column prop="name" label="名称" width="114" />
            <el-table-column prop="description" label="描述" width="155" />
            <el-table-column prop="component" label="菜单组件" width="114" />
            <el-table-column prop="path" label="菜单路径" width="124" />
            <el-table-column prop="parent.title" label="父级" width="104" />
            <el-table-column prop="redirect" label="跳转" width="104" />
            <el-table-column label="是否显示" width="93">
              <template slot-scope="scope">
                <el-col
                  effect="light"
                  :type="scope.row.visiable === YN.Y ? 'success' : 'danger'"
                >{{ menuVisiableFormat(scope.row.visiable) }}</el-col>
              </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标" width="82">
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.icon" />
              </template>
            </el-table-column>
            <el-table-column label="排序" width="74">
              <template slot-scope="scope">
                {{ scope.row.sort }}
                <!-- <el-input-number
                  v-model="scope.row.sort"
                  label="排序"
                  controls-position="right"
                  size="small"
                /> -->
              </template>
            </el-table-column>
            <el-table-column label="状态" width="70">
              <template slot-scope="scope">
                <el-tag
                  effect="plain"
                  :type="scope.row.enabled === YN.Y ? 'success' : 'danger'"
                  @click="handleEnabled(scope.row.id,scope.row.enabled)"
                >{{ menuStautsFormat(scope.row.enabled) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                  <!-- <el-button size="mini" type="warning" @click="handleEnabled(scope.row.id,scope.row.enabled)">{{ scope.row.enabled===YN.Y?'禁用':'启用' }}</el-button> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-card class="tree" shadow="hover">
          <el-tree
            :data="nestMenuList"
            :props="defaultProps"
            node-key="id"
            draggable
            default-expand-all
          />
        </el-card>
      </div>
    </el-card>

    <el-dialog title="编辑菜单" center :visible.sync="formVisiable" :close-on-click-modal="false" @close="handleReset('form')">
      <el-form ref="form" :model="menu" :rules="formRule" :inline-message="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-col :span="11">
                <el-input v-model="menu.title" placeholder="标题" maxlength="20" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-col :span="11">
                <el-input v-model="menu.name" placeholder="名称" maxlength="25" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件" prop="component">
              <el-col :span="11">
                <el-input v-model="menu.component" placeholder="组件" maxlength="25" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路径" prop="path">
              <el-col :span="11">
                <el-input v-model="menu.path" placeholder="路径" maxlength="50" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="跳转" style="margin-left:0.65rem" prop="redirect">
              <el-col :span="11">
                <el-input v-model="menu.redirect" placeholder="跳转" style="float:left" maxlength="50" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图标" prop="icon" style="margin-left:0.65rem">
              <el-col :span="11">
                <el-input v-model="menu.icon" placeholder="图标" maxlength="10" show-word-limit />
              </el-col>
              <el-col :offset="2" :span="1">
                <svg-icon :icon-class="menu.icon" />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="层级" prop="level">
              <el-col :span="12">
                <el-select v-model="menu.level" placeholder="请选择菜单层级" @change="menuLeveChange">
                  <el-option
                    v-for="item in menuLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级" prop="parentId" style="margin-left:0.65rem">
              <el-col :span="12">
                <el-select
                  v-model="menu.parentId"
                  :disabled="parentMenuDisabled"
                  filterable
                  placeholder="请选择父级菜单"
                  @change="parentChange"
                >
                  <el-option
                    v-for="item in parentMenuList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序" prop="sort" style="margin-left:0.65rem">
              <el-col :span="12">
                <el-input-number v-model="menu.sort" label="排序" />
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述" prop="description" style="margin-left:0.65rem">
              <el-col :span="11">
                <el-input v-model="menu.description" type="textarea" rows="6" maxlength="50" show-word-limit />
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left:0.65rem">
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enabled">
              <el-switch v-model="menu.enabled" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="visiable">
              <el-switch v-model="menu.visiable" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left:0.65rem">
          <el-col :span="12">
            <el-form-item label="导航显示" prop="breadcrumbShow">
              <el-switch v-model="menu.breadcrumbShow" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总是显示" prop="alwaysShow">
              <el-switch v-model="menu.alwaysShow" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
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
  getMenus,
  getNestMenus,
  saveMenu,
  getMenu,
  deleteMenu,
  enabledMenu
} from '@/api/sys/menu'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Menu',
  directives: {
    waves
  },
  data() {
    return {
      // 数据
      menuList: [],
      tableLoading: false,
      nestMenuList: [],
      parentselect: [],

      // 搜索表单
      searchCondition: {
        title: '',
        component: '',
        path: '',
        enabled: '',
        parentId: ''
      },

      // 树形菜单
      defaultProps: {
        label: 'title',
        children: 'subMenus'
      },

      //  菜单层级
      menuLevel: [
        {
          value: 1,
          label: '一级菜单'
        },
        {
          value: 2,
          label: '二级菜单'
        },
        {
          value: 3,
          label: '三级菜单'
        }
      ],

      menuLevelEnum: {
        level1: 1,
        level2: 2,
        level3: 3
      },

      // 新增表单
      formVisiable: false,
      parentMenuList: [],

      parentMenuDisabled: true,
      menu: {
        sort: 1,
        icon: ''
      },
      formRule: {
        name: [
          { required: true, message: '请输入菜单名', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'change' }
        ],
        component: [
          { required: true, message: '请输入组件名称', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请选择菜单层级', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请选择菜单路径', trigger: 'change' }
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
      this.getMenus()
      this.getNestMenus()
      this.getparentselect()
    },

    getparentselect() {
      getMenus({
        level: 1
      }).then(res => {
        this.parentselect = res.data
      })
    },

    getMenus(param) {
      this.tableLoading = true

      getMenus(param || {}).then(res => {
        this.menuList = res.data
        this.tableLoading = false
      })
    },

    getNestMenus() {
      getNestMenus().then(res => {
        this.nestMenuList = res.data
      })
    },
    getParentMenus(level) {
      const selected = {
        id: 0,
        title: '请选择'
      }
      if (level === this.menuLevelEnum.level1) {
        this.parentMenuList = [selected]
        this.parentMenuDisabled = true
      } else {
        getMenus({
          level: level - 1
        }).then(res => {
          const menus = res.data
          menus.unshift(selected)
          this.parentMenuList = menus
          this.parentMenuDisabled = false
        })
      }
    },
    handleEdit(id) {
      this.menu = { sort: 1, icon: '' }

      this.formVisiable = true
      if (id) {
        getMenu({
          menuId: id
        }).then(res => {
          const menu = res.data
          this.menu = menu
          this.getParentMenus(menu.level)
        })
      }
    },
    handleDelete(menu) {
      const tip = '删除后不能恢复,确定要删除' + menu.title + '?'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({
          id: menu.id
        }).then(res => {
          if (res.data) {
            this.afterOpt()
            this.$message('删除成功')
          } else this.$message(res.message || '删除失败')
        })
      })
    },
    handleEnabled(id, enabled) {
      const opt = enabled === this.YN.Y ? '禁用' : '启用'
      enabledMenu({
        id: id
      }).then(res => {
        if (res.data) {
          this.afterOpt()

          this.$message(opt + '成功')
        } else this.$message(res.message || opt + '失败')
      })
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

        const menu = this.menu
        saveMenu(menu).then(res => {
          if (res.data) {
            this.afterOpt()
            this.formVisiable = false
            this.$message('保存成功')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    handleSearch(type) {
      let param = {}
      if (type !== 'refresh') {
        param = this.searchCondition
      }
      this.getMenus(param)

      const tip = (type === 'refresh' ? '刷新' : '搜索') + '成功'
      this.$message(tip)
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    afterOpt() {
      this.getMenus(this.searchCondition)
      this.getNestMenus()
    },
    menuLeveChange(val) {
      this.menu.parentId = 0
      this.getParentMenus(val)
    },
    parentChange(val) {
      this.$forceUpdate()
    },
    menuStautsFormat(status) {
      let menuStatusDesc
      switch (status) {
        case 0:
          menuStatusDesc = '禁用'
          break
        case 1:
          menuStatusDesc = '启用'
          break
        default:
          menuStatusDesc = '未知'
          break
      }
      return menuStatusDesc
    },
    menuVisiableFormat(visiable) {
      let menuVisiable
      switch (visiable) {
        case 0:
          menuVisiable = '隐藏'
          break
        case 1:
          menuVisiable = '显示'
          break
        default:
          menuVisiable = '未知'
          break
      }
      return menuVisiable
    }
  }
}
</script>

<style scoped>
.input-search {
  width: 12.5rem;
}

.content {
  display: flex;
  justify-content: space-between;
}

.filter-container {
}

.table {
  width: 80%;
}

.tree {
  width: 16%;
}

</style>
