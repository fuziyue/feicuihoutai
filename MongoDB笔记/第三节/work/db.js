
// 前三步
var mongodb=require("mongodb");
var MongoClient=mongodb.MongoClient;// mongodb的客户端
// 本地mongodb数据库的地址  cmd中链接时 出现的
var url="mongodb://127.0.0.1:27017";
// 一个网站  一般是一个数据库  
var DBNAME="workdata";// 数据库的名称

// 插入数据
// collection 操作集合
// data   操作的数据
// callback 操作后的回调
// client  客户端
var insert =function(collection,data,callback,client) {  // 形参 
	collection.insert(data,function(err,result){
			if(err){
				console.log("插入数据失败"); console.log(err);
			}else{
				callback(result)
			}
		client.close()// 关闭客户端
	})
}
// 修改数据
// collection 操作集合
// data   操作的数据     [{条件},{内容}]   ==》 注意 
// callback 操作后的回调
// client  客户端
var update =function(collection,data,callback,client) { 
	// 第一个  修改的条件
	// 第二个 修改的内容  
	// 第三个   回调
	collection.updateOne(data[0],data[1],function(err,result){
		if(err){
			console.log("修改失败");console.log(err);
		}else{
			callback(result)
		}
		client.close();// 关闭客户端
	})
}
// 查找  查找完  转换为  数组
// collection 操作集合
// data   操作的数据      
// callback 操作后的回调
// client  客户端
var find =function(collection,data,callback,client) { 
	collection.find(data).toArray(function(err,result){
		if(err){
			console.log("查找失败");console.log(err);
		}else{
			callback(result);
		}
		client.close()// 关闭客户端
	})
}
// delete 是 JavaScript中关键词
// 在变量声明的时候 不能使用 JavaScript关键词
var deletes  =function(collection,data,callback,client) { 
	// 补充上 
	 collection.deleteOne(data,function(err,result){
	 	if(err){
	 		console.log("删除失败");console.log(err);
	 	}else{
	 		callback(result)
	 	}
	 	client.close();
	 })
}
// 保存 操作方式的 对象
var  methodType={
	insert:insert,
	update:update,
	find:find,
	delete:deletes
}

// 后五步
// type ==》 执行操作的类型   insert update  delete find
// collections ==》 操作的集合
// data ==> 操作的数据
// callback ==> 操作的回调
module.exports=function(type,collections,data,callback){
	MongoClient.connect(url,function(err,client){
		if(err){
			console.log("链接失败"); console.log(err);
		}else{
			console.log("链接成功"); //  5 6 7 8 
			var db=client.db(DBNAME);// 链接数据库
			var collection=db.collection(collections); //  链接集合
			// 判断的目的  区分 是什么操作
			// 一种更好的方式  去区分他   有 
			// 找到了  对应的操作的方式 
			// 具体的操作的函数中   传入 什么
			
			// collection 操作集合
			// data   操作的数据
			// callback 操作后的回调
			// client  客户端
			methodType[type](collection,data,callback,client) 
			
//			if(type=="insert"){
////			collection.insert()
//			}else if(type=="find"){
////			collection.find()
//			}else if(type=="update"){
////			collection.updateOne()
//			}else if(type=="delete"){
////			collection.deleteOne()
//			}
		}
	})
}

