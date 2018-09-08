var express=require('express');

var router=express.Router();

router.get("/index",function(req,res){
	res.send("这个是get方式的请求")
})

router.post("/login",function(req,res){
	res.send("这个是post方式的请求")
})

module.exports=router;



