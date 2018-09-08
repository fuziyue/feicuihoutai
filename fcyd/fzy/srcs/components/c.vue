<template>
	<div>
		<h2>{{title}}</h2>
		<p>{{num}}</p>
		<button @click="add">++</button>
		<button @click="sub">--</button>
	</div>
</template>




<script>
	export default{
		computed:{//获取vuex中数据
			num(){
				return this.$store.state.num;
			},
			title(){
				return this.$store.state.title;
			}
		},
		methods:{//触发方法
			add(){
				this.$store.commit("add");
			},
			sub(){
				this.$store.commit("sub");
			}
		}
	}
	
</script>

<style scoped>
	
	
	
</style>