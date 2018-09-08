// 加载的东西放在一起 
var express =require('express');
var router=require("./router/router.js")

// 统一去使用
var app =express();
app.use(router);

app.use(express.static("public"))


app.listen(3000,function(){
	console.log('服务器已启动')	
})




