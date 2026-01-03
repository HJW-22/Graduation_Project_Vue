<template>
  <div class="login">
    <el-card class="login-card">
      <h2>用户登录</h2>
      <el-form :model="loginData" ref="loginForm" class="login-form">
        <el-form-item
          label="用户"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ]"
        >
          <el-input v-model="loginData.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item
          label="密码"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
        >
          <el-input
            v-model="loginData.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item
          label="验证"
          :rules="[
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]"
        >
          <el-input v-model="loginData.captcha" placeholder="请输入验证码" />
          <Captcha ref="captchaRef" />
        </el-form-item>

        <el-form-item class="login-buttons">
          <div class="button-container">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="success" @click="openAddDialog">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加用户" width="500px">
      <el-form :model="addUserData" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addUserData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="addUserData.password"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addUserData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="addUserData.phoneNumber"
            placeholder="请输入手机号"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">确认添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import Captcha from "@/components/Captcha.vue";

const router = useRouter();
const loginData = ref({ username: "", password: "", captcha: "" });
const addUserData = ref({
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
});
const addDialogVisible = ref(false);
const captchaRef = ref(null);

const login = async () => {
  const generatedCaptcha = captchaRef.value.getCaptcha;
  if (loginData.value.captcha !== generatedCaptcha()) {
    ElMessage.error("验证码错误！");
    return;
  }
  try {
    const response = await fetch("http://localhost:8080/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: loginData.value.username,
        password: loginData.value.password,
      }),
    });
    if (response.ok) {
      const user = await response.json();
      // 存储用户信息
      localStorage.setItem("user", JSON.stringify(user));
      // 通知主应用更新用户状态
      window.dispatchEvent(new Event("userLoggedIn"));
      ElMessage.success("登录成功！");
      router.push("/home"); // 跳转到首页
    } else {ElMessage.error("用户名或密码错误！");}
  } catch (error) {
    ElMessage.error("登录请求失败！");
    console.error(error);
  }
};

const openAddDialog = () => {
  addDialogVisible.value = true;
  addUserData.value = {
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  };
};

const addUser = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addUserData.value),
    });

    if (response.ok) {
      ElMessage.success("注册成功！");
      addDialogVisible.value = false; // 关闭对话框
      // 重置用户数据
      addUserData.value = {
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
      };
    } else {
      ElMessage.error("注册失败，用户名可能已存在！");
    }
  } catch (error) {
    ElMessage.error("注册请求失败！");
    console.error(error);
  }
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.login-card {
  width: 400px;
}

.login-buttons {
  display: flex;
  justify-content: center; /* Button container center alignment */
}

.button-container {
  display: flex;
  justify-content: center; /* Space between buttons */
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
