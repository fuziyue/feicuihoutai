<template>
	<div>
		<div class="head-wrap">
			<img src="../assets/info-tt.png" />
		</div>
		<ul class="info-list">
			<li><i class="fa fa-user-o fa-fw"></i> <span>{{userName}}</span></li>
			<li><i class="fa fa-envelope-o fa-fw"></i> <span>{{email}}</span></li>
			<li><i class="fa fa-phone fa-fw"></i> <span>{{phone}}</span></li>
		</ul>
		<button @click="quit">退出</button>
	</div>
</template>
<script>

	export default {
		data: function() {
			return {
				userName: "",
				email: "",
				phone: ""
			}
		},
		methods: {
			quit:function(){
				// 跳转到 登录页
				this.$router.push("/login")
			}
		}

	}
</script>

<style scoped="scoped">
	.head-wrap {
		background: url(../assets/info_bg.png)no-repeat 0 0;
		background-size: 100%;
		height: 6.5rem;
		line-height: 8.2rem;
		text-align: center;
	}

	.head-wrap img {
		width: 2.6rem;
	}

	.info-list li {
		border-bottom: 1px solid #DDDDDD;
		height: 1.2rem;
		font-size: 0.6rem;
		line-height: 1.2rem;
		display: flex;
		justify-content: space-between;
		padding: 0 10px;
	}

	.info-list li i {
		margin-top: 0.3rem;
	}

	button {
		display: block;
		width: 60%;
		margin: 1rem auto;
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