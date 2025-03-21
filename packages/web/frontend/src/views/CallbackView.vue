<script setup lang="ts">
import { useHandleSignInCallback } from '@logto/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { isLoading } = useHandleSignInCallback(() => {
  // Redirect to home page after successful sign-in
  router.push('/');
});
</script>

<template>
  <div class="callback-container">
    <p v-if="isLoading">Redirecting after authentication...</p>
  </div>
</template>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style> 