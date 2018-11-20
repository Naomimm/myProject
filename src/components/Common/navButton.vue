<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="标题：">
        <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="作者：">
        <el-input :placeholder="$t('table.author')" v-model="listQuery.author" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      </el-form-item>
      <el-form-item label="日期：">
        <el-select placeholder="选择日期时间">
          <el-option label="区域一" value="shanghai"/>
          <el-option label="区域二" value="beijing"/>
        </el-select>
      </el-form-item>
      <el-form-item class="button">
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">增加</el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="downloadFilter">导出</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getNewsList } from '@/api/news'

export default {
  name: 'NavButton',
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getNewsList({ limit: this.listQuery.limit, page: this.listQuery.page }).then(res => {
        console.log(res)
        const data = res.data
        if (data.code === 200) {
          this.list = data.data.items || []
          this.total = data.data.total
        } else {
          this.$message({
            message: data.message,
            type: 'warning'
          })
        }
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.$router.push('/news/detail/0')
    },
    handleUpdate(row) {
      this.$router.push('/news/detail/' + row.id)
    },
    // 导出文件
    downloadFilter() {

    }
  }
}
</script>

<style scoped>
.button .el-button--primary{
    min-width: 100px;
    margin: 0px 15px;
  }
  .operation{
    background-color: none;
    border: none;
  }
</style>

