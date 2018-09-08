var obj = require("./a.js");

//先写入文件；
obj.myWriteFile("../p.txt",obj.t,"utf-8",function(err){
	if(err){
		console.log("写入失败");
        console.log(err)
    }else{
		console.log("写入成功");
    }
	
	//读取文件;
	obj.myReadFile("../p.txt","utf-8",function(err,data){
		if (err) {
			console.log("读取失败");
			console.log(err);
		} else{
			console.log("读取成功");
		}
	});
});

//删除文件;
obj.myUnlink("../index.html",function(err){
	if (err) {
		console.log("删除失败");
		console.log(err);
	} else{
		console.log("删除成功");
	}
});