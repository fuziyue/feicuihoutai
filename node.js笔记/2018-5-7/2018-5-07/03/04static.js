// express.static() 的使用
var express =require('express');
var app =express();
app.listen(3000,function(){
	console.log("服务器已启动")
})
// 静态资源中间件的使用
// 第一参数   托管的文件夹
// 第二参数  非必填项   静态资源托管中间件的  配置项   ==》 设置他的默认规则
//   {index:false} ==》 取消默认发送index.html 
//app.use(
//	express.static("public",{index:false})
//)
//   {index:"默认显示的页面"}   ==》 设置默认显示页面
app.use(
	express.static("public",{index:"hello.html"})
)
// 规则： 默认发送 网站的首页  index.html 页面
//   login.html ==》 登录页  ===> 登录之后  显示 首页 index.html
// 改变默认的规则 

// - 03 
//     04static.js
//     -public 
//        a.png
//        hello.html
//		  index.html  ==> 首页


// 启动  node 04static
// 访问   localhost:3000/a.png


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
 * 
 * 路由：根据请求的方式和 请求的地址 ==》 找处理到中间件
 * 
 * 写路由
 *  登录的请求
 * 请求方式     请求地址        处理中间件
 *  post      /login       匹配用户名和密码
 * 
 * 
 * 
 * */


