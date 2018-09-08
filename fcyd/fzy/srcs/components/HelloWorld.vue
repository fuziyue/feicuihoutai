<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    
    <a-com></a-com>
    <a-com></a-com>
    <a-com></a-com>
    
    <hr />
    <router-link :to="{name:'b',params:{id:1}}">1</router-link>
    <router-link :to="{name:'b',params:{id:2}}">2</router-link>
    <br />
    <hr />
    <router-link v-for="(num,index) in arr" :key="index" :to="{name:'b',params:{id:num}}">{{num}}</router-link>
    <br />
    <hr />
    <button v-for="num in arr" @click="goB">{{num}}</button>

  </div>
</template>

<script>
// 1）加载要使用的组件；
// 2）注入到当前的组件里面；
// 3）像html中组件的使用方式一样去使用； 

/*
 		在项目中怎么使用动态路由？
 			1、组件接收动态路由传递的数据；
 				$route.params.id
 			2、在index.js路由文件  加载该组件配置 动态的路由 /user/:id
 			3、在其它组件中写跳转 /user/2
 * */
import aCom from "./a.vue"	//加载要使用的a组件（在这里重新命名的名字就变成局部组件了）；
import bCom from "./b.vue"


export default {
  name: 'HelloWorld',
  components:{aCom,bCom},//局部组件的注册；
  
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      arr:[1,2,3,4,5,6,7,8,9,10]
    }
  },
  methods:{
  	goB(num){
  		this.$router.push(`/user/${num}`);
  	}
  	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
