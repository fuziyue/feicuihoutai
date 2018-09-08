// myfs.js  自己封装的fs模块

   var fs=require("fs")
       exports.myUnlink=function(path,callback){
       	// fs中提供的方法
       		fs.unlink(path,function(err){
       			if(err){
       				console.log(err)
       			}else{
       				callback()
       			}
       		})       		
       }
       //fs.readFile
       //  第一个   读取的文件的路径
       // 第二个   读取的 编码格式
       // 第三个   回调  ==》 err 失败的原因
       // 				data 读取到的数据
       // callback ==》  读取成功后的回调   ==》回调的参数  为读取到的数据
  	exports.myReadFile=function(path,callback){
  		// 运行fs中读取文件的方法
  		fs.readFile(path,"utf-8",function(err,data){
  			if(err){
				console.log("读取"+paht+"失败");
				console.log(err);
  			}else{
  				callback(data) // data ==> 实参  读取的数据
  			}
  		}) 		
  	}
  	

  	
  	
  	
  	
	exports.myWriteFile=function(){
		
		
		
	}


