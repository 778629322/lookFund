import Vue from "vue";

/**
 * 注册组件
 * 默认: 大小字母开头为路由, 小写字母开头为组件
 */

const compContext = require.context("../router", true, /\.vue$/);
const getCompPathName = path => {
  const match = path.match(/\w+?(?=\/)/g);
  if (!match) return "";
  return match.map(item => item.replace(/\//g, "")).join("-") + "-";
};

compContext.keys().forEach(p => {
  const name = p.match(/([\w\-]+)\.vue$/)[1];
  if (/^[A-Z]/.test(name)) {
    return;
  }
  const folder = getCompPathName(p).toLowerCase();
  const option = compContext(p).default;
  const final = "yn-" + folder + name;
  Vue.component(final, option);
});
