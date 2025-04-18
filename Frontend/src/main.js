import { createApp } from 'vue';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import router from './router';
import store from './store'; // Import the Vuex store

const app = createApp(App);

// Use Toast plugin
app.use(Toast);
app.use(router); // Register the router
app.use(store); // Use the Vuex store

app.mount('#app');