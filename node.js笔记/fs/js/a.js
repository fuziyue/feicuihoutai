let fs = require("fs");

let texts = "我超型";

exports.t = texts;

//删除；
exports.myUnlink=function(path,callback){
   fs.unlink(path,function(err){
     if(err){
		callback(err);
     }else{
        callback();
     }
   })        
};

//读取;
exports.myReadFile=function(path,type,callback){
	fs.readFile(path,type,function(err,data){
     if(err){
		callback(err);
     }else{
        callback();
     }
   })
};

//写入;
exports.myWriteFile=function(path,text,type,callback){
	fs.writeFile(path,text,type,function(err){
      if(err){
		callback(err);
      }else{
        callback();
      }
   })
};
