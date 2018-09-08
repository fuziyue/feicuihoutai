// index.js 
// 使用封装好的 操作mongodb的模块
// 1. 加载
// 2. 传参
var db=require("./db3.js") // db3.js 为封装好的文件
// type ==》 执行操作的类型   insert update  delete find
// collections ==》 操作的集合
// data ==> 操作的数据
// callback ==> 操作的回调   操作的结果

//db("insert","aaaa",{name:"封装",age:18},function(result){
//	console.log(result)
//// 判断下  result.result.n
//})

// 修改 操作的数据   [{条件},{内容}]  ==》[{name:"封装"},{$set:{age:19}}]
//db("update","aaaa",[{name:"封装"},{$set:{age:19}}],function(result){
//	// 修改 检查 result.result.n
//	if(result.result.n==0){
//		console.log("没有修改")
//	}else{
//		console.log("修改数据完成")
//	}	
//})


// 查找
// 操作的数据   {}| null 代表查询所有     
//             具体的值
//             带有符号的值
db("find","aaaa",{},function(result){
	// 判断  length
	if(result.length>0){
		console.log("有数据"); console.log(result);
		// 看 脚标为0的 那一项的 name字段 上的值  是什么
		// result ==》 数组  [{数据1},{数据2},.....   ]
		// result[0] ==》 对象  {name:"",age:""}
		console.log(result[0].name)
	}else{
		console.log("没有查询到数据")
	}
})

