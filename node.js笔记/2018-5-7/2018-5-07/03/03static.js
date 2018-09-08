// 03static.js
var express =require('express');
// 静态资源托管中间件的使用	
var app=express()
app.listen(3000,function(){
	console.log("服务器已启动")
})
//  -03 
//      -public
//          a.png
//          .js
//          .html
//          .css 
//      03static.js     			
// express.static()
// 静态资源托管中间件 ： 发送静态资源的中间件  （.html .css .js  图片  视频  ....）
	
// 使用静态资源托管中间件   发送 静态资源
// 第一参数  ： 静态资源所在的文件夹      托管静态资源的文件夹  public
//   如果不再同一个目录下面   通过 ./  ../ 找 托管静态资源的文件夹的位置
app.use(express.static("public"))
// 启动   node 03static.js
// 访问  localhost:3000
//                localhost:3000/a.png ==> 通过静态资源托管中间件 发送 文件        
