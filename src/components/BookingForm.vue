<template>
  <!-- ...existing code... -->
  
  <!-- Replace existing success modal with the new component -->
  <SuccessModal
    :show="showSuccessModal"
    :title="'Booking Successful'"
    :message="'Your laboratory reservation has been successfully submitted!'"
    :buttonText="'Continue'"
    @close="handleSuccessModalClose"
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
  methods: {
    // ...existing methods...
    handleSuccessModalClose() {
      this.showSuccessModal = false;
      // Add any additional logic needed after closing the modal
    }
  }
  // ...existing code...
}
</script>
