/**
 *  翡翠学院后台管理系统功能接口
 *   2018-4-3
 */

var express = require('express');
var router = express.Router();
var handler = require('./db.js');
var formidable = require('formidable');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var ObjectID = require('mongodb').ObjectID;

/*-----------------------------------------封装函数---------------------------------------------*/
function User(user) {
	this.id = user.id;
	this.name = user.name;
	this.password = user.password;
	this.veri = user.veri;
};
//去除 视频数据中关联的信息

/*
 * content  内容
 * value   去除的内容
 * */
function dleVideoContent(content, value) {
	var arr = content.split(",");
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == value) {
			arr.splice(i, 1);
			return arr.join(",")
		}
	}
}
//迭代处理删除后的系统管理员各人员的tokenId
var recUpdate = function(req, res, collections, data) {
	if(data.length === 0) {
		res.send({
			"success": "删除成功"
		});
	} else {
		var selector = [{
				"userName": data[0].userName
			},
			{
				$set: {
					"tokenId": data[0].tokenId - 1
				}
			}
		];
		handler("update", collections, selector, function(result) {
			if(result.result.n == 1) {
				data.shift();
				recUpdate(req, res, collections, data);
			} else {
				res.send({
					"success": "删除失败"
				});
			}
		});
	}
};
// 判断对象是否为空
var isNullObj = function(obj) {
	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			return false;
		}
	}
	return true;
};

var flagInt = 0;
//生成课程代码
var generateCode = function() {
	var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	var str = "";
	for(var i = 0; i < 8; i++) {
		if(i < 4) {
			str += letters.splice(parseInt(Math.random() * (letters.length)), 1);
		} else {
			str += numbers.splice(parseInt(Math.random() * (numbers.length)), 1);
		}
	}
	return str;
}
//迭代处理课程列表删除后的ID
var recUpdateID = function(req, res, collections, data, callback) {
	if(data.length === 0) {
		//判断是否要执行 callback 回调函数
		if(typeof callback == 'function') {
			callback();
		} else {
			res.send('{"success":"删除成功"}');
		}
	} else {
		var selector = [{
				"_id": data[0]._id
			},
			{
				$set: {
					"ID": data[0].ID - 1
				}
			}
		];
		handler("update", collections, selector, function(result) {
			data.shift();
			// 判断删除是否失败
			if(result.result.n == 0) {
				res.send('{"err":"抱歉，删除失败"}');
				// 判断是否还有要处理的数据
			} else if(data.length != 0) {
				recUpdateID(req, res, collections, data, callback);

			} else {
				//判断是否要执行 callback 回调函数
				if(typeof callback == 'function') {
					callback();
				} else {
					res.send('{"success":"删除成功"}');
				}
			}
		});
	}
};
//迭代删除目录绑定的视频
/*
 *  dir_id:目录_id
 *  pro_id:课程_id
 *  Cname:课程名称
 *  videoDeta  需要处理的视频数据集
 *  callback : 回调函数
 * */
var delDirVideo = function(req, res, dir_id, pro_id, Cname, videoDeta, callback) {
	var _idStr = dir_id + pro_id; //  目录_id + 课程_id
	var video = videoDeta[0]; // 该次处理的视频
	if(videoDeta.length === 0) {
		callback();
	} else {
		// 查询该视频在该课程下绑定了多少回
		handler("find", "videoList", {
			ID: video.ID,
			Vmosaic: {
				$regex: '.*' + pro_id + '.*'
			}
		}, function(videoList) {
			if(videoList.length == 0) { // 该视频在该课程下没有 绑定
				res.send({
					err: "删除失败"
				})
				return false;
			} else if(videoList.length == 1) { // 该视频只在该课程下绑定了一回
				selector = [{
					ID: video.ID
				}, {
					$set: {
						Vstate: dleVideoContent(video.Vstate, Cname),
						Vmosaic: dleVideoContent(video.Vmosaic, _idStr)
					}
				}]
			} else { // 该视频在该课程下绑定了多回
				selector = [{
					ID: video.ID
				}, {
					$set: {
						Vmosaic: dleVideoContent(video.Vmosaic, _idStr)
					}
				}]

			}
			//向视频列表对应数据中添加Vstate字段和Vmosaic字段
			handler("update", "videoList", selector, function(result) {
				if(result.result.n == 0) {
					res.send('{"err":"抱歉，删除失败"}');
				} else {
					videoDeta.shift();
					// 递归处理
					delDirVideo(req, res, dir_id, pro_id, Cname, videoDeta, callback)
				}
			});
		})
	}
}

//迭代删除课程绑定的目录
/**
 *  pro_id  课程的_id
 *  Cname   课程的名称
 *  dirData 处理的目录
 *  callbakc  处理后的回调
 *
 */
var delProDir = function(req, res, pro_id, Cname, dirData, callback) {
	if(dirData.length == 0) {
		callback()
	} else {
		//查询视频列表获得要处理的视频数据集
		handler("find", "videoList", {
			Vmosaic: {
				$regex: '.*' + dirData[0]._id + pro_id + '.*'
			}
		}, function(videoDeta) {
			//迭代处理videoDeta的Vstate和Vmosaic
			// var dir_id = dirData[0]._id; // 目录的 _id
			// var pro_id; // 课程的 _id
			// var Cname; // 课程名称
			delDirVideo(req, res, dirData[0]._id, pro_id, Cname, videoDeta, function() {
				// 处理视频数据后的回调
				handler("delete", "directoryList", {
					"ID": dirData[0].ID
				}, function(result) {
					if(result.result.n == 0) {
						res.send('{"err":"删除失败"}');
					} else {
						//查询ID大于当前数据条ID的数据集
						handler("find", "directoryList", {
							ID: {
								$gt: dirData[0].ID
							}
						}, function(dirDataList) {
							//对ID大于当前数据条ID的数据集进行迭代处理，ID均-1
							recUpdateID(req, res, 'directoryList', dirDataList, function() {
								// 处理目录成功后的回调
								dirData.shift();
								// 继续处理目录的数据
								delProDir(req, res, pro_id, Cname, dirData, callback)
							});
						});
					}
				});
			});
		});
	}
}

//客户端获取验证
/*-----------------------------------------具体接口-----------------------------------------------*/
// 验证码接口
//客户端获取验证码字符及校验验证码接口
router.get('/AdminLoginAndRegHandler', function(req, res) {
	var action = req.query.action;
	switch(action) {
		case "verification": // 生成验证码
			var randomNum = function(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			};
			var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
			var returnStr = "";
			for(var i = 0; i < 4; i++) {
				var txt = str[randomNum(0, str.length)];
				returnStr += txt;
			}
			var newUser = new User({
				name: "",
				password: "",
				id: "",
				veri: returnStr
			});
			req.session.user = newUser;
			res.send({
				"success": "true",
				"data": returnStr
			});
			break;
		case "checkVerification": // 校验验证码

			if(req.session.user && req.query.veri == req.session.user.veri) {
				res.send({
					"success": "验证码正确"
				});
			} else {
				res.send({
					"err": "验证码错误"
				});
			}
			break;
		default:
			res.send({
				"err": '请求路径错误'
			});
	}
});
// 管理员接口
router.post('/AdminLoginAndRegHandler', function(req, res) {
	var action = req.query.action;
	switch(action) {
		case "login": // 登录
			var md5 = crypto.createHash('md5');
			var password = md5.update(req.body.password).digest('base64');

			handler("find", "administors", {
				userName: req.body.userName,
				password: password
			}, function(data) {
				if(data.length === 0) {
					res.send({
						"err": "用户名或密码错误，请求重新输入！！！"
					});
				} else if(data.length !== 0 && data[0].password === password) {
					req.session.user.name = req.body.userName;
					req.session.user.password = password;
					req.session.user.id = data[0]._id;
					res.send({
						"success": "登录成功"
					});
				}

			});
			break;

		case "returnuserinfo": // 返回登录管理员信息

			if(req.session.user && req.session.user.id) {
				var sessionId = new ObjectID(req.session.user.id);
				handler("find", "administors", {
					"_id": sessionId
				}, function(data) {
					if(data.length == 0 || data.length > 1) {
						res.send({
							"err": "抱歉，系统故障"
						});
					} else {
						res.send({
							success: "成功",
							data: data[0]
						});
					}

				})
			} else {
				res.send({
					err: "获取个人信息失败，请重新登录"
				})
			};
			break;

		case "add": // 添加管理员
			handler("find", "administors", {
				userName: req.body.userName
			}, function(docs) {
				if(docs.length != 0) {
					res.send({
						err: "用户名已存在，请从新输入"
					});
				} else {
					handler("find", "administors", null, function(arr) {
						var md5 = crypto.createHash('md5');
						//组织用户信息并作一些校验
						var userInfos = {};
						userInfos.createAt = new Date();
						userInfos.isdelete = /^fcgl/.test(req.body.turename) ? false : true;
						userInfos.password = md5.update(req.body.password).digest('base64');
						userInfos.phone = /^1\d{10}$/.test(parseInt(req.body.phone)) ? req.body.phone : false;
						userInfos.power = req.body.powerCode == "1" ? "系统管理员" : "课程管理员";
						userInfos.powerCode = req.body.powerCode;
						userInfos.success = "成功";
						userInfos.tokenId = arr.length + 1;
						userInfos.upDateAt = new Date();
						userInfos.userName = req.body.userName == "" ? false : req.body.userName;
						userInfos.turename = req.body.turename == "" ? false : req.body.turename;

						if(userInfos.phone != false && userInfos.userName != false && userInfos.turename != false) {
							handler("insert", "administors", userInfos, function(data) {
								if(data.result.n != 1) {
									res.send({
										"err": "抱歉，添加失败"
									});
								} else {
									res.send({
										"success": "注册成功"
									});
								}
							});
						} else {
							res.send({
								"err": "抱歉，添加失败。参数格式"
							});
						}
					});
				}
			});
			break;
		default:
			res.send({
				"err": '请求路径错误'
			});
	}
});
//管理员列表(show,delete，quit)
router.get('/AdminHandler', function(req, res) {
	var action = req.query.action;
	switch(action) {
		case "lockuser": // 学员的冻结
			//获取与tokenId对应的该条数据
			handler("find", "studentList", {
				tokenId: parseInt(req.query.tokenId)
			}, function(studentList) {
				if(studentList.length == 0) {
					res.send({
						"err": "冻结失败"
					})
				} else {
					var selector = [{
							tokenId: parseInt(req.query.tokenId)
						},
						{
							$set: {
								isstate: studentList[0].isstate ? false : true
							}
						}

					];
					//切换当前字段isstate的状态
					handler("update", "studentList", selector, function(result) {
						if(result.result.n == 1) {
							res.send({
								"success": "操作成功"
							});
						} else {
							res.send({
								"err": "抱歉，操作失败"
							});
						}
					});
				}
			});
			break;
		case "quit": //管理员退出
			if(req.session.user) {
				req.session.user = {};
			}
			res.send({
				"success": "退出成功"
			});
			break;
		case "show": // 管理员显示
			handler("find", "administors", null, function(arr) {
				var selector = !req.query.searchText ? {
					tokenId: {
						$gt: arr.length - (parseInt(req.query.pageStart) * 3 - 3) - 3,
						$lte: arr.length - (parseInt(req.query.pageStart) * 3 - 3)
					}
				} : {
					turename: {
						$regex: '.*' + req.query.searchText + '.*',
						$options: 'i'
					}
				};
				handler("find", "administors", selector, function(data) {
					if(data.length == 0) {
						res.send({
							"err": "抱歉，系统中查不到人员"
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
			break;
		case "delete": // 管理员删除
			//删除操作
			handler("delete", "administors", {
				tokenId: parseInt(req.query.tokenId),
				isdelete: true
			}, function(data) {
				if(data.result.n == 0) {
					res.send({
						"err": "删除失败"
					});
				} else {
					//获取tokenId大于当前tokenId的数据集，并迭代处理管理员列表的tokenId
					handler("find", "administors", {
						tokenId: {
							$gt: parseInt(req.query.tokenId)
						}
					}, function(da) {
						recUpdate(req, res, "administors", da);
					});
				}
			});
			break;

		default:
			res.send({
				"err": '请求路径错误'
			});
	}

});
//管理员列表update returnuserinfo  updatepass update
router.post('/AdminHandler', function(req, res) {
	var action = req.query.action;
	switch(action) {
		case "update": //修改管理员信息
			var selector = [{
					"tokenId": parseInt(req.body.tokenId)
				},
				{
					$set: {
						"turename": req.body.turename,
						"phone": req.body.phone,
						"powerCode": req.body.powerCode,
						"power": req.body.powerCode == "1" ? "系统管理员" : "课程管理员",
						"upDateAt": new Date()
					}
				}

			];
			handler("update", "administors", selector, function(data) {
				if(data.result.n == 0) {
					res.send({
						"err": "抱歉，修改失败"
					});
				} else {
					res.send({
						"success": "修改成功"
					});
				}
			});
			break;
		case "updatepass": // 修改密码

			var oldPw = crypto.createHash('md5').update(req.body.userPwd).digest('base64');
			var newPw = crypto.createHash('md5').update(req.body.newPwd).digest('base64');

			var ssPW = req.session.user.password;

			//判断原密码是否正确
			if(ssPW != oldPw) {
				res.send({
					"err": "密码错误"
				});
			} else {

				var selector = [{
						"userName": req.session.user.name
					},
					{
						$set: {
							"password": newPw,
							"upDateAt": new Date()
						}
					}

				];
				//将同样加密过的新密码更新到数据库
				handler("update", "administors", selector, function(data) {
					if(data.result.n == 0) {
						res.send({
							"err": "密码更新失败"
						});
					} else {
						// 把修改后的新密码  赋值到session上面
						req.session.user.password = newPw;
						res.send({
							"success": "更新成功"
						});
					}
				});
			}
			break;

			/*--------------学员列表 添加  查询----------*/
		case "adduser": // 添加学员
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
						userInfos.isstate = false;
						userInfos.phone = /^1\d{10}$/.test(parseInt(req.body.phone)) ? req.body.phone : false;
						userInfos.isLogin = false;

						userInfos.userName = req.body.userName == "" ? false : req.body.userName;
						userInfos.password = crypto.createHash('md5').update("123456").digest('base64');

						if(userInfos.phone != false && userInfos.userName != false && userInfos.turename != 'false' && userInfos.email != false) {
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

			break;
		case "usershow": // 显示学员列表
			var selector = {};
			if(req.body.userName) {
				selector.userName = {
					$regex: '.*' + req.body.userName + '.*'
				};
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
			//获取学员列表的数据总数
			handler("find", "studentList", null, function(arr) {
				if(isNullObj(selector)) {
					selector = {
						tokenId: {
							$gt: arr.length - (parseInt(req.body.pageStart) * 3 - 3) - 3,
							$lte: arr.length - (parseInt(req.body.pageStart) * 3 - 3)
						}
					};
				}
				//查询数据库获取结果集
				handler("find", "studentList", selector, function(data) {
					if(data.length == 0) {
						res.send({
							"err": "查询失败"
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
			break;
		default:
			res.send({
				"err": '请求路径错误'
			});
	}
});
/////////////////////////////////////////////////////////////////////////////////////////////////////
//获取权限，获取课程列表等
router.get('/CourseHandler', function(req, res) {
	var action = req.query.action;
	switch(action) {
		case "getpower": // 获取管理员权限
			handler("find", "powers", null, function(data) {
				if(data.length == 0) {
					res.send({
						err: "获取权限失败"
					});
				} else {
					res.send({
						success: "获取权限成功",
						data: data
					});
				}
			});
			break;

			/*---------------------------------------------------------------------------*/
			/*关于课程的接口*/
		case "getcategory": // 获取课程专业分类目录
			handler("find", "catalogList", null, function(data) {
				if(data.length == 0) {
					res.send({
						"err": "抱歉，获取课程分类列表失败"
					});
				} else {
					res.send({
						data: data,
						success: "获取课程分类列表成功"
					});
				}
			});

			break;
		case "getcourse": // 获取 具体的课程信息
			//根据ID查询productList获得一条数据
			handler("find", "productList", {
				ID: parseInt(req.query.ID)
			}, function(data) {
				if(data.length == 0) {
					res.send('{"err":"获取ID对应的课程失败"}');
				} else {
					//课程的_id为directoryList的对应数据的CDid,根据CDid查询directoryList获取对应的数据集
					handler("find", "directoryList", {
						CDid: data[0]._id
					}, function(dirList) {

						res.send({
							success: "获取成功",
							data: {
								courselist: data[0],
								dirlist: dirList
							}
						});
					});
				}
			});
			break;

		case "deleteDirectory": // 删除目录
			//查询对应ID的目录数据条
			handler("find", "directoryList", {
				"ID": parseInt(req.query.ID)
			}, function(dirList) {
				//查询该目录对应的课程数据条
				handler("find", "productList", {
					_id: new ObjectID(dirList[0].CDid)
				}, function(proList) {

					//查询视频列表获得要处理的视频数据集
					handler("find", "videoList", {
						Vmosaic: {
							$regex: '.*' + dirList[0]._id + proList[0]._id + '.*'
						}
					}, function(videoDeta) {

						//迭代处理videoDeta的Vstate和Vmosaic
						var dir_id = dirList[0]._id;
						var pro_id = proList[0]._id;
						var Cname = proList[0].Cname;
						delDirVideo(req, res, dirList[0]._id, proList[0]._id, proList[0].Cname, videoDeta, function() {
							//删除操作
							handler("delete", "directoryList", {
								"ID": parseInt(req.query.ID)
							}, function(result) {
								if(result.result.n == 0) {
									res.send('{"err":"删除失败"}');
								} else {
									//查询ID大于当前数据条ID的数据集
									handler("find", "directoryList", {
										ID: {
											$gt: parseInt(req.query.ID)
										}
									}, function(dirData) {
										if(dirData.length == 0) {
											//如果数据集长度为0，则说明删除的是最后一个元素，无需处理后续数据的ID，直接查询该课程下的目录集并返回
											handler("find", "directoryList", {
												CDid: pro_id
											}, function(data) {
												res.send({
													success: "删除成功",
													data: data
												});
											});
										} else {
											//对ID大于当前数据条ID的数据集进行迭代处理，ID均-1
											recUpdateID(req, res, 'directoryList', dirData, function() {
												//查询该课程下的所有目录并返回
												handler("find", "directoryList", {
													CDid: pro_id
												}, function(data) {
													res.send({
														success: "删除成功",
														data: data
													});
												});
											});
										}
									});
								}
							});
						});
					});
				});
			});
			break;

		case "addvideo":

			//查询目录列表列表获取当前目录的_id和课程的_id
			handler("find", "directoryList", {
				ID: parseInt(req.query.Did)
			}, function(dirList) {
				if(dirList.length == 0) {
					res.send({
						"err": "抱歉，视频添加失败"
					});
				} else {
					handler("find", "productList", {
						_id: new ObjectID(dirList[0].CDid)
					}, function(proList) {
						if(proList.length == 0) {
							res.send({
								"err": "抱歉，视频添加失败"
							});
						} else {
							var dir = dirList[0]; // 当前目录
							var pro = proList[0]; // 当前课程
							var _idStr = "" + dir._id + pro._id; // Vmosaic字段上的值
							//查询视频列表获取绑定课程字段Vmosaic，用以拼接
							handler("find", "videoList", {
								ID: parseInt(req.query.ID),
								Vmosaic: {
									$regex: '.*' + _idStr + '.*'
								}
							}, function(videoList) {
								if(videoList.length != 0) {
									res.send({
										"err": "抱歉，该视频已添加"
									});
								} else {
									// 查找该视频
									handler("find", "videoList", {
										ID: parseInt(req.query.ID)
									}, function(videoList) {
										if(videoList.length == 0) {
											res.send({
												"err": "抱歉，添加失败"
											});
										} else {
											var video = videoList[0]; //该视频内容
											var selector = null; // 设置的条件

											if(video.Vstate != "" && video.Vstate.indexOf(pro.Cname)) {
												selector = [{
													ID: parseInt(req.query.ID)
												}, {
													$set: {
														Vmosaic: video.Vmosaic == "" ? _idStr : "," + _idStr
													}
												}]
											} else {
												selector = [{
													ID: parseInt(req.query.ID)
												}, {
													$set: {
														Vstate: video.Vstate == "" ? pro.Cname : "," + pro.Cname,
														Vmosaic: video.Vmosaic == "" ? _idStr : "," + _idStr
													}
												}]
											}
											//向视频列表对应数据中添加Vstate字段和Vmosaic字段
											handler("update", "videoList", selector, function(result) {
												if(result.result.n == 0) {
													res.send('{"err":"抱歉，添加失败"}');
												} else {
													//根据目录_id与课程_id的拼接后字串查询包含此字串的视频数据并将结果集返回
													handler("find", "videoList", {
														Vmosaic: {
															$regex: '.*' + dir._id + pro._id + '.*'
														}
													}, function(data) {
														if(data.length == 0) {
															res.send('{"err":"抱歉，添加失败"}');
														} else {
															res.send({
																data: {
																	count: data.length,
																	list: data
																},
																success: "添加成功"
															});
														}
													});
												}
											});
										}
									})
								}
							});
						}
					});
				}
			});
			break;

		case "delvideo": // 删除目录下视频
			//查询目录列表列表获取当前目录的_id和课程的_id
			handler("find", "directoryList", {
				ID: parseInt(req.query.Did)
			}, function(dirList) {
				if(dirList.length == 0) {
					res.send({
						"err": "抱歉，视频添加失败"
					});
				} else {
					handler("find", "productList", {
						_id: new ObjectID(dirList[0].CDid)
					}, function(proList) {
						if(proList.length == 0) {
							res.send({
								"err": "抱歉，视频添加失败"
							});
						} else {
							var dir = dirList[0]; // 当前目录
							var pro = proList[0]; // 当前课程
							// 查询该视频在该课程下绑定了多少回
							handler("find", "videoList", {
								ID: parseInt(req.query.ID),
								Vmosaic: {
									$regex: '.*' + pro._id + '.*'
								}
							}, function(videoList) {

								var video = videoList[0]; //该视频内容
								var selector = null; // 设置的条件
								var _idStr = "" + dir._id + pro._id; // Vmosaic字段上的值
								if(videoList.length == 0) { // 该视频在该课程下没有 绑定
									res.send({
										err: "删除失败"
									})
									return false;
								} else if(videoList.length == 1) { // 该视频只在该课程下绑定了一回
									selector = [{
										ID: parseInt(req.query.ID)
									}, {
										$set: {
											Vstate: dleVideoContent(video.Vstate, pro.Cname),
											Vmosaic: dleVideoContent(video.Vmosaic, _idStr)
										}
									}]
								} else { // 该视频在该课程下绑定了多回
									selector = [{
										ID: parseInt(req.query.ID)
									}, {
										$set: {
											Vmosaic: dleVideoContent(video.Vmosaic, _idStr)
										}
									}]

								}
								//向视频列表对应数据中添加Vstate字段和Vmosaic字段
								handler("update", "videoList", selector, function(result) {
									if(result.result.n == 0) {
										res.send('{"err":"抱歉，删除失败"}');
									} else {
										//根据目录_id与课程_id的拼接后字串查询包含此字串的视频数据并将结果集返回
										handler("find", "videoList", {
											Vmosaic: {
												$regex: '.*' + dir._id + pro._id + '.*'
											}
										}, function(data) {
											res.send({
												data: {
													count: data.length,
													list: data
												},
												success: "添加成功"
											});
										});
									}
								});
							});
						}
					});
				}
			});
			break;
		default:
			res.send({
				"err": '请求路径错误'
			});

	}
});

router.post('/CourseHandler', function(req, res) {

	var action = req.query.action;
	switch(action) {
		case "show": //  显示课程列表
			var selector = {};
			if(req.body.searchText) {
				selector.Cname = {
					$regex: '.*' + req.body.searchText + '.*'
				};
			}
			if(req.body.CategoryOne) {
				selector.CategoryOne = req.body.CategoryOne;
			}
			if(req.body.CategoryTwo) {
				selector.CategoryTwo = req.body.CategoryTwo;
			}
			if(req.body.CategoryThree) {
				selector.CategoryThree = req.body.CategoryThree;
			}
			handler("find", "productList", null, function(arr) {
				if(isNullObj(selector)) {
					selector = {
						ID: {
							$gt: arr.length - (parseInt(req.body.pageStart) * 3 - 3) - 3,
							$lte: arr.length - (parseInt(req.body.pageStart) * 3 - 3)
						}
					};
				}
				handler("find", "productList", selector, function(data) {
					if(data.length == 0) {
						res.send({
							err: "没有查询到课程"
						})
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
			break;
		case "add": // 添加课程的基本信息
			handler("find", "productList", null, function(arr) {
				//组织课程信息并作一些校验
				var userInfos = {};
				userInfos.Cname = req.body.Cname;
				userInfos.Cdescribe = req.body.Cdescribe;
				userInfos.Cprice = parseInt(req.body.Cprice);
				userInfos.CategoryOne = req.body.CategoryOne;
				userInfos.CategoryTwo = req.body.CategoryTwo;
				userInfos.CategoryThree = req.body.CategoryThree;
				userInfos.Cpic = req.body.Cpic;
				userInfos.createAt = new Date();
				userInfos.ID = arr.length + 1;
				userInfos.upDateAt = new Date();
				userInfos.success = "添加成功";
				userInfos.isDelete = true;
				userInfos.isState = 1;
				userInfos.isTop = false;
				userInfos.onlineUser = 0;
				userInfos.Cdetails = req.body.Cdetails;
				userInfos.Cnumber = generateCode();
				if(userInfos.Cname && userInfos.Cdescribe && userInfos.Cprice >= 0) {

					handler("find", "productList", {
						Cname:userInfos.Cname
					}, function(docs) {
						if(docs.length !=0) {
							res.send({
								err: "课程名称已存在，请重新填写"
							})

						} else {
							handler("insert", "productList", userInfos, function(result) {
								if(result.result.n == 0) {
									res.send('{"err":"抱歉，添加失败"}');
								} else {
									res.send({
										success: "添加成功",
										ID: result.ops[0].ID
									});
								}
							});
						}

					})

				} else {
					res.send('{"err":"抱歉，添加失败"}');
				}
			});

			break;

		case "AddDirectory": // 添加目录

			handler('find', 'productList', {
				ID: parseInt(req.body.Cid)
			}, function(proList) {

				if(proList.length == 0) {
					res.send({
						err: "添加失败"
					})
				} else {
					//获取directoryList的当前条目数
					handler("find", "directoryList", null, function(dirlist) {
						var objDirectory = {
							CDName: req.body.CDName,
							CDid: proList[0]._id,
							CourseNumber: 0,
							ID: dirlist.length + 1
						}
						if(objDirectory.CDName && objDirectory.CDid) {
							//新增操作
							handler("insert", "directoryList", objDirectory, function(result) {
								if(result.result.n == 0) {
									res.send('{"err":"抱歉，目录添加失败"}');
								} else {
									//根据相应课程列表的_id将directoryList列表中与其对应的目录结果集返回
									handler("find", "directoryList", {
										CDid: objDirectory.CDid
									}, function(dirlist) {
										if(dirlist.length == 0) {
											res.send('{"err":"抱歉，目录添加失败"}');
										} else {
											res.send({
												success: "添加成功",
												data: dirlist,
											});
										}
									});
								}
							});
						} else {
							res.send('{"err":"抱歉，目录添加失败,目录信息不能为空"}');
						}
					});
				}
			})
			break;

		case "updateDirectory": // 编辑目录
			var selector = [{
					"ID": parseInt(req.body.ID)
				},
				{
					"$set": {
						CDName: req.body.CDName
					}
				}

			];

			//directoryList的update操作
			handler("update", "directoryList", selector, function(result) {
				if(result.result.n == 0) {
					res.send('{"err":"抱歉，目录更新失败"}');
				} else {
					handler('find', 'productList', {
						ID: parseInt(req.body.Cid)
					}, function(proList) {
						if(proList.length == 0) {
							res.send({
								err: "添加失败"
							})
						} else {
							//根据课程_id将绑定在它下面的目录结果集返回
							handler("find", "directoryList", {
								CDid: proList[0]._id
							}, function(dirlist) {
								if(dirlist.length == 0) {
									res.send('{"err":"抱歉，目录添加失败"}');
								} else {
									res.send({
										success: "添加成功",
										data: dirlist
									});
								}
							});

						}
					})

				}
			});
			break;

		case "update": // 编辑课程信息

			var selector = [{
					"ID": parseInt(req.body.ID)
				},
				{
					"$set": {
						Cname: req.body.Cname,
						Cdescribe: req.body.Cdescribe,
						Cprice: parseInt(req.body.Cprice),
						CategoryOne: req.body.CategoryOne,
						CategoryTwo: req.body.CategoryTwo,
						CategoryThree: req.body.CategoryThree,
						Cpic: req.body.Cpic,
						upDateAt: new Date(),
						Cdetails: req.body.Cdetails
					}
				}
			];
			handler("update", "productList", selector, function(result) {
				if(result.result.n == 0) {
					res.send('{"err":"抱歉，更新失败"}');
				} else {
					res.send('{"success":"更新成功"}');
				}
			});
			break;

		case "state": // 课程的状态的控制 草稿 上架 下架

			var ID = parseInt(req.body.ID);
			//查询数据库获得当前数据对应的state状态
			handler("find", "productList", {
				"ID": ID
			}, function(data) {

				if(data.length == 0) {
					res.send('{"err":"抱歉，处理上下架失败"}');
				} else {
					var state;
					if(data[0].isState == 1) {
						state = 2;
					} else if(data[0].isState == 2) {
						state = 3;
					} else {
						state = 2;
					}
					var selector = [{
							ID: ID
						},
						{
							$set: {
								isState: state
							}
						}

					];
					//跟具当前状态做切换操作
					handler("update", "productList", selector, function(result) {
						if(result.result.n == 0) {
							res.send('{"err":"抱歉，更新失败"}');
						} else {
							res.send('{"success":"更新成功"}');
						}
					});
				}
			});
			break;

		case "top": // 对课程的置顶
			var ID = parseInt(req.body.ID);
			//查询对应ID的document获得当前数据的isTop值
			handler("find", "productList", {
				"ID": ID
			}, function(data) {

				if(data.length == 0) {
					res.send('{"err":"抱歉，操作失败"}');
				} else {
					var selector = [{
							ID: ID
						},
						{
							$set: {
								isTop: !data[0].isTop
							}
						}

					];
					//根据当前数据的isTop值做切换操作
					handler("update", "productList", selector, function(result) {
						if(result.result.n == 0) {
							res.send('{"err":"抱歉，更新失败"}');
						} else {
							res.send('{"success":"更新成功"}');
						}
					});
				}
			});

			break;

		case "delete": // 删除

			// if (flagInt === 0) {
			//获取该条课程信息
			handler("find", "productList", {
				ID: parseInt(req.body.ID)
			}, function(data) {
				if(data.length !== 0) {
					flagInt++;

					var pro_id = data[0]._id; // 该课程的_id
					var Cname = data[0].Cname; // 课程名称

					handler('find', 'directoryList', {
						CDid: pro_id
					}, function(dirData) {

						//  迭代处理 该课程下的目录
						delProDir(req, res, pro_id, Cname, dirData, function() {

							//  迭代处理 目录成功 后的回调
							//  删除该目录
							handler("delete", "productList", {
								ID: parseInt(req.body.ID)
							}, function(result) {
								if(result.result.n == 0) {
									res.send({
										err: "删除失败"
									})
								} else {
									//  查找大于删除ID的课程数据
									handler('find', 'productList', {
										ID: {
											$gt: parseInt(req.body.ID)
										}
									}, function(proData) {
										if(proData.length == 0) {
											res.send({
												success: "删除成功"
											})
										} else {
											//  迭代处理 大于 该课程的ID
											recUpdateID(req, res, "productList", proData, function() {

												flagInt--;
												res.send('{"success":"删除成功"}');

											});
										}
									})
								}

							})
						})
					})
				} else {
					res.send('{"err":"删除失败"}');
				}
			});

			// } else {
			//     res.send('{"err":"稍后操作"}');
			// }

			break;

		default:
			res.send({
				"err": '请求路径错误'
			});

	}
});

//////////////////////////////////////////////////////////////////////
//清除封面图片
router.get('/UpLoadPicHandler', function(req, res) {
	if(req.query.action !== "delete") {
		var obj = {
			cacheName: '',
			err: "失败"
		}
		res.send(obj);
	};
	//删除封面图片
	handler("delete", "coverList", {
		pathName: req.query.pathName
	}, function(data) {
		var obj = {
			result: data,
			success: "成功"
		}
		res.send(obj);
	});

});
//图片上传的处理逻辑
router.post('/UpLoadPicHandler', function(req, res) {
	var form = new formidable.IncomingForm(); //创建Formidable.IncomingForm对象
	form.encoding = 'utf-8'; //设置表单域的编码
	form.uploadDir = "temp/"; // 设置上传文件存放的文件夹
	form.keepExtensions = true; // 设置该属性为true可以使得上传的文件保持原来的文件的扩展名
	form.maxFieldsSize = 2 * 1024 * 1024; // 限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
	form.maxFields = 1000; // 设置可以转换多少查询字符串，默认为1000
	//将文件暂存到项目根目录的temporary文件夹下
	//
	// // 方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
	//
	form.parse(req, function(error, fields, files) {
		//生成封面图片在数据库中的索引
		var pathName = generateCode() + "pic";
		//读取暂存文件生成16进制的流

		var readableStream = fs.createReadStream(files[Object.getOwnPropertyNames(files)[0]].path);
		var chunks = [];
		var size = 0;
		readableStream.on('data', function(chunk) {
			chunks.push(chunk);
			size += chunk.length;
		});

		readableStream.on('end', function() {
			var buf = Buffer.concat(chunks, size);
			var pictures = {
				pathName: pathName,
				contents: buf
			}
			//将图片流存入coverList变并删除暂存文件
			handler("insert", "coverList", pictures, function(data) {
				if(data.length == 0) {
					res.send('{"err":"抱歉，上传图片失败"}');
				} else {
					fs.unlink(files[Object.getOwnPropertyNames(files)[0]].path, function(err) {
						if(err) return console.log(err);

					})
					var target = files[Object.getOwnPropertyNames(files)[0]].path.split('.');
					if(target[target.length - 1] == 'jpg' || target[target.length - 1] == 'png' || target[target.length - 1] == 'gif' || target[target.length - 1] == 'jpeg') {
						var obj = {
							cacheName: '/DownLoadPicHandler?pathName=' + pathName,
							success: "成功"
						}
						var str = JSON.stringify(obj);
						res.send(str);
					} else {
						var obj = {
							cacheName: '/DownLoadPicHandler?pathName=' + pathName,
							err: "失败"
						}
						var str = JSON.stringify(obj);
						res.send(str);
					}
				}
			});
		});

	});
});

/*视频列表  */
/////////////////////////////////////////////////////////////////////
//上传视频
router.post('/UpLoadVideoHandler', function(req, res) {
	var form = new formidable.IncomingForm(); //创建Formidable.IncomingForm对象
	//	form.encoding = 'utf-8'; //设置表单域的编码
	form.uploadDir = "videoData/DownLoadPicHandler/"; // 设置上传文件存放的文件夹
	form.keepExtensions = true; // 设置该属性为true可以使得上传的文件保持原来的文件的扩展名
	form.maxFieldsSize = 100 * 1024 * 1024; // 限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
	form.maxFields = 1000; // 设置可以转换多少查询字符串，默认为1000
	// 方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
	form.parse(req, function(error, fields, files) {
		if(!error) {
			var result = null;
			if(files.data.type == "video/mp4") {
				var cachName = "/DownLoadPicHandler/" + path.win32.basename(files.data.path)
				result = {
					success: "成功",
					cacheName: cachName
				};

			} else {
				result = {
					err: "格式不正确"
				}
				fs.unlinkSync(files.data.path);

			}
			res.send(result);
		} else {
			var result = {
				err: "上传失败"
			};
			res.send(result);
		}
	});
});

router.post('/VideoHandler', function(req, res) {
	var action = req.query.action;
	switch(action) { // 添加视频
		case "add":

			handler('find', "videoList", null, function(arr) {
				//组织视频信息并作一些校验
				var videos = {};
				videos.Vname = req.body.Vname;
				videos.Vtime = req.body.Vtime;
				videos.Vurl = req.body.Vurl;
				videos.ID = arr.length + 1;
				videos.Vstate = "";
				videos.createAt = new Date();
				videos.isFinish = false;
				videos.isViewed = false;
				videos.updateAt = new Date();
				videos.Vmosaic = "";
				if(videos.Vname && videos.Vtime && videos.Vurl) {

					handler('find', "videoList", {
						Vname: req.body.Vname
					}, function(docs) {

						if(docs.length == 0) {
							handler('insert', "videoList", videos, function(data) {
								if(data.result.n == 1) {
									res.send({
										success: "成功"
									});
								} else {
									res.send({
										"err": "抱歉，添加失败"
									});
								}
							});

						} else {
							res.send({
								err: "视频名称已经存在，请重新命名！！"
							})
						}
					})

				} else {
					res.send({
						"err": "抱歉，视频添加失败,基本信息不能为空"
					});
				}

			});
			break;
		case "update": // 视频的更新
			//根据ID查询对应的视频document
			handler("find", "videoList", {
				ID: parseInt(req.body.ID)
			}, function(data) {
				if(data.length == 0) {
					res.send('{"err":"抱歉，系统中查不到该视频"}');
				} else {
					//如果对视频做更新操作是更改了视频源则删除原视频源
					if(data[0].Vurl !== req.body.Vurl) {
						fs.unlink(data[0].Vurl, function(err) {
							if(err) return console.log(err);
						})
					}
					var selector = [{
							"ID": parseInt(req.body.ID)
						},
						{
							"$set": {
								Vname: req.body.Vname,
								Vtime: req.body.Vtime,
								Vurl: req.body.Vurl,
								upDateAt: new Date()
							}
						}

					];
					//根据传入数据更新视频列表
					handler('update', "videoList", selector, function(result) {
						if(result.result.n == 1) {
							res.send({
								"success": "更新成功"
							});
						} else {
							res.send({
								"err": "抱歉，更新失败"
							});
						}
					});
				}
			});

			break;
		case "showlist": //显示列表
			var selector = {};
			//如有模糊查询条件则以其为筛选器
			if(req.body.searchText) {
				selector.Vname = {
					$regex: '.*' + req.body.searchText + '.*'
				};
			}
			//查询videoList列表获得总数据条数
			handler('find', "videoList", null, function(arr) {
				if(isNullObj(selector)) {
					selector = {
						ID: {
							$gt: arr.length - (parseInt(req.body.pageStart) * 3 - 3) - 3,
							$lte: arr.length - (parseInt(req.body.pageStart) * 3 - 3)
						}
					};
				}
				//根据筛选器查询videoList获得结果集
				handler('find', "videoList", selector, function(data) {
					if(data.length == 0) {
						res.send('{"err":"系统中还没有视频"}');
					} else {
						var rusult = {
							data: {
								pageSize: 3,
								count: arr.length,
								list: data,
								pageStart: req.body.pageStart
							},
							success: "成功"
						};

						res.send(rusult);
					}
				});
			});
			break;
		default:
			res.send({
				"err": '请求路径错误'
			});
	}
});
router.get('/VideoHandler', function(req, res) {
	var action = req.query.action;
	switch(action) {
		case "delete": // 视频删除
			//根据ID查询当前视频document获得当前视频的Vurl字段
			handler("find", "videoList", {
				ID: parseInt(req.query.ID)
			}, function(data) {
				if(data.length == 0) {
					res.send('{"err":"抱歉，系统中查不到该视频"}');
				} else {
					//删除系统中该视频文件
					fs.unlink(data[0].Vurl, function(err) {
						if(err) return console.log(err);
					});
					//删除数据库中与该视频对应的数据
					handler("delete", "videoList", {
						ID: parseInt(req.query.ID)
					}, function(data) {
						if(data.result.n == 0) {
							res.send('{"err":"删除失败"}');
						} else {
							//迭代处理其余视频文件的操作手柄-ID均减1
							handler("find", "videoList", {
								ID: {
									$gt: parseInt(req.query.ID)
								}
							}, function(da) {
								recUpdateID(req, res, "videoList", da);
							});
						}
					});

				}
			});
			break;
		case "finddir": // 课程目录下绑定的视频
			handler("find", "directoryList", {
				CDid: req.query.CDid
			}, function(data) {
				if(data.length == 0) {
					res.send({
						data: {
							list: []
						},
						err: "未找到与该课程对应的目录"
					});
				} else {
					res.send({
						data: {
							list: data
						},
						success: "成功"
					});
				}
			});
			break;
		case "showdir": // 课程下目录的请求
			//根据ID获取对应的目录document
			handler("find", "directoryList", {
				ID: parseInt(req.query.ID)
			}, function(dirlist) {
				if(dirlist.length == 0) {
					res.send({
						err: "查询失败"
					});
				} else {
					//将目录与课程信息的_id字段拼接成串，根据这个查询对应的视频数据集
					//      typeof      目录_id  + 课程_id  ==>  string
					var strstr = dirlist[0]._id.toString() + dirlist[0].CDid;
					handler("find", "videoList", {
						Vmosaic: {
							$regex: '.*' + strstr + '.*'
						}
					}, function(videoList) {
						res.send({
							data: videoList,
							success: "成功"
						});
					});
				}
			});
			break;

		case "show": // 课程编辑页面视频列表的请求
			var selector = {};
			if(req.query.searchText) {
				selector.Vname = {
					$regex: '.*' + req.query.searchText + '.*'
				};
			}
			//查询videoList获得总数据条数
			handler("find", "videoList", null, function(arr) {
				if(isNullObj(selector)) {
					selector = {
						ID: {
							$gt: arr.length - (parseInt(req.query.pageStart) * 3 - 3) - 3,
							$lte: arr.length - (parseInt(req.query.pageStart) * 3 - 3)
						}
					};
				}
				//分页查询当前三条数据
				handler("find", "videoList", selector, function(data) {
					if(data.length == 0) {
						res.send('{"err":"抱歉，系统中还未添加任何视频"}');
					} else {
						res.send({
							success: "查询成功",
							data: {
								pageSize: 3,
								count: arr.length,
								list: data
							}
						});
					}
				});
			});
			break;
		default:
			res.send({
				"err": '请求路径错误'
			});
	}
});
module.exports = router;