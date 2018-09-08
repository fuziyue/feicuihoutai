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

// 处理管理员删除后的  tokenId的递归函数
// req  请求对象
// res 响应对象
// data  处理的数据   [{}  {}  {} ]
function reUpdate(req,res,data){
	if(data.length==0){// 处理完成
		res.send({success:"删除成功"})
	}else{ // 处理  ==》 修改数据库
		var selector =[
			{userName:data[0].userName}, // 修改的条件
			{
				$inc:{ 
					tokenId: -1 // 修改的内容
				}
			}
		];
		// 具体去修改
		handler("update","administors",selector,function(result){
			if(result.result.n==0){
				res.send({err:"删除失败"})
			}else{
			     data.shift();// 删除第一项
			     reUpdate(req,res,data); // 再次执行函数
			}
		})
	}
}






/*---------------------------------万恶的分割线-------------------------------*/ 

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
	} else if(req.query.action=="login"){ // 登录的请求
		// 获取数据  （用户名  和  密码 【加密】）
		// 在数据库中查找 
		// 有  登录成功    没有  用户名或密码不正确 
		// 用户名
		var userName =req.body.userName;
		// 密码加密处理
		var password =crypto.createHash("md5").update(req.body.password).digest("base64");
		handler("find","administors",{userName:userName,password:password},
		function(result){
			if(result.length>0){
				res.send({success:"登录成功"})
			}else{
				res.send({err:"用户名或密码不正确"})
			}
		})
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
					if(userInfos.phone != false && userInfos.userName != false && userInfos.email != false) {
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

	} else if(req.query.action == "update") { // 修改管理员请求
		// 1. 修改的条件  和 内容
		// 条件  tokenId
		// 内容  
		// 2. 修改 update
		// 3. 发送响应
		
		// 从浏览器中 拿到的数据  都是  string类型 
		// 数据库中  tokenId   是  number 类型 
		console.log(typeof req.body.tokenId) // string
		var selector = [{
				tokenId: parseInt(req.body.tokenId) // 变成number类型
			},
			{
				$set: {
						turename:req.body.turename,
						phone:req.body.phone,
						powerCode:req.body.powerCode,// 权限编码
						power:req.body.powerCode==1?"系统管理员":"课程管理员",
						isdelete:  !/^fcgl/.test(req.body.turename), // 能否删除  fcgl 不删除的
						upDateAt:new Date()// 修改日期
				}
			}
		]
		// 修改    
		handler("update","administors",selector,function(result){
			// 判断具体修改了没有
			if(result.result.n==0){
				res.send({err:"修改失败，请重新操作"})
			}else{
				res.send({success:"修改成功"})
			}
		})
	}else if(req.query.action=="usershow"){
		//  1. 查询所有数据  ==》 返回数据里面有 一共有多少条数
			//  2. 设置查询的条件
			//  3. 查询数据库
			//  4. 返回数据
			//获取学员列表的数据总数
			handler("find", "studentList", null, function(arr) {

				// 设置查询条件
				var selector = {};
				// 用户名||邮箱||手机号   不为 ""    || 或     &&  且
				if(req.body.userName != "" || req.body.email != "" || req.body.phone != "") {
					// 设置 模糊查询的条件
					//              	"" ==> false
					if(req.body.userName) {
						selector.userName = {
							$regex: '.*' + req.body.userName + '.*'
						};
						//   类似
						//  {userName:{$regex: '.*' + req.body.userName + '.*'}
					}
					if(req.body.email) {
						selector.email = {
							$regex: '.*' + req.body.email + '.*'
						};
					}

					if(req.body.phone) {
						selector.phone = {
							$regex: '.*' + req.body.phone + '.*'
						};
					}
					
//					selector={
//						phone:{
//							$regex: '.*' + req.body.phone + '.*'
//						},
//						userName:{
//							$regex: '.*' + "" + '.*'
//						}
//					}
					
					
				} else {
					// 设置  按页数查询的条件
					selector = {
						tokenId: { $gt:3*(parseInt(req.body.pageStart))-3,$lte:3*(parseInt(req.body.pageStart)) }
					};
				}

				//查询数据库获取结果集
				handler("find", "studentList", selector, function(data) {
					if(data.length == 0) {
						res.send({
							"err": "没有查询到数据"
						});
					} else {
						res.send({
							success: "成功",
							data: {
								pageSize: 3,
								count: arr.length,
								list: data
							}
						});
					}
				});
			});
	}
})

router.get("/AdminHandler", function(req, res) {
	if(req.query.action == "show") { //  请求管理员列表的请求
		// 请求 数据 ==》 管理员的数据
		//处理请求
		//    查询时 条件为两个 
		//    1) 模糊 姓名查询   (主)
		//    2) 页数查询
		//     返回数据
		//     1) 一共有多少条  ===>  查询所有的数据   计算一共有多少条
		//      2)查询到的数据     ==> 设置 查询的条件  ==> 查询数据
		//     3)每一页的条数   第几页     (3  请求上有)

		//  1. 查询所有的数据   计算一共有多少条 为返回数据中一共有多少条 做准备
		//  2. 设置查询的条件  ===> 查询数据      为返回数据中 查询得数据做准备 
		handler("find", "administors", {}, function(data) { // data 所有的数据  data.length
			// 迷糊姓名   mongodb 正则的 符号   $regex  /.*+xxx+.*/i    $options
			// /^1 \d{10} /   A a   a
			//			var  seletor={
			//				turename:{
			//					$regex: ".*"+req.query.searchText+".*",
			//					$options:"i" // 不区分大小写
			//				}
			//			}

			// 页码查询  
			//			1. 发送 页码   第一页 1     第二页  2    第三页  3
			//            怎么按照页码  去查询  该页的数据呢？？？
			//            每一页 有3条数据     每一条数据  tokenId  1 2 3 4 5 6 7 8 9 10

			//          2. 页码和条数还有tokenId的关系
			//              页码           条数        tobenId的值   （不重不漏）
			//               1        3          1，2,3，   1*3==3     1*3-3=0   3 >=  [] >0
			//  			页码*每一页的条数>=     >页码*每一页的条数-每一页的条数
			//                              $lte   $gt
			//               {$lte:req.query.pageStart*3,$gt:req.query.pageStart*3-3}

			//               2        3          4 5 6    2*3=6       2*3-3=3   6 >= [] > 3
			//               3        3           7 8 9   3*3=9       3*3-3=6   9 >= [] > 6 
			//			var seletor={
			//				tokenId:{$lte:req.query.pageStart*3,$gt:req.query.pageStart*3-3}
			//			}

			if(req.query.searchText) { // 查询的姓名存在
				// 一姓名为条件的
				var seletor = {
					turename: {
						$regex: ".*" + req.query.searchText + ".*",
						$options: "i" // 不区分大小写
					}
				}
			} else { // 查询的姓名不存在
				// 以页数为条件
				var seletor = {
					tokenId: {
						$lte: req.query.pageStart * 3,
						$gt: req.query.pageStart * 3 - 3
					}
				}
			}

			// 按照设置好的条件 查询数据库
			handler("find", "administors", seletor, function(result) {
				// 判断有没有查询到数据
				if(result.length == 0) { // 没有数据
					res.send({
						err: "没有查询到数据，请重新操作！！"
					})
				} else {
					res.send({
						success: "成功",
						data: {
							pageStart: req.query.pageStart, // 请求的页数
							pageSize: 3, // 每一页 预设为3条
							count: data.length, // 一共有多少条
							list: result // 查询到的数据
						}
					})
				}
			})
		})

	} else if(req.query.action == "delete") { // 删除管理员的请求
		// 1. 直接删除 浏览器传过来的  tokenId对应的数据
		// 2. 找到 大于 删除的tokenId的数据
		// 3. 处理这些数据  让他们的tokenId 都 -1 
		// 4. 发送响应
			handler("delete","administors",
			{tokenId:parseInt(req.query.tokenId)},
			function(result){
				if(result.result.n==0){
					res.send({err:"删除失败，请重新操作！！"})
				}else{
					// 删除成功
					handler("find","administors",
					{tokenId:{$gt:parseInt(req.query.tokenId)}},
					function(data){
						// data ==》 比删除的 tokenId大的数据    [{tokenId-1},{},{},{}]
						// 通过  递归函数  处理   发送响应
						//    req res  请求对象 和响应对响应
						//     data 处理的数据
						// 使用递归
						reUpdate(req,res,data)
						// function fn(){ 
//							if(条件){ 
//								结束
//							}else{ 
//								fn() 
//							}  
//						}
//						
						
					})
				}
			})
	
	}else if(req.query.action=="lockuser"){ // 冻结解冻的
		
		//		   1) 要知道当前的状态   ==》查询==》条件 req.qurey.tokenId
		//         2）去改变  ==》修改
		//				[{条件}，{$set:{isstate:!doc[0].isstate}}]
		//                false==> !false ==> true
			// 查询当前的状态
			handler('find', "studentList", {
				tokenId: parseInt(req.query.tokenId)
			}, function(doc) { // doc 数组  [{tokenId  userName  isstate}]

				if(doc.length == 0) {
					res.send({
						err: '失败，请从新操作'
					})
				} else {
					var selector = [{
							tokenId: parseInt(req.query.tokenId)
						},
						{
							$set: {
								isstate: !doc[0].isstate
								// false  ==>  !false ==> true 
								// ture  ==> !ture ==>false
								// doc[0].isstate=="正常"？"冻结":"正常"
							}
						}
					];
					//修改
					handler('update', 'studentList', selector, function(result) {
						if(result.result.n == 1) {
							res.send({
								success: "操作成功"
							})
						} else {
							res.send({
								err: "操作失败"
							})
						}
					})
					

				}

			})
	}
})
// 写的请求   多了   ==》由于请求的地址 和 方式  一样的   在回调的判断里面  写 else if(req ==="")

// 暴露路由对象
module.exports = router;