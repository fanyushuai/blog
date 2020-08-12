<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input
            v-model="search"
            placeholder="输入关键字搜索"
            size="mini"
            @input="updateView($event)"
            @change="searchTitle($event)"
          />
          <el-button size="mini" @click="edit()">Edit</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.$index, scope.row)">Edit</el-button>
          <el-popover
          placement="top"
          title="确认删除吗？"
          width="200"
          trigger="click"
          v-model="scope.row.visible">
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false;">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteOne(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button size="mini" type="danger" slot="reference">Delete</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <template></template>
  </div>
</template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      search: "",
      title: "",
      pageSize: 10,
      currentPage: 1,
      dialogVisible: false,
      form: {
        title: "",
        content: "",
      },
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
            "&title=" +
            this.title
        )
        .then((response) => {
          this.tableData = response.data.data;
          this.total = response.data.total;
        });
    },
    updateView(e) {
      this.$forceUpdate();
    },
    searchTitle(val) {
      this.title = val;
      this.getArticleList();
    },
    onSubmit() {
      this.$axios
        .get("http://localhost:9090/admin/save?title=" + this.form.title)
        .then((response) => {
          if(response.data._id){
            this.dialogVisible = false;
          }
          this.getArticleList();
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getArticleList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    edit(index, row) {
      this.dialogVisible = true;
    },
    deleteOne(index, row) {
      this.$axios
        .get("http://localhost:9090/admin/deleteOne?id=" + row._id)
        .then((response) => {
          if(response.data.deletedCount == 1){
            this.$notify({
              title: '通知',
              message: '删除成功',
              position: 'bottom-right'
            });
          }
          this.getArticleList();
        });
    },
  },
};
</script>