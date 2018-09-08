<!-- app.vue -->
<template>
	<div id="app">
		<div class="content">
			<!-- 显示 路由中组件的容器-->
			<router-view/>
		</div>
		<!-- 使用  tabs.vue组件  底部导航 组件-->
		<tabs></tabs>
	</div>
</template>
<script>
	import tabs from "./components/tabs.vue"; // 底部导航
	export default {
		name: 'App',
		components: {
			tabs
		}
	}
</script>
<style scoped="">
.content{
	padding-bottom: 1.6rem;
}
</style>