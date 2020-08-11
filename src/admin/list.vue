<template>
  <el-table :data="tableData.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="标题"
      prop="title">
    </el-table-column>
    <el-table-column
      label="修改时间"
      prop="updateTime">
    </el-table-column>
    <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
    <div class="block">
      <span class="demonstration"></span>
      <el-pagination
        @size-change="handleSizeChange"   
        @current-change="handleCurrentChange"
        :current-page="limitePage.page"
        :page-sizes="[2, 4]"
        :page-size="limitePage.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData:[],
      search: '',
      limitePage:{
        limit:2,
        page:1
      }
    };
  },
  mounted:function (){  
    this.getArticleList();  
  },  
  methods:{ 
    getArticleList(){  
      this.$axios.get("http://localhost:9090/admin/list").then(response =>{  
          this.tableData = response.data;  
      })
    },
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      this.limitePage.limit = val;
    },
    handleCurrentChange(val) {
      this.limitePage.page = val
    }
  }
}
</script>