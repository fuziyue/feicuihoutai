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

var mongodb=require("mongodb");
var MongoClient=mongodb.MongoClient;// mongodb的客户端
// 本地mongodb数据库的地址  cmd中链接时 出现的
var url="mongodb://127.0.0.1:27017";
// 手动的链接本地的客户端
// 第一参数   链接的地址
// 第一参数   链接后的回调    err ==》 链接失败的原因
//                       client ==》 链接好的客户端
MongoClient.connect(url,function(err,client){
	// 失败检测
	if(err){
		console.log("链接失败"); console.log(err);
	}else{
		console.log("链接成功");
		// client 链接好的客户端  ==》 5 6 7 8 
		// 5 链接操作的数据库
        //client.db(操作的数据库)   返回 操作的数据库的链接
        // use 数据库  ==>  创建或使用
		var db=client.db("user");
		
		// 6. 链接操作的集合
		// db.collection(操作的集合) 返回 操作集合的链接
		// 如果没有 会创建    如果有直接使用
		var collection=db.collection("person");
		//  client.db("user").collection("person").insert();
		
		// 7. 在集合的链接上  操作数据（增删改查）
		//        cmd           node中      
		// 插入  insert          insert   
		// 查询   find            find     转换为 数组
		// 删除   remove          deleteOne 删除一条  
		// 修改   update          updateOne  修改一条   注意参数  3个
		
		// db.xxx.insert({name:"xiaoxiao"})
		// 插入数据
		// 第一参数     插入的数据
		// 第二参数     操作后的回调 err ==> 操作失败的原因
		//                      result==》 操作后的结果  
//		collection.insert({name:"小明",age:18},function(err,result){
//			if(err){
//				console.log("操作失败"); console.log(err);
//			}else{
//				console.log("操作成功"); console.log(result);
//				// result  ==》 对象  {result：{ok：1,n:0}}
//             // 判断下  n 为几    1条      0条==>  插入不成功
//			}
//			client.close();// 关闭客户端
//		})	


		// 查询  find(查询的数据).toArray(回调)  
		//		  回调的参数  err ==》 失败的原因  result 操作的结果
		// 查询数据   {} | null 代表所有
//		collection.find({age:{$gt:16}}).toArray(function(err,result){
//			if(err){
//				console.log("操作失败");console.log(err);
//			}else{
//				console.log("操作成功"); console.log(result);
//				// result ==>  操作的结果  [{具体的数据},{具体的数据}]   ||   []
//				// 判断有没有数据   ==》 发送 响应
//				// [].length  ==0
//				// [{} ,{} ].length  > 0
//				if(result.length>0){
//					console.log("有数据")
//				}else{
//					console.log("没有数据")
//				}	
//			}
//			client.close();// 关闭客户端
//		})

		// 修改   db.xxx.update({条件},{内容},true,true)
		// node  updateOne()
		// 第一个  条件 {}
		// 第二个  内容 {}   注意 使用  $set 修改器
		// 第三个   回调  ==》 err 失败的原因
		//                 result 操作的结果
//		collection.updateOne({name:"小x"},{$set:{age:19}},function(err,result){
//			if(err){
//				console.log("操作失败"); console.log(err);
//			}else{
//				console.log("操作成功"); console.log(result);
//				// result ==》 对象  {result:{n:1,ok:1}}
//				//                 {result:{n:0,ok:1}}
//				//                         n : 操作了几条数据       0 没有操作数据
//				//                         ok: 指的是操作
//				// 修改之后  判断 具体修改了  几条数据
//				 //   小明   ==》 19  ==》     {result:{n:1,ok:1}}   修改了
//				 //   小 x  ==》 19  ==》    {result:{n:0,ok:1}}   没有修改
//				if(result.result.n==0){
//					console.log("没有修改")
//				}else{
//					console.log("真正修改了")
//				}
//			}
//			client.close()// 关闭客户端
//		})

	// 删除  deleteOne 删除一条
	// 第一参数 删除的条件  { }
	// 第二参数 删除后的回调   err ==》 失败原因
	//                      result ==》 操作后的结果  
		collection.deleteOne({name:"小明"},function(err,result){
			if(err){
				console.log("操作失败"); console.log(err)
			}else{
				console.log("操作成功"); console.log(result);
				// result ==》 对象  {result:{n:1,ok:1}}   // 删除了1条
				//             对象 {result:{n:0,ok:1}}  // 删除了0条
				// 判断删除了几条
				if(result.result.n==0){
					console.log("没有删除数据")// 删除数据失败，请检查数据是否正确
				}else{
					console.log("删除了数据") // 删除数据成功 
				}
			}
			client.close()// 关闭客户端 
		})

	}
})


// 操作之后 判断
// 查找    判断 result.length
// 插入   修改  删除    判断  result.result.n==0 