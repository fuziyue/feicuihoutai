// 加密的模块
var crypto=require("crypto");// node的加密的模块
// 使用 
// 生成加密的算法  crypto.createHash("md5")
// 加密                  .update(要加密的内容).digest（"base64"）

var  password="123456"; // 明文
console.log(password)

console.log("加密")
var str=crypto.createHash("md5").update(password).digest("base64");//加密的
console.log(str)
