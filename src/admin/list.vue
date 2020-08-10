<template>
    <div id="test">
      <div  v-for="(value, key) in articleList" :key=value.id> {{ key }} : {{ value }}</div>
    </div>
</template>

<script>
export default {
  mounted:function (){  
    this.articleList();  
  },  
  methods:{ 
    articleList(){  
      this.axios.get("/admin/list").then(response =>{  
        let res=response.data;  
        if(res.status==0){  
          this.articleList=res.result;  
        }else{  
          console.log("从服务器请求数据失败！");  
        }  
      })  
    }
  }
}
</script>