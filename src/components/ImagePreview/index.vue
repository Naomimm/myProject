<template>
  <div>
    <input type="file" ref="imgFile" @change="previewImg" style="display: none;" accept="image/jpeg,image/gif,image/png" />
    <img ref="preview" :src="imgSrc" />
    <el-button type="primary" @click="selectFile">选择图片</el-button>
  </div>
</template>

<script>
    export default {
      name: "image-preview",
      props: ['imgData'],
      data() {
        return {
          imgSrc: ''
        }
      },
      mounted (){
        this.imgSrc = this.imgData
      },
      watch:{
        imgData() {
          this.imgSrc = this.imgData
        }
      },
      methods: {
        selectFile(){
          this.$refs.imgFile.click()
        },
        previewImg() {
          let file = this.$refs.imgFile.files[0];//获取input file控件选择的文件
          this.imgToBase64(file, 720, (base64) => {
            this.imgSrc = base64;//预览页面上预留一个img元素，载入base64
            // $("#img1")[0].width = 300;//设定宽高，不然会自动按照压缩过的图片宽高设定，有可能超出预想的范围。
            //直接利用ajax上传base64到服务器，完毕
            this.$emit('update:imgData', base64)
          });
        },
        imgToBase64(file, maxLen, callBack) {
          let img = new Image();
          let reader = new FileReader();//读取客户端上的文件
          reader.onload = function () {
            let url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
            img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
          };
          img.onload = function () {
            //生成比例
            let width = img.width, height = img.height;
            //计算缩放比例
            let rate = 1;
            if (width >= height) {
              if (width > maxLen) {
                rate = maxLen / width;
              }
            } else {
              if (height > maxLen) {
                rate = maxLen / height;
              }
            }
            img.width = width * rate;
            img.height = height * rate;
            //生成canvas
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            let base64 = canvas.toDataURL('image/png', 0.9);
            callBack(base64);
          };
          reader.readAsDataURL(file);
        },
      }

    }
</script>

<style scoped>

</style>
