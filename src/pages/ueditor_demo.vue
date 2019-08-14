<template>
  <div id="app">
      <div>
        <!-- <button size="primary" type="info" icon="plus" @click="getContent">获取内容</button> -->
        <span class="headerTitle">新闻内容</span>
        <div class="listContent">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="120px">
            <el-form-item label="日期" prop='date'>
              <el-date-picker v-model="ruleForm.date" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
  					</el-form-item>
            <el-form-item label="标题" prop='title'>
  							<el-input v-model.trim="ruleForm.title" style="width:235px"></el-input>
  					</el-form-item>
            <el-form-item label="描述" prop='desc'>
              <el-input type="textarea" :rows="2" placeholder="请输入内容" style="width:235px" v-model="ruleForm.desc"></el-input>
  					</el-form-item>
  					<el-form-item label="类型:">
  						<el-radio-group v-model="ruleForm.type">
  							<el-radio label='media_report'>媒体报道</el-radio>
                <el-radio label='activity'>近期活动</el-radio>
  							<el-radio label='hotspot'>热点关注</el-radio>
  						</el-radio-group>
  					</el-form-item>
            <el-form-item label="封面" prop='imageUrl'>
              <!-- action="http://192.168.10.117:12345/ueditor/exec?action=uploadimage" -->
              <!-- action="http://officialapi.ad-mex.com/ueditor/exec?action=uploadimage" -->
              <el-upload
                class="avatar-uploader"
                action="http://officialapi.ad-mex.com/ueditor/exec?action=uploadimage"
                :show-file-list="false"
                name='upfile'
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="ruleForm.imgUrl" :src="ruleForm.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
  					</el-form-item>
            <el-form-item style="padding-left:50%">
						<el-button type="primary" @click="$router.go(-1)">返&emsp;回</el-button>
						<el-button type="primary" @click="submitForm('ruleForm')">提&emsp;交</el-button>
					</el-form-item>
          </el-form>
        </div>
        <UEditor :config=config ref="ueditor"></UEditor>
      </div>
  </div>
</template>

<script>
  import UEditor from '@/components/ueditor/ueditor.vue'

  export default{
      components: {UEditor},
      data(){
        return {
          config: {
            //可以在此处定义工具栏的内容
            // toolbars: [
            //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
            //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
            //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
            // ],
            autoHeightEnabled: false,
            autoFloatEnabled: true,
            initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
            autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
            initialFrameWidth: null,
            initialFrameHeight: 450,
            BaseUrl: '',
            UEDITOR_HOME_URL: 'static/ueditor/'
          },
          addFormVisible: false,
          ruleForm: {
            imgUrl: '',
            type:'media_report',
            date: '',
            title: '',
            desc: '',
            content: ''
          },
          rules: {
  					imgUrl: [{
  						required: true,
  						message: '封面不能为空',
  						trigger: 'blur'
  					}],
            date: [{
  						required: true,
  						message: '日期不能为空',
  						trigger: 'blur'
  					}],
            title: [{
  						required: true,
  						message: '标题不能为空',
  						trigger: 'blur'
  					}],
            desc: [{
  						required: true,
  						message: '描述不能为空',
  						trigger: 'blur'
  					}],
          }
        }
      },
      mounted() {
        if (this.$route.query.id) {
          let v = this;
          $.ajax({
            url: "http://officialapi.ad-mex.com/api/article/"+this.$route.query.id,
            type: "get",
            dataType:"JSON",
            // data: JSON.stringify(v.ruleForm),
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (XMLHttpRequest) {
               XMLHttpRequest.setRequestHeader("auth", "mobiexchanger");
             },
            success: function (data) {
              v.ruleForm = data
              v.$refs.ueditor.setUEContent(data.content)
            },
            error: function (err) {
              console.log(err);
            }
        });
        }
      },
      methods: {
        handleAvatarSuccess(res, file) {
        this.ruleForm.imgUrl = '';
        let v = this;
        v.$nextTick(function() {
          v.ruleForm.imgUrl = res.url;
        })
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg;';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
        return true;
      },
        //获取文档内容
        getContent: function(){
          this.ruleForm.content = this.$refs.ueditor.getUEContent();
        },
        submitForm(ruleForm) {
          var v = this;
				this.$refs[ruleForm].validate((valid) => {
					if(valid) {
            if (v.$refs.ueditor.getUEContent() == '' || v.$refs.ueditor.getUEContent()=='<p>请输入内容</p>') {
              this.$message({
                type: 'warning',
                message: '内容不能为空'
              })
              return ;
            }
            v.ruleForm.content = this.$refs.ueditor.getUEContent()
            if (this.$route.query.id) {
              $.ajax({
                url: "http://officialapi.ad-mex.com/api/article",
                type: "PUT",
                dataType:"JSON",
                data: JSON.stringify(v.ruleForm),
                contentType: "application/json;charset=UTF-8",
                beforeSend: function (XMLHttpRequest) {
           		     XMLHttpRequest.setRequestHeader("auth", "mobiexchanger");
                 },
                success: function (data) {
                  v.$message({
                    type: 'success',
                    message: '修改成功'
                  })
                  v.$router.go(-1)
                },
                error: function (err) {
                  v.$message({
                    type: 'warning',
                    message: '修改失败'
                  })
                }
            });
            return ;
            }
            $.ajax({
              url: "http://officialapi.ad-mex.com/api/article",
              type: "POST",
              dataType:"JSON",
              data: JSON.stringify(v.ruleForm),
              contentType: "application/json;charset=UTF-8",
              beforeSend: function (XMLHttpRequest) {
         		     XMLHttpRequest.setRequestHeader("auth", "mobiexchanger");
               },
              success: function (data) {
                v.$message({
                  type: 'success',
                  message: '创建成功'
                })
                v.$router.go(-1)
              },
              error: function (err) {
                v.$message({
                  type: 'warning',
                  message: '创建失败'
                })
              }
          });
          }
        })
        }
      }
  }

</script>
<style lang='scss'>

  .headerTitle {
     font-size: 22px;
     font-weight: 600;
   }
   .listContent {
     position: relative;
     // height: 500px;
     // width: 50%;
     margin-left: 35%;
     margin-top: 50px;
     text-align: left;
     // background-color: red;
   }
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
