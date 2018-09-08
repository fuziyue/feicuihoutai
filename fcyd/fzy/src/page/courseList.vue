<template>
	<div>
		<!-- 标题-->
		<page-head :title="title"></page-head>
		<!-- 搜索框-->
		<div class="search-input">
			<i class="fa fa-search" ></i>
			<input type="text" placeholder="搜索课程" />
		</div>
		<!--课程列表-->
		<ul class="class-list">
			<li v-for="category in categoryList">
				{{category}}
			</li>
			<li>全部</li>
			
		</ul>
		<!-- 课程列表 -->
		<div>
			<course-list></course-list>
		</div>
	</div>
</template>

<script>
	import pageHead from "@/components/pageHead";
	import courseList from "@/components/courseList";
	export default {
		components: {
			pageHead,
			courseList
		},
		data: function() {
			return {
				title: "课程",
				categoryList: ["移动开发","移动开发","移动开发"],
			}
		}	
	}
</script>

<style scoped="scoped">
	/* 搜索框*/
	.search-input {
		height: 0.8rem;
		margin-top: 5px;
		padding: 0 20px 0 40px;
		position: relative;
	}
	
	.search-input i {
		position: absolute;
		top: 0.2rem;
		left: 0.5rem;
		font-size: 0.4rem;
		cursor: pointer;
	}
	
	.search-input input {
		width: 100%;
		height: 100%;
		padding-left: 5px;
	}
	/* 分类 */
	
	.class-list {
		margin-top: 18px;
		width: 100%;
		display: flex;
		flex-wrap: wrap-reverse;
		justify-content: space-around;
	}
	
	.class-list li {
		padding: 8px;
		border: 1px solid #ccc;
		cursor: pointer;
	}
	
	.class-list li:hover {
		background: #0C60EE;
		color: #FFFFFF;
	}
</style>