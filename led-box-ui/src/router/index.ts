import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import PatternOverview from "@/components/PatternOverview.vue";
import AdminPanel from "@/components/AdminPanel.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: PatternOverview,
  },
  {
    path: "/admin",
    component: AdminPanel,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
