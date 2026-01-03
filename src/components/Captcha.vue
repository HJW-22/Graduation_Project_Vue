<template>
  <div class="captcha" @click="refreshCaptcha">
    <canvas ref="canvas" width="120" height="35"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const canvas = ref(null);
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const captcha = ref(''); // 生成的验证码

// 生成验证码的函数
const generateCaptcha = () => {
  let captchaString = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captchaString += characters[randomIndex];
  }
  return captchaString;
};

// 绘制验证码
const drawCaptcha = (text) => {
  const ctx = canvas.value.getContext('2d');
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.font = '24px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(text, 10, 30);
};

// 刷新验证码
const refreshCaptcha = () => {
  const newCaptcha = generateCaptcha();
  captcha.value = newCaptcha; // 保存生成的验证码
  drawCaptcha(newCaptcha);
};

// 在组件挂载时生成第一个验证码
onMounted(() => {
  refreshCaptcha();
});

// 使用 setup 提供一个获取验证码的函数
const getCaptchaValue = () => captcha.value;

// 使用响应式方法返回函数, 以便父组件调用
defineExpose({
  getCaptcha: getCaptchaValue,
});
</script>

<style scoped>
.captcha {
  cursor: pointer;
  display: inline-block;
  border: 1px solid #ddd;
  margin-top: 10px;
}
</style>