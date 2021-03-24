import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const home = () => import("./home");
const calendar = () => import("./calendar");
const visualized = () => import("./visualized");

//路由体现文件的位置
//路由级别的组件名称大写
export default new Router({
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", component: home },
    { path: "/calendar/:fundCode", component: calendar },
    { path: "/visualized/:fundCode", component: visualized },
  ],
});
