<template>
  <div class="home-container">
  <div class="card">
      <h2 class="card-title">系统管理员权限</h2>
      <div class="permissions">
        <div class="permission-card" v-for="(permission, index) in adminPermissions" :key="index">
          <h3 class="permission-title">{{ permission.title }}</h3>
          <p class="permission-description">{{ permission.description }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="card-title">普通用户权限</h2>
      <div class="permissions">
        <div class="permission-card" v-for="(permission, index) in userPermissions" :key="index">
          <h3 class="permission-title">{{ permission.title }}</h3>
          <p class="permission-description">{{ permission.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adminPermissions: [
        { title: "管理图书信息", description: "增删改查图书信息" },
        { title: "管理用户信息", description: "增删改查用户信息" },
        { title: "借阅图书", description: "可以借阅可用的图书" },
        { title: "归还图书", description: "可以归还已借的图书" },
        { title: "查询图书信息", description: "查看所有可借图书的信息" },
        { title: "查询个人信息", description: "查看和编辑个人信息" },
      ],
      userPermissions: [
        { title: "借阅图书", description: "可以借阅可用的图书" },
        { title: "归还图书", description: "可以归还已借的图书" },
        { title: "查询图书信息", description: "查看所有可借图书的信息" },
        { title: "查询个人信息", description: "查看和编辑个人信息" },

      ]
    };
  },
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.home-title {
  font-size: 2rem; /* 调整为更小的字体大小 */
  color: #409EFF; /* Element 的蓝色 */
  margin-bottom: 15px; /* 增加间距，避免拥挤感 */
}

.card-title {
  font-size: 1.4rem; /* 调整为更小的字体大小 */
  margin-bottom: 10px;
}

.permissions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.permission-card {
  background-color: #f9f9f9;
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 200px; /* 设置宽度适应名片展示 */
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.permission-title {
  font-size: 1.1rem; /* 调整为更小的字体大小 */
  margin: 0;
}

.permission-description {
  font-size: 0.85rem; /* 调整为更小的字体大小 */
  color: #666;
}
</style>