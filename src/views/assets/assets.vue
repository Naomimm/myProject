<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">创建用户资产</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
            <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
            </template>
        </el-table-column>

        <el-table-column width="180px" align="center" label="created">
            <template slot-scope="scope">
                <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="code">
            <template slot-scope="scope">
                <span>{{ scope.row.code }}</span>
            </template>
        </el-table-column>

        <el-table-column align="center" label="amount" >
            <template slot-scope="scope">
              <span>{{ scope.row.amount }}</span>
            </template>
        </el-table-column>

      <el-table-column align="center" label="IsNative" >
        <template slot-scope="scope">
          <span>{{ scope.row.is_native }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200" align="center" label="logo" >
        <template slot-scope="scope">
          <!--<span>{{ scope.row.logo.String }}</span>-->
          <img :src="scope.row.logo.String" style="max-height: 80px"/>
        </template>
      </el-table-column>

      <el-table-column align="center" label="level" >
        <template slot-scope="scope">
          <span>{{ scope.row.security_level }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="sort" >
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="comment" >
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          <el-button size="mini" type="warn" @click="handleDistribute(scope.row)">分发</el-button>
          <el-button size="mini" type="default" @click="handleDetail(scope.row)">详情</el-button>
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
        <el-form-item label="资产代码" prop="code">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="发行总量" prop="amount">
          <el-input v-model.number="temp.amount"/>
        </el-form-item>
        <el-form-item label="LOGO" prop="img">
          <!--<el-input v-model="temp.logo.String"/>-->
          <img-preivew :img-data.sync="temp.logo.String" />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="temp.comment"/>
        </el-form-item>
        <el-form-item label="等级" prop="security_level">
          <el-select v-model="temp.security_level" class="filter-item" placeholder="Please select">
            <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="temp.sort"/>
        </el-form-item>
        <el-form-item label="协议">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.protocol" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="doing = dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-loading="doing" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详情" :visible.sync="dialogDetail">
      <table border="0" cellpadding="0" cellspacing="0" class="detail">
        <tbody>
          <tr><td class="title">资产代码:</td><td>{{detail.code}}</td> <td class="title">发行总量:</td><td>{{detail.amount}}</td></tr>
          <tr><td class="title">Issuer address:</td><td colspan="3">{{detail.issuer_address}}</td>  </tr>
          <tr><td class="title">Issuer seed:</td><td colspan="3">{{detail.issuer_seed}}</td>  </tr>
          <tr><td class="title">Issuer mnemonic:</td><td colspan="3">{{detail.issuer_mnemonic}}</td>  </tr>
          <tr><td class="title">distributor address:</td><td colspan="3">{{detail.distributor_address}}</td>  </tr>
          <tr><td class="title">distributor seed:</td><td colspan="3">{{detail.distributor_seed}}</td>  </tr>
          <tr><td class="title">distributor mnemonic:</td><td colspan="3">{{detail.distributor_mnemonic}}</td>  </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDetail = false">{{ $t('table.cancel') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分发资产" :visible.sync="dialogDistribute">
      <table border="0" cellpadding="0" cellspacing="0" class="detail">
        <tbody>
          <tr><td class="title">资产代码:</td><td>{{detail.code}}</td> <td class="title">发行总量:</td><td>{{detail.amount}}</td></tr>
          <tr><td class="title">Issuer address:</td><td colspan="3">{{detail.issuer_address}}</td>  </tr>
          <tr><td class="title">Issuer seed:</td><td colspan="3">{{detail.issuer_seed}}</td>  </tr>
          <tr><td class="title">Issuer mnemonic:</td><td colspan="3">{{detail.issuer_mnemonic}}</td>  </tr>
          <tr><td class="title">distributor address:</td><td colspan="3">{{detail.distributor_address}}</td>  </tr>
          <tr><td class="title">distributor seed:</td><td colspan="3">{{detail.distributor_seed}}</td>  </tr>
          <tr><td class="title">distributor mnemonic:</td><td colspan="3">{{detail.distributor_mnemonic}}</td>  </tr>
          <tr><td class="title">分发地址：</td><td colspan="3"> <el-input v-model="distributor_address"/> </td></tr>
          <tr><td class="title">分发数量：</td><td colspan="3"> <el-input v-model.number="distributor_amount"/> </td></tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="doing = dialogDistribute = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-loading="doing" type="primary" @click="distribute">确认分发</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { getAssetList, getAsset, createAsset, updateAsset, deleteAsset } from '@/api/assets'
    import { createKeypair } from '@/api/wallet'
    import { getIssuerAccountList, createIssuerAccount } from '@/api/issuer_accounts'
    import * as Stellar from '@/utils/horizon'
    import waves from '@/directive/waves' // 水波纹指令
    import imgPreivew from '@/components/ImagePreview'

    export default {
      name: "assets",
      directives: {
        waves
      },
      components:{
        'img-preivew': imgPreivew
      },
      props: ['issuerId'],
      data: function () {
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
            issuer_id: 0,
            code: '',
            amount: 0,
            logo: {
              String: '',
              Valid: true
            },
            security_level: 1,
            comment: '',
            sort: 0,
            protocol: '',
          },
          dialogFormVisible: false,
          dialogStatus: '',
          textMap: {
            update: 'Edit',
            create: 'Create'
          },
          rules: {
            code: [{ required: true, message: 'type is required', trigger: 'change' }],
            amount: [{ type: 'number', required: true, message: 'amount is required', trigger: 'change' }],
            logo: [{ required: true, message: 'logo is required', trigger: 'blur' }]
          },
          levelOptions:[
            1,2,3,4,5
          ],
          doing: false,
          dialogDetail: false,
          detail: {
            code: "",
            amount: 0,
            issuer_address: '',
            issuer_seed: '',
            issuer_mnemonic: '',
            distributor_address: '',
            distributor_seed: '',
            distributor_mnemonic: '',
          },
          dialogDistribute: false,
          distributor_address: '',
          distributor_amount: 0,
        }
      },
      mounted: function () {
        this.getList()
      },
      methods: {
        getList(){
          this.listLoading = true;
          let p = {
            limit: this.listQuery.limit,
            page: this.listQuery.page
          }
          if(this.issuerId > 0){
            p.issuer_id = this.issuerId
          }
          getAssetList(p).then(res => {
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
        async getIssuerAccounts(row){
          let resp = await getIssuerAccountList({asset_id: row.id, limit: 10, page: 1})
          if (resp.data.code == 200) {
            let accounts = resp.data.data.items
            console.log(accounts)
            if(accounts == null) return
            for (let i = 0; i < accounts.length; i++) {
              let acc = accounts[i]
              if(acc.role == 'issuer'){
                this.detail.issuer_address = acc.address
                this.detail.issuer_seed = acc.seed
                this.detail.issuer_mnemonic = acc.mnemonic
              }
              if (acc.role == 'distributor'){
                this.detail.distributor_address = acc.address
                this.detail.distributor_seed = acc.seed
                this.detail.distributor_mnemonic = acc.mnemonic
              }
            }
          }
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
            issuer_id: this.issuerId,
            code: '',
            amount: 0,
            logo: {
              String: '',
              Valid: true
            },
            security_level: 1,
            comment: '',
            sort: 0,
            protocol: '',
            img: ''
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
            });
          });

        },
        async getKeypair() {
          let resp = await createKeypair({count: 1})
          let data = resp.data
          if ( data.code == '200' ) {
            return data.data
          }else{
            return null
          }
        },
        createData(){
          this.$refs['dataForm'].validate(async (valid) => {
            if (valid) {
              this.doing = true
              let issuer = await this.getKeypair()
              console.log('issuer: ', issuer)
              let distributor = await this.getKeypair()
              console.log('distributor: ', distributor)

              console.log("create account...")
              let resp1 = await Stellar.createAccount(issuer.keypairs[0].address)
              console.log(resp1)
              let resp2 = await Stellar.createAccount(distributor.keypairs[0].address)
              console.log(resp2)

              console.log('change trust issuer')
              let resp3 = await Stellar.changeTrust(distributor.keypairs[0].address,
                distributor.keypairs[0].seed,
                issuer.keypairs[0].address,
                this.temp.code,
                this.temp.amount+''
              )
              console.log(resp3)

              console.log("pay to distributor address")
              //(fromAddress, fromSeed, toAddress, code, issuerAddress, amount)
              let resp4 = await Stellar.pay(issuer.keypairs[0].address,
                issuer.keypairs[0].seed,
                distributor.keypairs[0].address,
                this.temp.code,
                issuer.keypairs[0].address,
                this.temp.amount+''
              )
              console.log(resp4)

              let issuer_id = parseInt(this.issuerId)

              this.temp.issuer_id = issuer_id
              this.temp.issuer_address = issuer.keypairs[0].address
              let resp5 = await createAsset(this.temp)
              let asset_id = parseInt(resp5.data.data)
              console.log('create asset id=', asset_id)

              let issuerAccount = {
                issuer_id,
                asset_id,
                role: 'issuer',
                mnemonic: issuer.mnemonic,
                address: issuer.keypairs[0].address,
                seed: issuer.keypairs[0].seed,
              }
              await createIssuerAccount(issuerAccount)

              let distributorAccount = {
                issuer_id,
                asset_id,
                role: 'distributor',
                mnemonic: distributor.mnemonic,
                address: distributor.keypairs[0].address,
                seed: distributor.keypairs[0].seed,
              }
              await createIssuerAccount(distributorAccount)

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
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              const tempData = Object.assign({}, this.temp)
              updateAsset(tempData.id, tempData).then(() => {
                // for (const v of this.list) {
                //   if (v.id === this.temp.id) {
                //     const index = this.list.indexOf(v)
                //     this.list.splice(index, 1, this.temp)
                //     break
                //   }
                // }
                this.getList()
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
        deleteData(row){
          deleteAsset(row.id).then( res => {
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
        handleDetail(row){
          this.dialogDetail = true
          this.detail.code = row.code
          this.detail.amount = row.amount
          this.getIssuerAccounts(row)
        },
        handleDistribute(row){
          this.dialogDistribute = true;
          this.detail.code = row.code
          this.getIssuerAccounts(row)
        },
        async distribute(){
          this.doing = true
          let resp = await Stellar.pay(
            this.detail.issuer_address,
            this.detail.issuer_seed,
            this.distributor_address,
            this.detail.code,
            this.detail.issuer_address,
            this.distributor_amount+'')
          console.log(resp)
          this.$notify({
            title: '分发资产',
            message: '分发资产成功',
            type: 'success',
            duration: 2000
          })

          this.doing = false
        }
      }
    }
</script>

<style scoped>
  .detail {
    width: 100%;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  .detail tr{
    min-height: 30px;
    line-height: 30px;
  }
  .detail tr td {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px;
  }

  .detail .title {
    font-weight: bold;
  }
</style>
