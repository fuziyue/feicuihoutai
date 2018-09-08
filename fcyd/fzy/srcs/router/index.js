
import Vue from 'vue' //加载vue
import Router from 'vue-router'  //加载路由插件

//加载路由中使用的组件（组件选项） @==》../
import HelloWorld from '@/components/HelloWorld'
import a from "../components/a"  //加载a.vue组件；
import b from "@/components/b"   //加载使用动态路由的b组件
import c from "@/components/c"

//使用路由插件
Vue.use(Router)

export default new Router({
  routes: [//路由的规则
    {
      path: '/',//路径
      name: 'HelloWorld',//名称
      component: HelloWorld//组件
    },
    {
    	path:"/a",
    	name:"a",
    	component:a
    },
    {
    	path:"/user/:id",//动态路由；
    	name:"b",
    	component:b
    },
    {
    	path:"/c",//动态路由；
    	name:"c",
    	component:c
    }
  ]
})
