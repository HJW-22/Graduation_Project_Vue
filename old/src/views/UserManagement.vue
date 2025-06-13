<template>
  <div class="user-management">
    <!-- 查询和添加按钮 -->
    <div class="operation-buttons">
      <el-button type="success" @click="openAddDialog">添加用户</el-button>
      <el-button type="primary" @click="getUserList">查询用户</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="输入书名或其他关键字查询"
        style="width: 350px; margin-left: 10px; margin-top: 3px;"
      />
    </div>

    <!-- 用户表格 -->
    <el-table :data="tableData" border style="width: 100%" class="user-table">
      <el-table-column prop="userid" label="ID" width="130" />
      <el-table-column prop="username" label="用户名" width="130" />
      <el-table-column prop="password" label="密码" width="130" />
      <el-table-column prop="email" label="邮箱" width="160" />
      <el-table-column prop="phoneNumber" label="手机号" width="130" />
      <el-table-column prop="role" label="角色" width="80" />
      <el-table-column
        :label=" '创建日期' "
        width="130"
        :formatter="formatDate"
        :prop="'createdAt'"
      />
      <el-table-column
        :label=" '更新时间' "
        width="130"
        :formatter="formatDate"
        :prop="'updatedAt'"
      />
      <el-table-column label="操作" class=".flex-fill">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(scope.row.userid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加用户"
      width="500px"
    >
      <el-form :model="addUserData" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addUserData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addUserData.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addUserData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addUserData.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addUserData.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">确认添加</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑用户信息"
      width="500px"
    >
      <el-form :model="editUserData" label-width="80px">
        <el-form-item label="ID">
          <el-input v-model="editUserData.id" disabled />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editUserData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserData.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editUserData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editUserData.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editUserData.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 用户列表数据
const tableData = ref([])
const searchQuery = ref(''); // 在 script setup 中定义搜索查询

// 添加用户相关
const addDialogVisible = ref(false)
const addUserData = ref({
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: ''
})

// 编辑用户相关
const editDialogVisible = ref(false)
const editUserData = ref({
  id: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: ''
})

// 格式化日期函数
function formatDate(row, column) {
  const date = new Date(row[column.property]);
  return date.toISOString().split('T')[0]; // 只取日期部分 YYYY-MM-DD
}

// 获取书籍列表
async function getUserList() {
  try {
    const response = await fetch(`http://localhost:8080/api/users?search=${searchQuery.value}`);
    if (!response.ok) throw new Error('加载书籍列表失败');
    tableData.value = await response.json(); // 更新表格数据
    ElMessage.success('书籍列表加载成功');
  } catch (error) {
    ElMessage.error(error.message || '请求失败');
  }
}

// 打开添加对话框
function openAddDialog() {
  addUserData.value = {
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: ''
  }
  addDialogVisible.value = true
}

// 添加用户
function addUser() {
  fetch("http://localhost:8080/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(addUserData.value)
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("用户添加成功")
      addDialogVisible.value = false
      getUserList()
    } else {
      throw new Error('添加失败')
    }
  })
  .catch(error => {
    ElMessage.error(error.message)
  })
}

// 打开编辑对话框
function openEditDialog(user) {
  editUserData.value = {
    id: user.userid,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    password: '', // 保持为空,避免重置密码
    role: user.role
  }
  editDialogVisible.value = true
}

function updateUser() {
  // 正确访问 editUserData 的 id 和数据
  const userId = editUserData.value.id;
  const userData = {
    username: editUserData.value.username,
    email: editUserData.value.email,
    phoneNumber: editUserData.value.phoneNumber,
    password: editUserData.value.password === '' ? undefined : editUserData.value.password, // 如果密码是空的则不更新
    role: editUserData.value.role
  };

  if (!userId || !userData.username) { // 只检查 username 是否存在
    ElMessage.error("用户 ID 或更新的数据缺失");
    return;
  }

  // 创建请求
  fetch(`http://localhost:8080/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData) // 确保数据格式正确
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("用户信息更新成功");
      editDialogVisible.value = false; // 关闭对话框
      getUserList(); // 刷新用户列表
    } else {
      return res.text().then(text => {
        throw new Error(text || '更新失败'); // 捕获服务器返回的详细错误信息
      });
    }
  })
  .catch(error => {
    console.error("更新错误信息:", error);
    ElMessage.error(error.message); // 提示用户
  });
}

function confirmDelete(id) {
  console.log("要删除的用户 ID:", id); // 调试输出，检查传入的 ID
  ElMessageBox.confirm(
      '确定要删除这个用户吗?',
      '警告',
      {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
      }
  ).then(() => {
      deleteUser(id); // 传递有效的 ID
  }).catch(() => {
      ElMessage.info('已取消删除');
  });
}

function deleteUser(id) {
  console.log("要删除的用户 ID:", id); // 调试输出，确认传入的 ID

  fetch(`http://localhost:8080/api/users/${id}`, {
    method: "DELETE"
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("用户删除成功"); // 删除成功的提示
      getUserList(); // 刷新用户列表
    } else {
      // 提取服务器返回的错误信息
      return res.text().then(text => {
        throw new Error(text || '删除失败');
      });
    }
  })
  .catch(error => {
    console.error("删除用户时发生错误:", error); // 调试输出以查看具体错误
    ElMessage.error(error.message); // 错误提示
  });
}

// 初始化时加载用户列表
getUserList()
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.operation-buttons {
  margin-bottom: 20px;
}

.user-table {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.flex-fill {
  /* 确保这列可以扩展以填充剩余空间 */
  flex-grow: 1;
  flex-shrink: 0; /* 阻止列收缩 */
}
</style>