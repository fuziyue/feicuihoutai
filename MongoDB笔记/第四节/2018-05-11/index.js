// routes/index.js   路由文件
var express = require('express');
var handler = require("./db.js") // 操作数据库
var router = express.Router();
//  123456  ==> aksdj;fklja's;dlfk';l2k;elf   ==>加密
// 加密的模块
var crypto = require("crypto"); // node的加密的模块
// 使用 
// 生成加密的算法  crypto.createHash("md5")
// 加密                  .update(要加密的内容).digest（"base64"）

/* GET home page. */
//router.get('/', function(req, res, next) {
//		console.log(req.query) // {username:"tianleone"}
//		res.send("获取数据成功，在cmd中查看")
////handler("insert","asdfasdfa",{username：req.query.username},function(res){}) // 
//});
//
//router.post("/post",function(req,res){
//		console.log(req.body)  // {password:"asdfasdfadsfasdf"}
//		res.send("post方式的数据，请在cmd中查看")
//})

// 权限请求   get
router.get("/CourseHandler", function(req, res) {
	//  确定 地址上action的数据
	if(req.query.action == "getpower") {
		// 请求确定了
		// 在数据库中 调取数据   发送给浏览器
		handler("find", "powers", {}, function(result) {
			if(result.length > 0) { // 存在
				res.send({
					success: "成功",
					data: result // 返回的数据
				})
			} else { // 不存在
				res.send({
					err: "系统中暂时没有权限数据，请联系管理员！！"
				})
			}
		})
	} else {
		res.send("请求不正确 ")
	}
})

router.post("/AdminLoginAndRegHandler", function(req, res) {
	// 确定地址上 action上的数据
	if(req.query.action == "add") { // 添加管理员的请求 

		// 编写处理的逻辑    
		// 1. 获取添加的数据   req.body.userName   .xx
		// 2. 把添加的数据  插入到  数据库中
		// 验证
		// 1. 重名验证  
		//   管理员1   ==》小明     \/   
		//   管理员2   ==》 小明    不可以 
		// 在添加时   ==》 先查找  用户名  小明   看看存不存在  
		//                  ==》 不存在   ==》可以添加    ==》 添加  ==》 添加结果
		//                  ==》 存在    ===》 不可以添加  ==》 结果（该用户名已经存在，请重新填写）

		// 查询要添加的 用户名
		handler("find", "administors", {
			userName: req.body.userName
		}, function(docs) {
			// docs 形参   查询的结果  [] length 
			if(docs.length > 0) { // 有数据  ==》 存在     结果（该用户名已经存在，请重新填写）
				res.send({
					err: "该用户名已经存在，请重新填写！！"
				})
			} else { // 没有数据   ==》 不存在  ===》 添加
				// 昨天写的   ==》 正常添加
				handler("find", "administors", {}, function(data) {
					var userInfo = {
						// key:value 
						// 在数据库中保存的字段       // 浏览器发送的数据
						// 查询以前有多个  data.length
						// 当前的                 data.length+1
						tokenId: data.length + 1, // 从1开始
						createAt: new Date(),
						isdelete: !/^fcgl/.test(req.body.turename),
						password: crypto.createHash("md5").
						update(req.body.password).
						digest("base64"), // 加密密码  
						power: req.body.powerCode == 1 ? "系统管理员" : "课程管理员",
						powerCode: req.body.powerCode, // 权限编码
						success: "成功",
						// 验证具体的信息      不要出现两个相同的key 
						//
						upDateAt: new Date(),
						phone: /^1\d{10}/.test(req.body.phone) ? req.body.phone : false,
						turename: req.body.turename == "" ? false : req.body.turename,
						userName: req.body.userName == "" ? false : req.body.userName
					}
					// 添加之前判断  具体的值
					if(userInfo.phone != false && userInfo.turename != false && userInfo.userName != false) {
						// 添加
						//插入数据
						handler("insert", "administors", userInfo, function(result) {
							// result.result.n 
							if(result.result.n == 0) {
								// 没有插入
								res.send({
									err: "添加失败，请重新操作！！"
								})
							} else {
								// 插入了
								res.send({
									success: "添加成功"
								})
							}
						})
					} else {
						// 格式不对  ==》 数据格式不正确，请重新填写
						res.send({
							err: "数据格式不正确，请重新填写！！！"
						})
					}
				})

			}
		})
	} else {
		res.send("请求地址不正确")
	}
})

// 添加用户
router.post("/AdminHandler", function(req, res) {
	if(req.query.action == "adduser") { // 添加学员的请求
		// 1. 添加学员数据
		//    1）重名的验证
		//    2） 具体信息的验证
		//    3） 插入到数据库中
		// 2. 发送 添加后结果
		//    1） 失败的
		//    2）成功的
		
		// 重名的验证
		handler("find", "studentList", {  
			userName: req.body.userName
		}, function(docs) {
			if(docs.length > 0) {
				res.send({
					err: "该用户名已存在请重新填写用户名！！"
				})
			} else {
				//获取学员列表的数据总数
				handler("find", "studentList", null, function(data) {
					//组织学员信息并作一些校验
					var userInfos = {};
					userInfos.tokenId = data.length + 1;
			
					userInfos.createAt = new Date();
					userInfos.upDateAt = new Date();

					userInfos.email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(req.body.email) ? req.body.email : false;
					userInfos.isstate = false; //是否冻结    false 正常
					// parseInt 变成数字
					userInfos.phone = /^1\d{10}$/.test(parseInt(req.body.phone)) ? req.body.phone : false;
					userInfos.isLogin = false; // 是否登录   false 没登录

					userInfos.userName = req.body.userName == "" ? false : req.body.userName;
					userInfos.password = crypto.createHash('md5').update("123456").digest('base64');
					// 判断验证的具体信息
					if(userInfos.phone != false && userInfos.userName != false  && userInfos.email != false) {
						//增加操作
						handler("insert", "studentList", userInfos, function(result) {
							if(result.result.n == 0) {
								res.send({
									"err": "抱歉，添加失败"
								});
							} else {
								res.send({
									"success": "添加成功"
								});
							}
						});
					} else {
						res.send({
							"err": "抱歉，数据格式有误，添加失败"
						});
					}

				});
			}
		})

	}

})

// 暴露路由对象
module.exports = router;