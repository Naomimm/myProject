<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建后台账户</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="账户名">
        <template slot-scope="scope">
          <span>{{ scope.row.account_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.full_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" >
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? '正常' : '禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" >
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          <el-button type="primary" size="mini" @click="setRole(scope.row)" >设置角色</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="账户名" prop="account_name">
          <el-input v-model="temp.account_name"/>
        </el-form-item>
        <el-form-item label="用户名" prop="full_name">
          <el-input v-model="temp.full_name"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-loading="doing" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountList, getAccount, createAccount, updateAccount, deleteAccount } from '@/api/accounts'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Accounts',
  directives: {
    waves
  },
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
        account_name: '',
        full_name: '',
        password: '',
        is_login: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        account_name: [{ required: true, message: 'account_name is required', trigger: 'change' }],
        full_name: [{ required: true, message: 'full_name is required', trigger: 'change' }],
        password: [{ required: true, message: 'password is required', trigger: 'change' }]
      },
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
      getAccountList(p).then(res => {
        console.log(res)
        const data = res.data
        if (data.code == 200) {
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
        account_name: '',
        full_name: '',
        password: '',
        is_login: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign(this.temp, row) // copy obj

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          await createAccount(this.temp)

          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.doing = false
          this.getList()
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAccount(tempData.id, tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(row) {
      deleteAccount(row.id).then(res => {
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
    setRole(row) {
      this.$router.push('/acl/set_roles/' + row.id)
    }
  }
}
</script>

<style scoped>
</style>
