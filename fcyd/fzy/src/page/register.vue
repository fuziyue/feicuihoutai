<!-- 注册页面 -->
<template>
	<div class="bg">
		<!-- 标题-->
		<!-- title 传入到  子组件  pageHead 中-->
		<!-- 父传子        v-bind:接收的名称="传递的"-->
		<page-head v-bind:title="title"></page-head>
		<!--<page-head v-bind:title="title"></page-head>-->
		<!-- 输入框-->
		<div class="input-wrap">
			<div class="input-box">
				<input type="text" placeholder="用户名" v-model="info.userName" />
			</div>
			<div class="input-box">
				<input type="text" placeholder="邮箱" v-model="info.email" />
			</div>
			<div class="input-box">
				<input type="text" placeholder="手机号"  v-model="info.phone" />
			</div>
			<div class="input-box">
				<input type="password" placeholder="密码" v-model="info.password" />
			</div>
			<div class="input-box">
				<input type="password" placeholder="确认密码" v-model="info.enter_password" />
			</div>

		</div>
		<button @click="register">注册</button>
	</div>
</template>
<script>
	// 使用  头部组件 
	import pageHead from "@/components/pageHead";
	export default {
		components: {pageHead},
		data: function() {
			return {				
				title:"注册", // 传给pageHead组件显示
				info:{
					userName:"",// 用户名
					password:"",// 密码
					enter_password:"",// 确认密码
					email:"", // 邮箱
					phone:"",// 手机号
				}
			}
		},
		methods: {
			register:function(){ // 注册
				// 1. 获取到 input中内容
				// 2. 简单验证
				//	1) 全部填写   2）密码和确认密码一致
				// 3. 发送请求
				if(this.info.userName!=""&& 
				this.info.email!=""&&
				this.info.phone!=""&&
				this.info.password!=""&&
				this.info.enter_password!=""){
					if(this.info.password==this.info.enter_password){
						var _this=this;//保存 指向vue组件的this
						
						
						
						// 发送请求
						//this ==>vue组件  ==> 本质 vue实例
						// this.$axios==> axios 插件
						this.$axios({
							method:"post",// 请求方式
							url:"/Handler/UserHandler?action=add",// 请求地址
							data:{
								// key ：value
								// name ： value
								userName:this.info.userName,//用户名
								email:this.info.email,// 邮箱
								phone:this.info.phone,// 手机号
								password:this.info.password,//密码
								userPic:""
							}
						}).then((res)=>{ //请求 成功后的回调
							//res 返回的数据
							console.log(res);
							//res ==》 对象  ==》 data 后台返回的数据
							// {success ：成功}
							// {err:"失败"}
							// 判断 是否注册成功
							if(res.data.success){ // 成功
								alert(res.data.success);
								// 返回登录页
								// axios 的回调中  this ！==》组件 实例
								// this==》 undefined
								
								// 怎么在 axios 中回调里面 范围  组件this
								console.log("axios 的回调中  this")
								console.log(this)
								this.$router.push("/login");
								// 1.  保存this指向  _this
								// 2. es6 的箭头函数
								
							}else{ // 失败
								alert(res.data.err)
							}
						}).catch(function(err){ // 请求失败后的回调
						//	err 失败的原因
							alert(err)
						})		
					}else{
						alert("两次密码不一致，请重新填写！！")
					}
				}else{
					alert("请填写完毕之后再提交！！！")
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.bg {
		background: url("../assets/register_bg.jpg")no-repeat;
		background-size: 100%;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.input-wrap {
		width: 75%;
		margin: 3rem auto 0;
		background: #FFFFFF;
		opacity: 0.5;
	}

	.input-wrap .input-box {
		padding: 0 10px;
		border: 1px solid #DDDDDD;
	}

	.input-wrap input {
		height: 1.2rem;
		width: 100%;
		border: none;
	}

	.input-wrap input:last-child {
		border-top: none;
	}

	button {
		display: block;
		width: 75%;
		margin: 1.5rem auto;
		background-color: #387ef5;
		color: #fff;
		font-size: 16px;
		line-height: 42px;
		cursor: pointer;
		border-radius: 4px;
		border: 1px solid transparent;
	}

	button:hover {
		border-color: transparent;
		background-color: #387ef5;
	}

	button:active {
		border-color: #a2a2a2;
		background: #0c60ee;
	}
</style>