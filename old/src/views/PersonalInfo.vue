<template>
  <div class="edit-user">
    <h1>编辑用户信息</h1>
    <el-form :model="userData" label-width="80px">
      <el-form-item label="ID">
        <el-input v-model="userData.id" disabled />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="userData.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userData.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userData.phoneNumber" placeholder="请输入手机号" />
      </el-form-item>
       <el-form-item label="密码">
        <el-input v-model="userData.password" placeholder="请输入密码" />
      </el-form-item>
    </el-form>

    <div class="dialog-footer">
      <el-button @click="cancelEdit">取消</el-button>
      <el-button type="primary" @click="saveUser">保存修改</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 用户数据
const userData = ref({
  id: '',
  username: '',
  email: '',
  phoneNumber: '',
  password:"",
  
})

// 页面加载时获取用户信息
onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    userData.value = user; // 设置用户数据
  } else {
    ElMessage.error("未找到用户信息");
  }
})

// 保存用户信息
function saveUser() {
  // 更新数据逻辑
  // 假如您需要将用户信息发送到服务器进行保存
  fetch(`http://localhost:8080/api/users/${userData.value.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData.value)
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("用户信息更新成功");
      // 可在这里重定向到用户列表或其他页面
      window.location.href = "/user-management"; // 返回用户管理页面
    } else {
      throw new Error('更新失败');
    }
  })
  .catch(error => {
    ElMessage.error(error.message);
  });
}

// 取消编辑
function cancelEdit() {
  window.location.href = "/user-management"; // 返回用户管理页面
}
</script>

<style scoped>
.edit-user {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>