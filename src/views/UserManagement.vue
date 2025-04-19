<template>
  <!-- ...existing code... -->
  
  <!-- Replace existing success modal with the new component -->
  <SuccessModal
    :show="showSuccessModal"
    :title="successTitle"
    :message="successMessage"
    :buttonText="'Done'"
    @close="showSuccessModal = false"
  />
  
  <!-- ...existing code... -->
</template>

<script>
// ...existing code...
import SuccessModal from '@/components/SuccessModal.vue';

export default {
  // ...existing code...
  components: {
    // ...existing components...
    SuccessModal
  },
  data() {
    return {
      // ...existing data...
      successTitle: "Success!",
      successMessage: "User has been updated successfully.",
      // ...existing data...
    }
  },
  methods: {
    // ...existing methods...
    showSuccessNotification(title, message) {
      this.successTitle = title;
      this.successMessage = message;
      this.showSuccessModal = true;
    }
    // ...existing methods...
  }
  // ...existing code...
}
</script>
