<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-x-hidden overflow-y-auto">
    <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
    <div class="relative z-10 w-full max-w-md transform bg-white rounded-lg shadow-xl transition-all">
      <div class="p-6 text-center">
        <div class="flex justify-center mb-4">
          <span class="inline-flex items-center justify-center p-3 bg-green-100 rounded-full">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </span>
        </div>
        <h3 class="mb-3 text-xl font-medium text-gray-900">{{ title }}</h3>
        <p class="mb-5 text-gray-600">{{ message }}</p>
        <div class="flex justify-center">
          <button
            @click="closeModal"
            class="w-40 py-2 px-4 text-white bg-green-600 hover:bg-green-700 rounded-lg focus:ring-4 focus:outline-none focus:ring-green-200"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessModal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Success!"
    },
    message: {
      type: String,
      default: "Operation completed successfully."
    },
    buttonText: {
      type: String,
      default: "OK"
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>
