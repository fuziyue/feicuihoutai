// 05index.js  项目的主文件
// 使用express的入口函数
// 设置端口号
// 使用 静态资源托管中间件
var express=require("express");
var app=express();
app.listen(3000,function(){
	console.log("服务器已启动")
})
// 设置静态资源托管中间件
app.use(express.static("public"))


// 加载路由文件
var router=require("./06router.js");
// 使用路由文件
app.use(router);

// 启动服务器 node 05index
// 访问   localhost:3000/login    ==>登录成功






