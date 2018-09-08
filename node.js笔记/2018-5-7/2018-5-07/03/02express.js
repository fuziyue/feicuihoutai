// 02express.js

// 使用express

// 1. 加载express
// 2. 使用express的入口函数
// 3. 设置端口号
// 4. 编写处理请求的中间件 

var express =require('express');
var app= express();

app.listen(3000,function(){
	console.log("服务器已启动")
	console.log("localhost:3000")
})
// 使用中间件
//  第一参数  （非必填）  路径  ： 作用 限制中间件的使用 
//  第二参数    必填       中间件
app.use("/getData",function(req,res){
	res.send({name:"小明",age:"18"})
})
app.use("/setData",function(req,res){
//	res.send("你好，世界！！！！")
//  redirect重定向          ==》定向到   /getData
	res.redirect("/getData")
})
//  启动 node 02express.js 
// 浏览器访问 ：    localhost:3000
						//       /getData    /setData
// localhost:3000/getData   ==> 发送json数据的中间件
// localhost:3000/setData   ===》发送     "你好，世界！！！！"  的中间件



