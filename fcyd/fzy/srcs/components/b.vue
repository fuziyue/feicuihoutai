<template>
	<div>
		<p>接收的id数据</p>
		<p>id是{{$route.params.id}}</p>
		<button @click="goBcak">返回</button>
	</div>
</template>




<script>
	export default{
		mounted(){
			console.log("挂载之后");
			console.log(this.$route.params.id)
		},
		methods:{
			goBcak(){
				this.$router.go(-1);
			}
		}
	}
</script>



<style scoped>
	
	
</style>