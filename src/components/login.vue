<template>
    <div class="container">
        <el-form :model="form" ref="form" label-width="80px" class="login-page">
            <h2>后台登录</h2>
            <el-form-item label="用  户:" prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
                <el-input v-model="form.username" placeholder="请输入用户名">
                    <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="密 码:" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                <el-input v-model="form.password" type="password" placeholder="请输入密码">
                    <el-button slot="prepend" icon="el-icon-key"></el-button>
                </el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-user-solid" @click="login">登 录</el-button>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                username: "",
                password: "",
            },
        };
    },
    methods: {
        login() {
            this.$axios.post( "http://localhost:9090/admin/user/login",this.form)
            .then((response) => {
                if(!response.success){
                    this.$message.error(response.message);
                }else{
                    this.$store.commit("saveToken","");
                    this.$store.commit("saveToken", response.token);//保存 token
                    this.$router.push({"path":"admin","query":{"username":response.username}});
                }
            });
        },
    },
};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    /*height:600px;*/
    max-height:calc(100% - 30px);   
}
.login-page {
    border-radius: 5px;
    margin: auto;
    width: 350px;
    padding: 35px 55px 15px 20px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
</style>