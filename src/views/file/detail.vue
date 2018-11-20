<template>
  <div class="app-container">
    <div class="nav">
      <el-button type="success" class="publish" @click="onPublish">预览</el-button>
      <el-button type="success" class="publish" @click="onPublish">发布</el-button>
      <el-button type="warning" @click="draftForm">草稿</el-button>

    </div>
    <el-form ref="dataForm" :model="file" :rules="rules" label-width="80px">
      <el-form-item label="标    题：" >
        <el-input v-model="file.title" placeholder="请输入标题" class="title"/>
      </el-form-item>

      <el-form-item label="正  文：">
        <tinymce :height="300" v-model="file.content"/>
      </el-form-item>
      <el-form-item class="footerButton">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button type="warning" @click="onPublish">发布</el-button>
        <el-button @click="onBack">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getFile, creatFile, updataFile } from '@/api/file'
import imgPreivew from '@/components/ImagePreview'

export default {
  name: 'Detail',
  components: {
    Tinymce,
    'img-preivew': imgPreivew
  },
  props: ['id'],
  data() {
    return {
      file: {
        id: 0,
        title: '',
        updated: '',
        sort: 0,
        content: '',
        status: 0,
        keyword: '',
        image_url: ''
      },
      rules: {
        // author: [{required: true, message: 'author is required', trigger: 'change'}],
        // content: [{required: true, message: 'content is required', trigger: 'blur'}],
      },
      doUpload: '',
      dragImage: {
        sird: ''
      }
    }
  },
  mounted() {
    this.initFile()
  },
  methods: {
    async initFile() {
      const resp = await getFile(this.id)
      if (`${resp.data.code}` === `200`) {
        const entity = resp.data.data
        console.log(entity)
        this.file.id = entity.id
        this.file.title = entity.title
        this.file.sort = entity.sort
        this.file.content = entity.content
        this.file.status = entity.status
        this.file.keyword = entity.keyword
        this.file.updated = entity.updated
      }
    },
    createData() {
      console.log(this.$refs['dataForm'])
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          creatFile(this.file).then((res) => {
            console.log(res)
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      console.log(this.$refs['dataForm'])
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.file)
          updataFile(tempData.id, tempData).then(resp => {
            if (`${resp.data.code}` === `200`) {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'warn',
                duration: 2000
              })
            }
          })
        }
      })
    },
    onSubmit() {
      if (this.file.id > 0) {
        this.updateData()
      } else {
        this.createData()
      }
    },
    onBack() {
      this.$router.go(-1)
    },
    onPublish() {
      this.file.status = 1
      this.onSubmit();
      this.$router.go(-1);
    },
    // 草稿
    draftForm() {
      if (this.file.content.length === 0 || this.file.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.file.status = 'draft'
    }
  }
}
</script>

<style scoped>
.app-container {
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.el-form {
  padding: 20px;
}
.nav {
  line-height: 60px;
  text-align: right;
  margin-bottom: 20px;
  background-color: rgba(238, 238, 238, 1);
}
.nav button {
  height: 40px;
  width: 90px;
  margin: 0px;
  margin-right: 20px;
}
.nav .publish {
  margin: 0px 17px 0px 40px;
}
.el-input__inner{
 border: none !important;
 border-bottom: 1px solid #DFDEDE !important;
}
</style>
