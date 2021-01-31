import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import VueRouter from "vue-router";
import AdminPanel from "./components/AdminPanel.vue";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", component: App },
    { path: "/admin", component: AdminPanel },
  ],
});

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App),
}).$mount("#app");
