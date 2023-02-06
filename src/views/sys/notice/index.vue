<template>
  <div class="content">
    <el-collapse value="search">
      <el-collapse-item name="search">
                <span slot="title" class="collapse-title">公告列表</span>
        <div class="filter-container">
          <el-card>
            <el-form ref="searchForm" :inline="true" :model="searchCondition" label-position="top">
              <el-form-item label="公告" prop="content">
                <el-input v-model="searchCondition.content" clearable placeholder="标题/内容" class="filter-item input-search" />
              </el-form-item>
              <el-form-item label="公告日期" prop="requestDate">
                <el-date-picker
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                />
              </el-form-item>
            </el-form>
            <div class="tools-btn">
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search">搜索</el-button>
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-close">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-card>
      <el-table :fit="true" border highlight-current-row>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="date" label="日期" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchCondition: {}
    }
  }
}
</script>

<style scoped>
.content{
  margin: 10px;
}
</style>
