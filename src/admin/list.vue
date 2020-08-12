<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input placeholder="输入关键字搜索" clearable v-model="search" size="mini" @input="updateView($event)"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="delete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      search: "",
      pageSize: 10,
      currentPage: 1,
    };
  },
  mounted: function () {
    this.getArticleList();
  },
  methods: {
    getArticleList() {
      this.$axios
        .get(
          "http://localhost:9090/admin/list?pageSize=" +
            this.pageSize +
            "&currentPage=" +
            this.currentPage +
            "&search=" +
            this.search
        )
        .then((response) => {
          this.tableData = response.data.data;
          this.total = response.data.total;
        });
    },
    updateView(e){
      this.$forceUpdate()
    },
    searchTitle(val) {
      this.search = val;
      this.getArticleList();
    },
    edit(){
      alert(1)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getArticleList();
    },
  },
};
</script>