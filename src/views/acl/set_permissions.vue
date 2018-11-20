<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.title')"
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{
      $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="setRolePermission">保存</el-button>

    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.checked"><input
            v-model="scope.row.checked"
            :value="scope.row.id"
            type="checkbox"
            checked></span>
          <span v-else><input v-model="scope.row.checked" :value="scope.row.id" type="checkbox"></span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="权限名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="权限编码">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="所属模块">
        <template slot-scope="scope">
          <span>{{ scope.row.module }}</span>
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
import { getPermissionList } from '@/api/permissions'
import { getRolePermissions, setRolePermissions } from '@/api/roles'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'SetPermissions',
  directives: {
    waves
  },
  props: ['roleId'],
  data: function() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        name: '',
        code: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      levelOptions: [
        1, 2, 3, 4, 5
      ],
      doing: false
    }
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const p = {
        limit: this.listQuery.limit,
        page: this.listQuery.page
      }
      getPermissionList(p).then(res => {
        console.log(res)
        const data = res.data
        if (data.code == 200) {
          data.data.items.forEach(item => {
            item.checked = false
          })
          this.list = data.data.items || []
          this.total = data.data.total
          this.getRolePermission()
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
        code: ''
      }
    },
    getRolePermission() {
      getRolePermissions(this.roleId).then(res => {
        const data = res.data.data
        if (data) {
          const ids = []
          data.forEach((item, index) => {
            ids.push(item.id)
          })

          this.list.forEach((item, index) => {
            item.checked = ids.indexOf(item.id) != -1
          })
        }
      })
    },
    setRolePermission() {
      const permissionIds = []
      this.list.forEach(item => {
        if (item.checked) { permissionIds.push(item.id) }
      })

      const p = {
        role_id: this.roleId,
        permission_ids: permissionIds.join(',')
      }
      setRolePermissions(p).then(res => {
        this.$notify({
          title: '成功',
          message: '设置成功',
          type: 'success',
          duration: 2000
        })
      })
      console.log(p)
    }
  }
}
</script>

<style scoped>
</style>
