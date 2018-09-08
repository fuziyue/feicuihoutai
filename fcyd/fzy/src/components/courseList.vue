<template>
	<div class="course-list">
		<div  class="course-item">
			<div class="item-img">
				<img src="../assets/a.jpg" alt="...">
			</div>
			<div class="item-text">
				<h2>前端</h2>
				<p>前端课程</p>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data: function() {
			return {}
		},
	}
</script>

<style scoped="scoped">
	.course-list {
		margin-top: 10px;
		padding: 5px;
	}
	
	.course-item {
		display: flex;
		padding-left: 20px;
		border: 1px solid #DDDDDD;
		border-top: none;
	}
	
	.course-item:first-child {
		border: 1px solid #DDDDDD;
	}
	
	.course-item .item-img {
		height: 2.6rem;
		margin: 10px 0;
	}
	
	.course-item .item-img img {
		height: 100%;
	}
	
	.course-item h2 {
		font-weight: normal;
		font-size: 0.6rem;
		margin: 0.4rem 0 0.4rem;
		padding-left: 8px;
	}
	
	.course-item p {
		font-size: 0.5rem;
		padding-left: 12px;
	}
</style>