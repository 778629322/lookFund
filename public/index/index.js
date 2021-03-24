import "./style/reset.css";
import "./style/common.css";
import "lib-flexible/flexible";
import Vue from "vue";
import App from "./App";
import router from "./page/router";

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
