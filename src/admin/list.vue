<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"><template slot-scope="scope">{{scope.row.updateTime|datrfmt()}}</template></el-table-column>
      <!--<el-table-column label="内容" prop="content"></el-table-column>-->
      <el-table-column align="right">
        <template slot="header">
          <input class="el-input__inner"
            type="text" v-model.trim="form.titleSearch"
            size="mini"
            @blur="searchTitle($event)"
          />
          <el-button size="mini" @click="edit()">新增</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="edit(scope.$index, scope.row)">修改</el-button>
          <el-popover
            placement="top"
            title="确认删除吗？"
            width="200"
            trigger="click"
            v-model="scope.row.visible"
          >
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope.row.visible = false;">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteOne(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
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
    <el-dialog title="新增/编辑" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-input v-model="form._id" type="hidden"></el-input>
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-card style="height: 610px;">
            <quill-editor
              v-model="form.content"
              ref="myQuillEditor"
              style="height: 500px;"
              :options="editorOption"
            ></quill-editor>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  name: "FuncFormsEdit",
  components: {
    quillEditor,
  },
  data() {
    return {
      tableData: [],
      total: 0,
      dialogVisible: false,
      form: {
        _id: "",
        title: "",
        content: "",
        pageSize: 10,
        currentPage: 1,
        titleSearch:""
      },
      editorOption: {},
    };
  },
  mounted: function () {
    this.getArticleList();
  },
  methods: {
    //列表查询
    getArticleList() {
      this.$axios.post( "http://localhost:9090/admin/list",this.form)
        .then((response) => {
          this.tableData = response.data;
          this.total = response.total;
        });
    },
    updateView(e) {
      this.$forceUpdate();
      this.form.searchTitle = e;
    },
    searchTitle(e) {
      this.form.titleSearch = e.target.value;
      this.getArticleList();
    },
    onSubmit() {
      this.$axios
        .post(
          "http://localhost:9090/admin/save",this.form
        )
        .then((response) => {
          if (response._id) {
            this.dialogVisible = false;
          }
          this.getArticleList();
        });
    },
    handleCurrentChange(val) {
      this.form.currentPage = val;
      this.getArticleList();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async findOne(row){
      this.$axios
        .post("http://localhost:9090/admin/findOne",{"id":row._id})
        .then((response) => {
          if (response) {
            return response;
          }
        });
    },
    edit(index, row) {
      this.dialogVisible = true;
      if(row){
        this.$axios
        .post("http://localhost:9090/admin/findOne",{"id":row._id})
        .then((response) => {
          if (response) {
            this.form = response;
          }
        });
      }
    },
    deleteOne(index, row) {
      this.$axios
        .post("http://localhost:9090/admin/deleteOne",{"id":row._id})
        .then((response) => {
          if (response.deletedCount == 1) {
            this.$notify({
              title: "通知",
              message: "删除成功",
              position: "bottom-right",
            });
          }
          this.getArticleList();
        });
    }
  }
};
</script>