<template>
  <div class="book-management">
    <!-- 查询和添加按钮 -->
    <div class="operation-buttons">
      <el-button type="primary" @click="getBookList">查询书籍</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="输入书名或其他关键字查询"
        style="width: 350px; margin-left: 10px; margin-top: 3px;"
      />
    </div>

    <!-- 书籍表格 -->
    <el-table :data="tableData" border style="width: 100%" class="book-table">
      <el-table-column prop="bookId" label="书籍ID" width="130" />
      <el-table-column prop="title" label="书名" width="130" />
      <el-table-column prop="author" label="作者" width="130" />
      <el-table-column prop="publisher" label="出版社" width="160" />
      <el-table-column :prop="'publishedDate'" :label="'出版日期'" width="130" :formatter="formatDate" />
      <el-table-column prop="isbn" label="ISBN" width="130" />
      <el-table-column prop="category" label="分类" width="130" />
      <el-table-column prop="stockQuantity" label="数量" width="80" />
      <el-table-column label="操作" class="flex-fill">
        <template #default="scope">
          <el-button size="small" type="success" @click="openEditDialog(scope.row)">
            借阅
          </el-button>
        </template>
      </el-table-column>
    </el-table>

<el-dialog v-model="editDialogVisible" title="选择书籍" width="600px">
  <template v-if="bookList.length > 0">
    <div>
      <el-radio-group v-model="selectedBookDetail">
        <el-radio
          v-for="(bookDetail, index) in bookList"
          :key="bookDetail.detailId"
          :label="bookDetail.detailId"
        >
          第{{ index + 1 }}本 - 状态：{{ convertStatus(bookDetail.status) }}
        </el-radio>
      </el-radio-group>
    </div>
  </template>
  <template v-else>
    <p>没有可借阅的书籍副本。</p>
  </template>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmSelection">确认借阅</el-button>
    </span>
  </template>
</el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// 书籍列表数据
const tableData = ref([]);
const bookList = ref([]); // 存储选择书籍的列表
const selectedBookDetail = ref(null); // 存储选中的书籍副本
const searchQuery = ref(''); // 搜索查询
const editDialogVisible = ref(false); // 对话框可见性

// 格式化日期函数
function formatDate(row, column) {
  const date = new Date(row[column.property]);
  return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
}

// 获取书籍列表
async function getBookList() {
  try {
    const response = await fetch(`http://localhost:8080/api/books?search=${searchQuery.value}`);
    if (!response.ok) throw new Error('加载书籍列表失败');
    tableData.value = await response.json(); // 更新表格数据
    ElMessage.success('书籍列表加载成功');
  } catch (error) {
    ElMessage.error(error.message || '请求失败');
  }
}

function convertStatus(status) {
    console.log('当前状态:', status); // 添加调试输出

    switch (status) {
        case 'available':
            return '可借阅';
        case 'borrowed':
            return '已借出';
        case 'lost':
            return '已遗失';
        default:
            console.warn('未知状态:', status); // 打印警告信息
            return '未知状态'; // 如果状态值不在上述选项中
    }
}

// 打开对话框并获取书籍副本
async function openEditDialog(book) {
    try {
        const response = await fetch(`http://localhost:8080/api/bkDet/${book.bookId}`);
        if (!response.ok) throw new Error('获取书籍明细失败');

        const bookDetails = await response.json();
        console.log('获取到的书籍细节:', bookDetails); // 打印获取的书籍细节

        // 设置 bookList
        // 确保 bookDetails 是数组
        if (Array.isArray(bookDetails)) {
            bookList.value = bookDetails; // 直接赋值为数组
        } else {
            bookList.value = [bookDetails]; // 如果是单个对象，包装成数组
        }

        // 输出每个副本的状态以确保我们获取了正确的值
        bookList.value.forEach(detail => {
            console.log(`书籍副本 ID: ${detail.detailId}, 状态: ${detail.status}`);
        });

        selectedBookDetail.value = null; // 重置选中的副本
        editDialogVisible.value = true; // 显示对话框
    } catch (error) {
        ElMessage.error(error.message || '请求失败');
    }
}

async function confirmSelection() {
    // 检查是否选择了书籍副本
    if (!selectedBookDetail.value) {
        ElMessage.warning('请先选择一本书籍副本');
        return;
    }

    const selectedBook = bookList.value.find(book => book.detailId === selectedBookDetail.value);
    console.log('选中的书籍副本:', selectedBook);

    // 从 localStorage 获取用户信息
    const user = JSON.parse(localStorage.getItem("user"));
    
    console.log('从localStorage获取的用户信息:', user);
    
    if (!user || !user.userid) {
        ElMessage.warning('用户未登录，请先登录');
        return;
    }

    // 设置借阅时间为当前时间
    const borrowDate = new Date().toISOString();
    
    // 日志调试
    console.log('请求参数:', {
        userId: user.userid,
        detailId: selectedBook.detailId,
        borrowDate: borrowDate // 使用 ISO 格式的日期
    });

    try {
        const response = await fetch('http://localhost:8080/api/bkHit/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userid, // 从 localStorage 获取的用户ID
                detailId: selectedBook.detailId,
                borrowDate: borrowDate // 当前日期的 ISO 字符串
            }),
        });

        if (response.ok) {
            const result = await response.text(); // 根据返回类型使用 `text()`
            console.log('借阅结果:', result);
            ElMessage.success(result); // 提示借阅结果
        } else {
            const errorMessage = await response.text(); // 获取错误信息
            throw new Error(errorMessage || '借阅失败，请稍后再试');
        }
    } catch (error) {
        console.error('借阅时出现错误:', error);
        ElMessage.error(error.message || '请求失败');
    }

    editDialogVisible.value = false; // 关闭对话框
}
// 初始化时加载书籍列表
getBookList();
</script>

<style scoped>
.book-management {
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