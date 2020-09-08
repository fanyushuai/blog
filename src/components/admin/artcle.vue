<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime">
        <template slot-scope="scope">{{scope.row.updateTime|datrfmt()}}</template>
      </el-table-column>
      <!--<el-table-column label="内容" prop="content"></el-table-column>-->
      <el-table-column align="left">
        <template slot="header">
          <input
            class="el-input__inner"
            style="width:auto;"
            type="text"
            v-model.trim="form.titleSearch"
            size="mini"
            @blur="searchTitle($event)"
          />
          <el-button size="mini" @click="edit()">新增</el-button>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row)">查看</el-button>
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
        <el-input v-model="form.createUser._id" type="hidden"></el-input>
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <quill-editor
            v-model="form.content"
            ref="myQuillEditor"
            style="height: 500px;"
            :options="editorOption"
          ></quill-editor>
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
import hljs from "highlight.js";
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
        category: "",
        createUser: {
          _id:""
        },
        pageSize: 10,
        currentPage: 1,
        titleSearch: "",
      },
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
            ["link", "image", "video"],
          ],
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
            },
          },
        },
      },
    };
  },
  mounted: function () {
    this.getArticleList();
    this.form;
  },
  methods: {
    //列表查询
    getArticleList() {
      this.$axios
        .post("http://localhost:9090/admin/article/list", this.form)
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
        .post("http://localhost:9090/admin/article/save", this.form)
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
    async findOne(row) {
      this.$axios
        .post("http://localhost:9090/admin/article/findOne", { id: row._id })
        .then((response) => {
          if (response) {
            return response;
          }
        });
    },
    detail(row){
      let newpage = this.$router.resolve({ 
            path: "/artcle/"+row._id 
      })
      window.open(newpage.href, '_blank');
    },
    edit(index, row) {
      if (row) {
        this.$axios
          .post("http://localhost:9090/admin/article/findOne", { id: row._id })
          .then((response) => {
            if (response) {
              this.form = response;
            }
          });
      } else {
        this.form._id = "";
        this.form.title = "";
        this.form.content = "";
        this.form.category = "";
        this.form.createUser._id = "";
      }
      this.dialogVisible = true;
    },
    deleteOne(index, row) {
      this.$axios
        .post("http://localhost:9090/admin/article/deleteOne", { id: row._id })
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
    },
  },
};
</script>