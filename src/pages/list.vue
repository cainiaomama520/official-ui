<template>
  <div class="home">
    <span class="headerTitle">新闻列表</span>
    <el-button type="primary" class="creatButton" @click="$router.push({path:'/ueditor'})">创建新闻</el-button>
    <div class="content" v-loading='tableLoading'>
      <div class="littleBox" v-for="item in detailArray" @click='pushDetail(item.id)'>
        <img :src=item.imgUrl alt="">
        <span class="title">{{item.title}}</span>
        <span class="detail">{{item.desc}}</span>
        <i class="el-icon-delete" @click.stop='deletAction(item.id)'></i>
      </div>
    </div>
    <div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size='pageSize' layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableLoading: false,
      currentPage: 1,
				pageSize:5,
				total: 0,
      detailArray: []
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    getListData() {
      let v = this;
      v.tableLoading = true;
      let params = {
        limit: v.pageSize,
        page: v.currentPage,
        order: 'DESC',
        sidx: 'updateDate'
      }
      $.ajax({
        url: "http://officialapi.ad-mex.com/api/article-list",
        type: "POST",
        dataType:"JSON",
        data: JSON.stringify(params),
        contentType: "application/json;charset=UTF-8",
        beforeSend: function (XMLHttpRequest) {
           XMLHttpRequest.setRequestHeader("auth", "mobiexchanger");
         },
        success: function (data) {
          v.tableLoading = false;
          console.log(data);
          v.total = data.total
          v.detailArray = data.records
        },
        error: function (err) {
          v.tableLoading = false;
          console.log(err);
        }
    });
  },
  handleSizeChange(val) {
				this.pageSize = val;
				this.getListData()
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getListData()
				console.log(`当前页: ${val}`);
			},
      pushDetail(id) {
        if (id) {
          this.$router.push({path:'/ueditor',query:{id:id}})
        }
      },
      deletAction(id) {
        if (id) {
          let v = this;
          $.ajax({
            url: "http://officialapi.ad-mex.com/api/article/"+id,
            type: "delete",
            dataType:"JSON",
            // data: JSON.stringify(v.ruleForm),
            contentType: "application/json;charset=UTF-8",
            beforeSend: function (XMLHttpRequest) {
               XMLHttpRequest.setRequestHeader("auth", "mobiexchanger");
             },
            success: function (data) {
              v.$message({
                type: 'success',
                message: '删除成功'
              })
              v.getListData()
            },
            error: function (err) {
              console.log(err);
            }
          });
        }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
 .creatButton {
   position: fixed;
   top: 50px;
   right: 140px;
 }
 .home {
   position: relative;
   padding: 30px;
   padding-top: 0px;
   .headerTitle {
     font-size: 22px;
     font-weight: 600;
   }
   .content {
     margin-top: 20px;
     // width: 100%;
     height: 75vh;
     overflow: scroll;
     padding: 0 100px;
     // background-color: cyan;
     .littleBox {
       position: relative;
       width: 100%;
       height: 100px;
       // background-color: red;
       margin-top: 20px;
       border: 1px gray solid;
       border-radius: 5px;
       cursor: pointer;
       img {
         height: 100px;
         width: 120px;
         position: absolute;
         left: 0;
         top: 0;
       }
       .title {
         font-size: 18px;
         font-weight: 500;
         position: absolute;
         display: inline-block;
         line-height: 50px;
         left: 150px;
         top: 0;
       }
       .detail {
         font-size: 12px;
         font-weight: 400;
         position: absolute;
         display: inline-block;
         line-height: 20px;
         left: 150px;
         top: 50px;
         text-align: left;
         width: 80%;
       }
       i {
         position: absolute;
         display: block;
         right: 40px;
         top: 40px;
         font-size: 20px;
       }
     }
   }
 }
</style>
