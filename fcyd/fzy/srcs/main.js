// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'// 加载vue框架 
import App from './App'// 加载默认显示的组件
import router from './router'// 加载router文件夹中 路由文件
import store from './vuex/index.js'  //加载vuex中的store实例 
//  路由文件 路由文件夹 router  ==》 index.js
// 默认加载 文件夹 下面的 index.js

// 设置vue的提示     关闭
Vue.config.productionTip = false

/* eslint-disable no-new */
// vue实例 
new Vue({
  el: '#app',// 挂载到的dom节点 ==》 index.html 
  router,//  注入的路由文件 
  store,//  注入store实例；
  components: { App }, // 注册局部组件  { key ：value}  
  //      {组件的名称 ： 组件选项 }
  //       { App ： App }
  // vue-cli 的项目中    .vue文件  就是组件的选项 
  template: '<App/>' // 如果组件中没有  放东西  
  //  <mycc> </mycc>    ==> 可以写成单标签  <mycc/>
})
