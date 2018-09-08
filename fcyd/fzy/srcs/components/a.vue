
<!--组件模板-->
<template>
	<div>  <!--根标签-->
		<p>计数器</p>
		<p>数字：{{num}}</p>
		<p>
			<button @click="add">++</button>
			<button @click="sub">--</button>
		</p>
	</div>
</template>
	
	
<!-- 一个路由可以写成一个页面，就会变成一个页面的渲染   -->	
	
<script>
	//热加载  （热启动）
	//修改src文件夹中内容后  保存(strl+s) ==>页面重新加载
	
	//组件模板的数据和功能；
	export default{
		data:function(){
			return {
				num:0  //计数器的数字
			}
		},
		methods:{
			add(){
				this.num++;
			},
			sub(){
				this.num--;
			}
		}
	}
	
</script>


<!-- scoped 限制样式的使用范围的 加上scoped 之后  样式只能作用于当前的组件，不加  作用于所有组件-->
<style scoped>
	/*模板的样式*/
	*{
		color: pink;
	}
</style>