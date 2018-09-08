<template>
  <div id="app">
  	
  	<router-link to="/a">a</router-link>
  	<router-link to="/">hello</router-link>
  	<router-link to="/c">c</router-link>
    <!--<img src="./assets/logo.png">-->
    <!--显示路由对应的组件的容器-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
