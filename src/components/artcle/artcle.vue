<template>
<el-container>
  <el-header><h2>{{blog.title}}</h2>分类：{{blog.category}} 作者：{{blog.createUser.username}}</el-header>
  <el-container>
    <el-aside width="200px">
      <img :src="blog.createUser.headimg" style="width:40px;height:40px"/>
      <br/>
      <label>{{blog.createUser.autograph}}</label>
    </el-aside>
    <el-container>
      <el-main>
        <template>
          <el-container direction="vertical" class="detail-container">
            <el-row type="flex" justify="center" >
              <code class="hljs" v-html="blog.content"></code>
            </el-row>
          </el-container>
        </template>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>   
<script>  
import hljs from "highlight.js";
export default {
  name:"",
  data() {
    return {
      blog:{
        id:"",
        username:"",
        content:"",
        category:"",
        createUser:""
      }
    }
  },
  mounted: function () {
    this.username = this.$route.params.username;
    this.id = this.$route.params.id;
    this.findOne(this.id);
  },
  methods:{
    async findOne(row){
      this.$axios.post("http://localhost:9090/admin/article/findOne",{"id":this.id}).then((response) => {
          if (response) {
            this.blog = response;
          }
        });
    },
  }
}
</script>
<style>
   .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 5px;
  }

  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>