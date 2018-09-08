// router/index.js   
import Vue from 'vue'
import Router from 'vue-router'

// 加载页面
import index from "@/page/index.vue"; // 首页
import courseList from "@/page/courseList.vue"; // 课程列表
import myCourse from "@/page/myCourse.vue"; // 我的课程
import userInfo from "@/page/userInfo.vue"; // 个人中心
import login from "@/page/login.vue"; // 登录
import register from "@/page/register.vue"; // 注册

import head from "@/components/pageHead"

Vue.use(Router)

export default new Router({
	routes: [{
			path: '/user/register',
			component: register
		}, {
			path: '/login',
			component: login
		},
		{
			path: "/",
			redirect: "/index"
		},
		{
			path: '/index',
			component: index
		},
		{
			path: '/courseList',
			component: courseList
		},
		{
			path: '/myCourse',
			component: myCourse
		},
		{
			path: '/userInfo',
			component: userInfo
		},

	]
})