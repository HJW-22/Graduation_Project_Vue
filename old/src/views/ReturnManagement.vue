<template>
  <div class="return-management">
    <!-- 查询和归还按钮 -->
    <div class="operation-buttons">
      <el-button type="primary" @click="getBorrowedBooks">查询已借阅书籍</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="输入书名或其他关键字查询"
        style="width: 350px; margin-left: 10px; margin-top: 3px;"
      />
    </div>

    <!-- 书籍表格 -->
    <el-table :data="tableData" border style="width: 100%" class="book-table">
      <el-table-column prop="historyId" label="借阅ID" width="130" />
      <el-table-column prop="detailId" label="明细ID" width="130" />
      <el-table-column prop="userId" label="用户ID" width="130" />
      <el-table-column prop="bookTitle" label="书名" width="130" />
      <el-table-column prop="username" label="用户姓名" width="130" />
      <el-table-column prop="borrowAt" label="借阅日期" width="160" :formatter="formatDate" />
      <el-table-column prop="returnAt" label="归还日期" width="160" :formatter="formatDate" />
      <el-table-column label="操作" class="flex-fill">
        <template #default="scope">
          <el-button size="small" type="success" @click="openReturnDialog(scope.row)">
            归还
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="returnDialogVisible" title="归还书籍" width="400px">
      <p>确定归还《{{ selectedBook.bookTitle }}》吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="returnDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmReturn">确认归还</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 已借阅书籍数据
const tableData = ref([]);
const searchQuery = ref(''); // 搜索查询
const returnDialogVisible = ref(false); // 对话框可见性
const selectedBook = ref(null); // 选中的书籍

// 格式化日期函数
function formatDate(row, column) {
  const date = new Date(row[column.property]);
  return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
}

// 获取已借阅书籍列表
async function getBorrowedBooks() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.userid) {
    ElMessage.warning('用户未登录，请先登录');
    return;
  }
  
  try {
   const response = await fetch(`http://localhost:8080/api/bkHit/borrow/${user.userid}`);
    if (!response.ok) throw new Error('加载已借阅书籍失败');
    tableData.value = await response.json(); // 更新表格数据
    ElMessage.success('已借阅书籍加载成功');
  } catch (error) {
    ElMessage.error(error.message || '请求失败');
  }
}

// 打开归还对话框
function openReturnDialog(book) {
  selectedBook.value = book; // 设置选中的书籍
  returnDialogVisible.value = true; // 显示对话框
}

// 确认归还书籍
async function confirmReturn() {
  if (!selectedBook.value) {
    ElMessage.warning('未选择书籍');
    return;
  }

  const userId = JSON.parse(localStorage.getItem("user")).userid; // 从 localStorage 获取用户ID

  try {
    const response = await fetch('http://localhost:8080/api/bkHit/return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        historyId: selectedBook.value.historyId,
      }),
    });

    if (response.ok) {
      const result = await response.text(); // 根据返回类型使用 `text()`
      ElMessage.success(result); // 提示归还结果
      getBorrowedBooks(); // 重新获取已借阅书籍
    } else {
      const errorMessage = await response.text(); // 获取错误信息
      throw new Error(errorMessage || '归还失败，请稍后再试');
    }
  } catch (error) {
    ElMessage.error(error.message || '请求失败');
  }

  returnDialogVisible.value = false; // 关闭对话框
}

// 初始化时加载已借阅书籍列表
getBorrowedBooks();
</script>

<style scoped>
.return-management {
  padding: 20px;
}

.operation-buttons {
  margin-bottom: 20px;
}

.book-table {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.flex-fill {
  flex-grow: 1;
  flex-shrink: 0; /* 防止该列缩小 */
}
</style>