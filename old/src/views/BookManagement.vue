<template>
  <div class="book-management">
    <!-- 查询和添加按钮 -->
    <div class="operation-buttons">
      <el-button type="success" @click="openAddDialog">添加书籍</el-button>
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
      
      <el-table-column prop="isbn" label="ISBN" width="130" />
      <el-table-column prop="category" label="分类" width="130" />
      <el-table-column prop="stockQuantity" label="数量" width="80" />
      <el-table-column
        :prop="'publishedDate'"
        :label="'出版日期'"
        width="130"
        :formatter="formatDate"
      />
      <el-table-column label="操作" class=".flex-fill">
        <template #default="scope">
          <el-button size="small" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(scope.row.bookId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加书籍对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加书籍" width="500px">
      <el-form :model="addBookData" label-width="80px">
        <el-form-item label="书名">
          <el-input v-model="addBookData.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="addBookData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="addBookData.publisher" placeholder="请输入出版社" />
        </el-form-item>
        <el-form-item label="出版日期">
          <el-date-picker
            v-model="addBookData.publishedDate"
            type="date"
            placeholder="选择出版日期"
          />
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="addBookData.isbn" placeholder="请输入ISBN" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="addBookData.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input type="number" v-model="addBookData.stockQuantity" placeholder="请输入库存数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addBook">确认添加</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑书籍对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑书籍信息" width="500px">
      <el-form :model="editBookData" label-width="80px">
        <el-form-item label="书籍ID">
          <el-input v-model="editBookData.bookId" disabled />
        </el-form-item>
        <el-form-item label="书名">
          <el-input v-model="editBookData.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="editBookData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="editBookData.publisher" placeholder="请输入出版社" />
        </el-form-item>
        <el-form-item label="出版日期">
          <el-date-picker
            v-model="editBookData.publishedDate"
            type="date"
            placeholder="选择出版日期"
          />
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="editBookData.isbn" placeholder="请输入ISBN" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="editBookData.category" placeholder="请输入分类" />
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input type="number" v-model="editBookData.stockQuantity" placeholder="请输入库存数量" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateBook">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 书籍列表数据
const tableData = ref([])
const searchQuery = ref(''); // 在 script setup 中定义搜索查询

// 添加书籍相关
const addDialogVisible = ref(false)
const addBookData = ref({
  title: '',
  author: '',
  publisher: '',
  publishedDate: '',
  isbn: '',
  category: '',
  stockQuantity: 0
})

// 编辑书籍相关
const editDialogVisible = ref(false)
const editBookData = ref({
  bookId: '',
  title: '',
  author: '',
  publisher: '',
  publishedDate: '',
  isbn: '',
  category: '',
  stockQuantity: 0
})

// 格式化日期函数
function formatDate(row, column) {
  const date = new Date(row[column.property]); // 获取日期
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

// 打开添加对话框
function openAddDialog() {
  addBookData.value = {
    title: '',
    author: '',
    publisher: '',
    publishedDate: '',
    isbn: '',
    category: '',
    stockQuantity: 0
  }
  addDialogVisible.value = true
}

// 添加书籍
function addBook() {
  fetch("http://localhost:8080/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(addBookData.value)
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("书籍添加成功")
      addDialogVisible.value = false
      getBookList()
    } else {
      throw new Error('添加失败')
    }
  })
  .catch(error => {
    ElMessage.error(error.message)
  })
}

// 打开编辑对话框
function openEditDialog(book) {
  editBookData.value = { ...book }; // 确保传入book的完整数据
  editDialogVisible.value = true
}

// 更新书籍信息
function updateBook() {
  const bookId = editBookData.value.bookId;

  if (!bookId || !editBookData.value.title) {
    ElMessage.error("书籍ID或标题缺失");
    return;
  }

  fetch(`http://localhost:8080/api/books/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(editBookData.value)
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("书籍信息更新成功")
      editDialogVisible.value = false
      getBookList()
    } else {
      return res.text().then(text => {
        throw new Error(text || '更新失败');
      });
    }
  })
  .catch(error => {
    ElMessage.error(error.message);
  });
}

// 确认删除
function confirmDelete(id) {
  ElMessageBox.confirm(
    '确定要删除这本书吗?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteBook(id);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}

// 删除书籍
function deleteBook(id) {
  fetch(`http://localhost:8080/api/books/${id}`, {
    method: "DELETE"
  })
  .then(res => {
    if (res.ok) {
      ElMessage.success("书籍删除成功")
      getBookList()
    } else {
      return res.text().then(text => {
        throw new Error(text || '删除失败');
      });
    }
  })
  .catch(error => {
    ElMessage.error(error.message);
  });
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
  /* 确保这列可以扩展以填充剩余空间 */
  flex-grow: 1;
  flex-shrink: 0; /* 阻止列收缩 */
}
</style>