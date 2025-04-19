<template>
  <loading-animation :is-loading="isLoading" />
  <router-view />
</template>

<script>
import LoadingAnimation from '@/components/common/LoadingAnimation.vue'

export default {
  components: {
    LoadingAnimation
  },
  data() {
    return {
      isLoading: false,
      loadingTimeout: null
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      // Clear any existing timeout
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout)
      }
      
      // Only show loading if navigation takes more than 300ms
      this.loadingTimeout = setTimeout(() => {
        this.isLoading = true
      }, 300)
      
      next()
    })
    
    this.$router.afterEach(() => {
      // Clear the timeout to prevent showing loading if navigation was fast
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout)
        this.loadingTimeout = null
      }
      
      // If loading is already showing, hide it with a small delay for smooth transition
      if (this.isLoading) {
        setTimeout(() => {
          this.isLoading = false
        }, 200)
      }
    })
  }
}
</script>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  background-color: #F8F9FA;
}

/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
</style>
