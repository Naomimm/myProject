<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>-->
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Created">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Nick">
        <template slot-scope="scope">
          <span>{{ scope.row.nick }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="HeadImg">
        <template slot-scope="scope">
          <!--<span>{{ scope.row.head_img.String }}</span>-->
          <img :src="scope.row.head_img.String" style="max-height: 80px;"/>
        </template>
      </el-table-column>

      <el-table-column  label="Tel" >
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="Gender" >
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="Email" >
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column  label="Authorized" >
        <template slot-scope="scope">
          <span>{{ scope.row.authorized }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>-->
          <el-button size="mini" type="default" @click="handleUserAssets(scope.row)">资产</el-button>
          <el-button size="mini" type="warning" @click="handleSendWEC(scope.row)" style="">送WEC</el-button>
          <el-button size="mini" type="warning" @click="handleSendCNY(scope.row)" style="">送CNY</el-button>
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

    <el-dialog title="用户资产" :visible.sync="dialogAssetsVisible">
      <p>
        <b>{{userWallet.address}}</b>
      </p>
      <el-table v-loading="listLoading" :data="userAssets" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="Asset Code" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.asset_code }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Asset Issuer">
          <template slot-scope="scope">
            <span>{{ scope.row.asset_issuer  }}</span>
          </template>
        </el-table-column>

        <el-table-column width="180px" align="center" label="Balance">
          <template slot-scope="scope">
            <span>{{ scope.row.balance  }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssetsVisible = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { getUserList, createUser, updateUser, deleteUser } from '@/api/users'
  import { getUserWallet } from '@/api/wallet'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import * as Stellar from '@/utils/horizon'

  export default {
    name: "issuers",
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
        },
        dialogAssetsVisible: false,
        userAssets: [],
        userWallet: {address: ''},
      }
    },
    mounted: function () {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        getUserList({limit: this.listQuery.limit, page: this.listQuery.page}).then(res => {
          console.log(res);
          let data = res.data;
          if (data.code == 200) {
            this.list = data.data.items || []
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
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          company: '',
        }
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
          });
        });

      },
      deleteData(row){
        deleteUser(row.id).then( res => {
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
      async getUserWallet(userId){
        let resp = await getUserWallet(userId)
        if (resp.data.code == 200 && resp.data.data.total > 0) {
          this.userWallet.address = resp.data.data.items[0].address
          return resp.data.data.items[0]
        }else{
          return null
        }
      },
      async handleUserAssets(row) {
        this.userAssets = []
        this.dialogAssetsVisible = true
        let w = await this.getUserWallet(row.id)
        let acc = await Stellar.loadAccount(w.address)
        //console.log(acc)
        for (let b of acc.balances) {
          if (b.asset_type == 'native') {
            this.userAssets.push({
              asset_code: process.env.NATIVE_ASSET_CODE + '',
              asset_issuer: 'native',
              balance: b.balance,
            })
          } else {
            this.userAssets.push({
              asset_code: b.asset_code,
              asset_issuer: b.asset_issuer,
              balance: b.balance,
            })
          }
        }
      },
      async handleSendCNY(row){
        let w = await this.getUserWallet(row.id)
        console.log('getUserWallet:', w)
        this.$prompt('请输入要发送的CNY金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\d+/,
          inputErrorMessage: 'CNY金额格式不正确'
        }).then(async ({ value }) => {
          // alert(value)
          let resp = await Stellar.pay(
            process.env.CNY_DISTRIBUTOR_ADDRESS,
            process.env.CNY_DISTRIBUTOR_SEED,
            w.address,
            process.env.CNY_ASSET_CODE,
            process.env.CNY_ASSET_ISSUER,
            value
          )
          console.log("send CNY resp: ", resp)
          this.$message({
            type: 'success',
            message: '成功发送CNY, 金额: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      async handleSendWEC(row){
        let w = await this.getUserWallet(row.id)
        console.log('getUserWallet:', w)
        this.$prompt('请输入要发送的WEC金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\d+/,
          inputErrorMessage: 'WEC金额格式不正确'
        }).then(async ({ value }) => {
          //alert(value)
         let resp = await Stellar.payNative(
            process.env.MAIN_ADDRESS,
            process.env.MAIN_SEED,
            w.address,
            value
          )
          console.log("send wec resp: ", resp)
          this.$message({
            type: 'success',
            message: '成功发送WEC, 金额: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
