// routes/index.js   路由文件
var express = require('express');
var handler=require("./db.js") // 操作数据库
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
		console.log(req.query) // {username:"tianleone"}
		res.send("获取数据成功，在cmd中查看")
//handler("insert","asdfasdfa",{username：req.query.username},function(res){}) // 
});

router.post("/post",function(req,res){
		console.log(req.body)  // {password:"asdfasdfadsfasdf"}
		res.send("post方式的数据，请在cmd中查看")
})


// 暴露路由对象
module.exports = router;
