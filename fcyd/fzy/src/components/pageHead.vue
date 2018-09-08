<!-- 头部组件  -->
<template>
	<header class="page-title">
		<span class="go-back" v-show="isShowGoBack"  @click="goBack">
			返回
		</span>
		<!-- 接收到的信息-->
		<h2>{{title}}</h2>
	</header>
</template>
<script>
	export default {
		props:["title"], // title 接收数据的名称 ==> 显示标题
		methods: {
			goBack: function() {// 返回
				this.$router.go(-1);
			}
		},
		computed:{
			isShowGoBack(){ // 是否显示  返回按钮
				// 获取分割地址后数组的length
				var routeLength=this.$route.path.split("/").length;
				return routeLength>2?true:false;
				// 如果 长度为  大于2   ==>   /xx/xxx  ==> 显示返回按钮
				//            不大于2  ==》  /xx   | /  ==> 隐藏返回按钮   	
			}
		}
	}
</script>

<style scoped="scoped">
	.page-title {
		height: 1.2rem;
		line-height: 1.2rem;
		background: #FFFFFF;
		font-size: 0.6rem;
		text-align: center;
		border: 1px solid #DDDDDD;
		position: relative;
		z-index: 2;
		position: relative;
	}

	.page-title .go-back {
		font-size: 20px;
		position: absolute;
		top: 1px;
		left: 10px;
		bottom: 5px;
	}
</style>