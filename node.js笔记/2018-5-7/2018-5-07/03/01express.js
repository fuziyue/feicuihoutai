// 01express.js
// express框架 ： 快速的代建后台 
// express 怎么用？？
// 1.下载   npm install express
// 2. 使用
//    1） 在文件中加载 express
//    2）使用express的入口函数    ==》 jquery  $
//    3) 设置监听的端口号
//    4） 编写处理的中间件
var express= require("express");// 加载
// npm|cnpm下载的  node_modules 文件夹中    加载 的时候  会在该文件夹中找

var app=express();// 使用express的入口函数  ：入口是一个函数  返回一个对象(express所有的功能)


// 编写处理的中间件   ： 中间件使用一个函数 能访问请求对象req 响应对象 res 
// function(req,res){ }  ==>  中间件
// use==》 使用
app.use(function(req,res){
//	res.end("hello world") // 发送字符串类型
	res.send({name:"小小"}) // 发送任意类型 （自动设置 响应头）
//	res.end({name:"小小"}) // 报错
// 注意： 发送响应  只能发送一回
})
// 启动下   node 文件名称（01express）
// 浏览器访问   localhost:3000  ||  127.0.0.1:3000
app.listen(3000,function(){
	console.log("服务器已启动");
	console.log("访问：   localhost:3000")
	
});// 监听端口号 3000


