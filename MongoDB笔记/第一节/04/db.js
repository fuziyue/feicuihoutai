// db.js
// 通过mongodb模块 操作  mongodb数据库
// 步骤
// 1. 加载mongodb模块
// 2. 创建一个mongodb的客户端
// 3. 创建 本地mongodb数据的地址 url
// 4. 客户端和  本地的地址  链接  ==》  链接好的 客户端   

// 5. 链接好的 客户端   ==》链接操作的数据库 
// 6. 链接好的数据库  ==》 链接操作的集合
// 7. 链接好的集合  ==>  在上面操作数据 （增删改查 操作）

// 8. 关闭客户端 
var mongodb =require("mongodb");
var MongoClient=mongodb.MongoClient;// mongodb的客户端   client 客户端
// 本地mongodb的地址    // 右键  ==> 标记  ==》 右键  
//        mongodb:// 机器的ip : 端口号
var url="mongodb://127.0.0.1:27017";
// connect 链接
// 第一参数   链接的地址
// 第二参数  链接后的回调  ==》 err 链接失败的原因
//                          client 链接好的客户端
MongoClient.connect(url,function(err,client){
	// 失败检测
	if(err){
		console.log("链接失败");console.log(err);
	}else{
		console.log("链接成功"); console.log(client);
		// 通过链接好的客户端  去 执行 5 6 7 8   
		// 链接好的客户端  链接数据
		//    client.db(链接的数据库)
		var db =client.db("person");
		// 链接好的数据库  链接 集合
		// db.collection(链接的集合)
		var collection= db.collection("user");
		// 在链接好得集合上面 操作  数据
		//         在cmd 中            在node中
		// 查询           find          find
		// 插入         insert         insert
		// 删除         remove         deleteOne 删除一条                         
		// 修改         updata         updateOne 修改一条
		
		// 查找  find 
		// 第一参数   查找的条件
		//           转换为数组      查找后的回调  ==> err 失败的原因
		//                                       result 查找的结果
		collection.find({}).toArray(function(err,result){
			if(err){
				console.log("查询失败");console.log(err)
			}else{
				console.log("查询成功");console.log(result)
			}
			// 关闭客户端
			client.close();
		})
	}
})
// 运行  node 文件名称 
// 运行之前  一定 启动 mongodb的服务 net start mongodb



