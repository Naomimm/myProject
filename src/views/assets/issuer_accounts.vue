<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Created">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Issuer">
        <template slot-scope="scope">
          <span>{{ scope.row.issuer_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Asset" >
        <template slot-scope="scope">
          <span>{{ scope.row.asset_id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Address" >
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Seed" >
        <template slot-scope="scope">
          <span>{{ scope.row.seed }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="mnemonic" >
        <template slot-scope="scope">
          <span>{{ scope.row.mnemonic }}</span>
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
  import { getIssuerAccountList } from '@/api/issuer_accounts'
  import waves from '@/directive/waves' // 水波纹指令

  export default {
    name: "issuer_accounts",
    directives: {
      waves
    },
    data: function () {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        }
      }
    },
    mounted: function () {
      this.getList()
    },
    methods: {
      getList(){
        this.listLoading = true;
        getIssuerAccountList({page_size: this.listQuery.limit, page_index: this.listQuery.page}).then(res => {
          console.log(res);
          let data = res.data;
          if (data.code == 200) {
            this.list = data.data.items
            this.total = data.data.total
          } else {
            this.$message({
              message: data.message,
              type: 'warning'
            });
          }
          this.listLoading = false;
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

      },

    }
  }
</script>

<style scoped>

</style>
