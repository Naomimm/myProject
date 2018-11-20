<template>
  <div class="app-container">
    <div class="nav">
      <el-dropdown>
        <span class="el-dropdown-link">
          外链<i class="el-icon-arrow-down el-icon--right"/>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            填写url <input type="text" placeholder="请输入内容">
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-button type="success" class="publish" @click="onPublish">发布</el-button>
      <el-button type="warning" @click="draftForm">草稿</el-button>

    </div>
    <el-form ref="dataForm" :model="news" :rules="rules" label-width="80px">
      <!-- <el-form-item label="标题" prop="title">
        <el-input v-model="news.title"></el-input>
      </el-form-item> -->
      <input v-model="news.title" type="text" class="title" placeholder="标题">
      <el-form-item label="用户名" prop="author" class="meta">
        <el-input v-model="news.author" class="userName"/>
      </el-form-item>
      <el-form-item label="发布时间" prop="updated" class="meta">
        <el-input v-model="news.updated" class="updataTime"/>
      </el-form-item>
      <el-form-item label="封面" prop="logo">
        <img-preivew :img-data.sync="news.logo.String" />
      </el-form-item>
      <el-form-item label="摘要" prop="keyword" class="keyWord">
        <el-input v-model="news.keyword" class="keyWord"/>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <tinymce :height="300" v-model="news.content"/>
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
import { getNews, createNews, updateNews } from '@/api/news'
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
      news: {
        id: 0,
        title: '',
        author: '',
        updated: '',
        sort: 0,
        content: '',
        status: 0,
        keyword: '',
        logo: {
          String: '',
          Valid: true
        },
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
    this.initNews()
  },
  methods: {
    async initNews() {
      const resp = await getNews(this.id)
      if (`${resp.data.code}` === `200`) {
        // console.log(resp.data.data)
        const entity = resp.data.data
        this.news.id = entity.id
        this.news.title = entity.title
        this.news.author = entity.author
        this.news.sort = entity.sort
        this.news.content = entity.content
        this.news.status = entity.status
        this.news.keyword = entity.keyword
        this.news.logo.String = entity.logo.String
        this.news.logo.Valid = entity.logo.Valid
        this.news.updated = entity.updated
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createNews(this.news).then(() => {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.news)
          updateNews(tempData.id, tempData).then(resp => {
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
      if (this.news.id > 0) {
        this.updateData()
      } else {
        this.createData()
      }
    },
    onBack() {
      this.$router.go(-1)
    },
    onPublish() {
      this.news.status = 1
      this.onSubmit()
    },
    // 草稿
    draftForm() {
      if (this.news.content.length === 0 || this.news.title.length === 0) {
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
      this.news.status = 'draft'
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
.nav .el-dropdown {
  width: 130px;
  line-height: 38px;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #bbbbbb;
  border-radius: 6px;
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
/* 用户名 */
.title {
  width: 100%;
  border: none;
  border-bottom: 1px solid #dfdede;
  line-height: 40px;
  color: #d2cfcf;
  font-size: 24px;
  margin-bottom: 30px;
}
.userName,
.updataTime {
  width: auto;
}
.meta {
  display: inline-block;
  margin-right: 86px;
}
.image {
  width: 156px;
  height: 82px;
}

.el-input__inner {
  width: 100%;
  border: none;
  border-bottom: 1px solid #dfdede;
  line-height: 40px;
  color: #d2cfcf;
}
.footerButton {
  display: none;
}
/* footer */
.footer {
  padding: 20px;
  padding-bottom: 0px;
}
.footer .radio {
  line-height: 40px;
}
.uploadImage {
  width: 292px;
  height: 140px;
  padding: 10px;
  padding-bottom: 30px;
  text-align: center;
  border: 1px dashed #bbbbbb;
}
.uploadImage img {
  display: inline-block;
  width: 74px;
  height: 74px;
  background-color: orange;
  cursor: pointer;
}
.uploadImage span {
  color: #63b0ff;
  cursor: pointer;
}
</style>
