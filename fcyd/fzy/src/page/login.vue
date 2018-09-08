<template>
	<div class="login-wrap">

		<div class="logo-wrap">
			<img src="../assets/login_logo.png" />
		</div>

		<div class="input-wrap">
			<div class="input-box">
				<input type="text" placeholder="用户名"/>
			</div>
			<div class="input-box">
				<input type="password" placeholder="密码" />
			</div>
		</div>

		<button @click="login">登录</button>

		<div class="a-btn">
			<router-link to="/user/register">注册</router-link>
			<router-link to="/">忘了密码</router-link>
		</div>

	</div>
</template>

<script>

	export default {
		data: function() {
			return {

			}

		},
		methods: {
			login(){
				this.$router.push("/userInfo")
			}
		}
	}
</script>

<style scoped="scoped">
	.login-wrap {
		background: url("../assets/login_bg.png")no-repeat;
		background-size: 100%;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.login-wrap .logo-wrap {
		width: 100%;
		margin-top: 2rem;
		text-align: center;
		height: 2.8rem;
	}

	.login-wrap .logo-wrap img {
		height: 100%;
	}

	.login-wrap .input-wrap {
		width: 75%;
		margin: 1.5rem auto;
		background: #FFFFFF;
	}

	.login-wrap .input-wrap .input-box {
		padding: 0 10px;
		border: 1px solid #DDDDDD;
	}

	.login-wrap .input-wrap input {
		height: 1.2rem;
		width: 100%;
		border: none;
	}

	.login-wrap .input-wrap input:last-child {
		border-top: none;
	}

	.login-wrap button {
		display: block;
		width: 75%;
		margin: 1rem auto;
		background-color: #387ef5;
		color: #fff;
		font-size: 16px;
		line-height: 42px;
		cursor: pointer;
		border-radius: 4px;
		border: 1px solid transparent;
		cursor: pointer;
	}

	.login-wrap button:hover {
		border-color: transparent;
		background-color: #387ef5;
	}

	.login-wrap button:active {
		border-color: #a2a2a2;
		background: #0c60ee;
	}

	.login-wrap .a-btn {
		display: flex;
		justify-content: space-between;
		padding: 0 1.5rem;
	}
</style>