<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="120px"
      style="width: 400px; margin-left:50px;">
      <el-form-item label="旧密码" prop="old_pwd">
        <el-input v-model="temp.old_pwd" type="password"/>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="temp.new_pwd" type="password"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_pwd">
        <el-input v-model="temp.confirm_pwd" type="password"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetTemp()">重置</el-button>
      <el-button v-loading="doing" type="primary" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import { changePwd } from '@/api/accounts'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ChangePwd',
  directives: {
    waves
  },
  data: function() {
    return {
      temp: {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      },
      rules: {
        old_pwd: [{ required: true, message: 'old_pwd is required', trigger: 'change' }],
        new_pwd: [{ required: true, message: 'new_pwd is required', trigger: 'change' }],
        confirm_pwd: [{ required: true, message: 'confirm_pwd is required', trigger: 'change' }]
      },
      doing: false
    }
  },
  mounted: function() {
  },
  methods: {
    resetTemp() {
      this.temp = {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      }
    },
    submit() {
      if (this.temp.new_pwd != this.temp.confirm_pwd) {
        this.$message({
          type: 'error',
          message: '两次密码输入不正确！'
        })
        return
      }
      this.temp.account_id = this.$store.state.acl.account_id
      changePwd(this.temp).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.$notify({
            title: '成功',
            message: '修改密码成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push('/')
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    }

  }
}
</script>

<style scoped>
</style>
