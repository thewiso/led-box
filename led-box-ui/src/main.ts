import Vue from "vue";
import App from "./App.vue";
import store from "./plugins/store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import router from "./plugins/router";
import i18n from "./plugins/i18n";

Vue.config.productionTip = false;
new Vue({
  store,
  vuetify,
  router,
  i18n,
  render: h => h(App),
}).$mount("#app");
