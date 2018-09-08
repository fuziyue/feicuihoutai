// index.js
// 使用自己封装的fs模块
// 加载myfs模块
var myfs=require("./myfs");

//myfs.myUnlink("test.txt",function(){
//	console.log("在myUnlink中的回调")
//	console.log("删除成功")
//})


myfs.myReadFile("index.js",function(data){ // 形参 
	
	console.log("读取成功")
	console.log(data)
	
})


