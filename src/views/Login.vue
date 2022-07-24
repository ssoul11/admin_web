<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-head">
        <div>
          <svg
            class="icon"
            width="80"
            height="80"
            color=" #8cc5ff"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            data-v-042ca774=""
          >
            <path
              fill="currentColor"
              d="M704 704h64v192H256V704h64v64h384v-64zm188.544-152.192C894.528 559.616 896 567.616 896 576a96 96 0 11-192 0 96 96 0 11-192 0 96 96 0 11-192 0 96 96 0 11-192 0c0-8.384 1.408-16.384 3.392-24.192L192 128h640l60.544 423.808z"
            ></path>
          </svg>
        </div>
        <span>后台管理系统1.0</span>
      </div>
      <div class="login-body">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
        >
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="Please input username"
            ></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="pass">
            <el-input
              v-model="ruleForm.pass"
              type="password"
              placeholder="Please input password"
              show-password
            />
          </el-form-item>

          <el-form-item label="" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="同意服务条款" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)"
              >登录</el-button
            >
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { ElForm } from "element-plus";
import axios from "../utils/axios.js";
// 安装 js-md5，密码需要 md5 加密，服务端是解密 md5 的形式
import md5 from "js-md5";
import { localSet } from "../utils";

type FormInstance = InstanceType<typeof ElForm>;
name: "Login";

const pass = ref("");
const formSize = ref("");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: "",
  pass: "",
  type: [],
});

const rules = reactive({
  name: [
    {
      required: true,
      message: "Please input user name",
      trigger: "blur",
    },
    {
      // min: 3,
      // max: 5,
      // message: "Length should be 3 to 5",
      // trigger: "blur",
    },
  ],
  pass: [
    {
      required: true,
      message: "Please input password",
      trigger: "blur",
    },
    {},
  ],

  type: [
    {
      type: "array",
      required: true,
      message: "请同意服务条款",
      trigger: "change",
    },
  ],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // /adminUser/login 登录接口路径
      console.log(111111);
      axios
        .post("/api/adminUser/login", {
          userName: ruleForm.name || "",
          passwordMd5: md5(ruleForm.pass), // 密码需要 md5 加密
        })
        .then((res) => {
          // 返回的时候会有一个 token，这个令牌就是我们后续去请求别的接口时要带上的，否则会报错，非管理员。
          // 这里我们将其存储到 localStorage 里面。

          localSet("token", res);
          console.log(res);
          // 此处登录完成之后，需要刷新页面
          window.location.href = "/";
        });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 95vh;
  justify-content: center;
  align-items: center;
}

.login-box {
  display: flex;
  height: 320px;
  width: 380px;
  /* padding-right: 50px; */
  /* justify-content: center;
  align-items: center; */
  flex-direction: column;
  justify-content: space-between;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-head {
  display: flex;
  /* width: 20px; */
  /* height: 20px; */
  flex-direction: column;
  align-items: center;
}
.login-body {
  width: 300px;
  height: 200px;
}
</style>
