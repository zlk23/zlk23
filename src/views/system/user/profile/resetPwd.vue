<template>
  <el-form ref="form" v-loading="loading" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input
        v-model="user.oldPassword"
        placeholder="请输入旧密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="user.newPassword"
        placeholder="请输入新密码"
        type="password"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="user.confirmPassword"
        placeholder="请确认密码"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import { decrypt } from "@/api/system/user.js";
export default {
  data() {
    const regPwd = (rule, value, callback) => {
      //数字
      var pattern1 = /([0-9]+)/;
      //字母
      var pattern2 = /([a-zA-Z])/;
      //特殊字符
      // var pattern3 = /[`~!@#$%^&*()\\-+=<>?:\"{}|,.\\/;'\\\\[\\]·~！@#￥%……&*（）——\\-+={}|《》？：“”【】、；‘'，。、]/;
      var pattern3 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;'\[\]·！￥…（）—《》？：“”【】、；‘，。]/;
      //空格
      var pattern4 = /\s+/g;

      var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,20}');

      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (value.length < 6 || value.length > 20) {
        return callback(new Error("密码长度为6至20位"));
      } else if (pattern4.exec(value)) {
        return callback(new Error("密码不能包含空格"));
      } else if (!pattern1.exec(value) || !pattern2.exec(value) || !pattern3.exec(value)) {
        return callback(new Error("密码必须包含数字、字母、特殊符号"));
      }else {
        callback();
      }
    };
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      loading:false,
      test: "1test",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: regPwd, trigger: "blur" }
          // { required: true, message: "新密码不能为空", trigger: "blur" },
          // { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading=true;
          console.log(this.user);
          let op = null;
          let np = null;
          decrypt(this.user.oldPassword).then(res => {
            op = res;
            decrypt(this.user.newPassword).then(res => {
              np = res;
              updateUserPwd(op, np).then(response => {
                this.msgSuccess("修改成功");
              }).finally(()=>{
                this.loading=false;
              });
            });
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
