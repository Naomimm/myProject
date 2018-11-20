<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标题：">
          <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="作者：">
          <el-input :placeholder="$t('table.author')" v-model="listQuery.author" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">增加</el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" align="center" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" >
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="operation" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button class="operation" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>

  </div>
</template>

<script>

import { getFileList, getFile, creatFile, updataFile, deleteFile } from '@/api/file'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'File',
  directives: {
    waves
  },
  data: function() {
    return {
      value1:'',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: 0,
        title: '',
        author: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        title: [{ required: true, message: 'name is required', trigger: 'change' }],
        author: [{ required: true, message: 'company is required', trigger: 'blur' }]
      }
    }
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getFileList({ limit: this.listQuery.limit, page: this.listQuery.page }).then(res => {
        console.log(res.data)
        const data = res.data
        if (`${data.code}` === `200`) {
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
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        company: ''
      }
    },
    handleCreate() {
      this.$router.push('/file/detail/0')
    },
    handleUpdate(row) {
      console.log(row)
      this.$router.push('/file/detail/' + row.id)
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSearch() {

    },
    deleteData(row) {
      deleteFile(row.id).then(res => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
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
