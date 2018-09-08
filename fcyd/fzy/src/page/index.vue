<template>
	<div>
		<!-- 标题-->
		<page-head :title="title"></page-head>
		<!-- 轮播-->
		<div>
			
		</div>

		<!-- 最新课程 -->
		<div class="list-title">
			<span>最新课程</span>
		</div>
		<div class="list-item">

			<div class="item-row">
				<div class="item-box" v-for="item in newList" @click="goStudy(item.ID)">
					<div class="img-warp">
						<img src="../assets/a.jpg" alt="...">
						<h2>{{item.Cname}}</h2>
						<p>{{item.Cdescribe}}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import pageHead from "@/components/pageHead";

	export default {
		components: {
			pageHead,
	
		},
		data: function() {
			return {
				title: "首页",
				bannerList: [{
						"Cname": "200",
						"ID": 1,
						"Cdescribe": "555",
						"Cpic": "../assets/a.jpg",
						"Cprice": 444
					},
					{
						"Cname": "56",
						"ID": 2,
						"Cdescribe": "56",
						"Cpic": "../assets/a.jpg",
						"Cprice": 56
					},
					{
						"Cname": "78",
						"ID": 3,
						"Cdescribe": "78",
						"Cpic": "../assets/a.jpg",
						"Cprice": 78
					}
				],
				newList: [{
						"Cname": "200",
						"ID": 1,
						"Cdescribe": "555",
						"Cpic": "../assets/a.jpg",
						"Cprice": 444
					},
					{
						"Cname": "56",
						"ID": 2,
						"Cdescribe": "56",
						"Cpic": "../assets/a.jpg",
						"Cprice": 56
					},
					{
						"Cname": "78",
						"ID": 3,
						"Cdescribe": "78",
						"Cpic": "../assets/a.jpg",
						"Cprice": 78
					},
					{
						"Cname": "78",
						"ID": 4,
						"Cdescribe": "78",
						"Cpic": "../assets/a.jpg",
						"Cprice": 78
					},
					
					{
						"Cname": "78",
						"ID": 5,
						"Cdescribe": "78",
						"Cpic": "../assets/a.jpg",
						"Cprice": 78
					},
					
					{
						"Cname": "78",
						"ID": 6,
						"Cdescribe": "78",
						"Cpic": "../assets/a.jpg",
						"Cprice": 78
					}
					
				],
			}

		},
	
	}
</script>

<style scoped="scoped">
	.swiper-box {
		width: 100%;
		height: 4.65rem;
	}
	
	.swiper-box img {
		width: 100%;
		Height: auto;
	}
	
	.list-title {
		background-color: #fff;
		color: #444;
		padding: 0.4rem;
		border: 1px solid #DDDDDD;
		font-size: 0.6rem;
	}
	
	.list-item {
		padding: 5px;
	}
	
	.list-item .item-row {
		padding: 16px;
		display: flex;
		flex-wrap: wrap; /*放不下    换行   */
	}
	
	.list-item .item-row .item-box {
		width: 50%;
	}
	
	.list-item .item-row .item-box .img-warp {
		padding: 0 6px;
	}
	
	.list-item .item-row .item-box .img-warp img {
		width: 100%;
	}
	
	.list-item .item-row .item-box h2 {
		font-weight: normal;
		margin: 0 0 0.2rem 0;
	}
	
	.list-item .item-row .item-box p {
		margin: 10px 0;
	}
	
	.course-list {
		padding: 5px;
	}
</style>