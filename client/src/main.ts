import "vuetify/styles"; // Global CSS has to be imported
import '@/assets/main.css'
import { createApp } from "vue";
import VueKonva from 'vue-konva';
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import { PiniaUndo } from 'pinia-undo'

import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";


const pinia = createPinia();
pinia.use(PiniaUndo);

const vuetify = createVuetify({
  components,
  theme: {
    defaultTheme: "dark",
  },
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(VueKonva, { prefix: 'vk' })
app.mount("#app");
