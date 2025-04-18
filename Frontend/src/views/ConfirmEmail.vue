<template>
    <div class="confirmation-container">
      <h1>Email Confirmation</h1>
      <p v-if="loading">Confirming your email...</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { supabase } from '../lib/supabaseClient';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  const loading = ref(true);
  const successMessage = ref('');
  const errorMessage = ref('');
  
  onMounted(async () => {
    const accessToken = route.query.access_token;
    const type = route.query.type;
  
    if (!accessToken || type !== 'signup') {
      errorMessage.value = 'Invalid confirmation link.';
      loading.value = false;
      return;
    }
  
    try {
      const { error } = await supabase.auth.verifyOTP({
        token: accessToken,
        type: 'signup',
      });
  
      if (error) {
        console.error('Confirmation error:', error.message);
        errorMessage.value = 'Error confirming your email. Please try again or contact support.';
      } else {
        successMessage.value = 'Your email has been confirmed successfully! You can now log in.';
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      errorMessage.value = 'An unexpected error occurred. Please try again.';
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>
  .confirmation-container {
    text-align: center;
    margin-top: 50px;
  }
  
  .success-message {
    color: green;
  }
  
  .error-message {
    color: red;
  }
  </style>