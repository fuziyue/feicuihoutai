<template>
	<div>
		<div class="tab-wrap"  v-show="isShowTabs">
			<div class="tab">
				<div class="tab-item">
					<router-link to="/index">
						<i class="fa fa-home  fa-fw"></i>
						<span>首页</span>
					</router-link>
				</div>
				<div class="tab-item">
					<router-link to="/courseList">
						<i class="fa fa-th-list  fa-fw"></i>
						<span>课程列表</span>
					</router-link>
				</div>
				<div class="tab-item">
					<router-link to="/myCourse">
						<i class="fa fa-book fa-fw  fa-fw"></i>
						<span>我的课程</span>
					</router-link>
				</div>
				<div class="tab-item">
					<router-link to="/userInfo" 
						:class="{'router-link-exact-active':isAction}">
						<div> <i class="fa fa-user-circle-o  fa-fw"></i></div>
						<span>个人中心</span>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {}
		},
		computed:{
			isAction(){
				console.log(this.$route.path)
				// 计算地址   /login    判断是否使用  样式
				return  this.$route.path=="/login"?true:false;
			},
			isShowTabs(){
				// 获取分割地址后数组的length
				var routeLength=this.$route.path.split("/").length;
				return routeLength>2?false:true;
				// 如果 长度为  大于2   ==>   /xx/xxx  ==> 隐藏tabs
				//            不大于2  ==》  /xx   | /  ==> 显示tabs   	
		
			}
			
		}

	}
</script>

<style scoped>
	.tab-wrap .tab {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1.6rem;
		/*line-height: 0.6rem;*/
		display: flex;
		background: #fff;
		box-shadow: 0 0 3px rgba(0, 0, 0, .2);
		z-index: 2;
	}

	.tab-wrap .tab .tab-item {
		padding-top: 6px;
		flex: 1;
		text-align: center;
	}

	.tab-wrap .tab .tab-item a {
		display: block;
		font-size: 16px;
		color: rgb(77, 85, 93);
		font-size: 0.4rem;
	}

	.tab-wrap .tab .tab-item i {
		font-size: 0.6rem;
	}

	.tab-wrap .tab .tab-item span {
		display: block;
		margin-top: 4px;
	}
	/* .router-link-exact-active 配置当链接被精确匹配的时候应该激活的 class */
	.tab-wrap .tab .tab-item a.router-link-exact-active {
		color: #387ef5;
	}
</style>