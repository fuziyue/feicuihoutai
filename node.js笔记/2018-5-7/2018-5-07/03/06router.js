// 06router.js
// 路由文件
//  写路由  写请求（地址+方式+数据）的处理过程
// 暴露出去
// * 写路由
// *  登录的请求
// 步骤
// 1. 加载express
// 2. 生成一个express的路由对象
// 3. 编写路由
// 4. 暴露出去
var express=require("express");
var router =express.Router();// 返回一个对象  有处理get的方法  和处理post的方法
// router.get()   // 处理get方式请求的方法
// router.post()  // 处理post方式请求的方法
// 参数  
// 第一  处理的地址
// 第二 处理的中间件

// * 请求方式     请求地址        处理中间件
// *  get      /login       匹配用户名和密码
//    post     /user         发送： 用户信息 
router.get("/login",function(req,res){
	// 写处理过程==》 匹配用户名和密码
	res.send("登录成功")
})
router.post("/user",function(req,res){
	// 写处理的过程
	res.send({name:"小明",age:"18",sex:"男"})
	
})

module.exports=router; // 暴露出去 
/*
 * 浏览器的请求    get | post 
 * get  地址栏直接输入的，标签的src和herf发送的
 * 		数据在地址上 （看见）
 * 		不安全			
 * 		数据量有限
 * 
 * post form表单  ajax 
 * 		数据 虚拟对象中（看不见）
 * 		安全
 * 		数据量没有限制
 * 
 * 路由：根据请求的方式和 请求的地址 ==》 找处理到中间件
 * 
 * 写路由
 *  登录的请求
 * 请求方式     请求地址        处理中间件
 *  post      /login       匹配用户名和密码
 * */
