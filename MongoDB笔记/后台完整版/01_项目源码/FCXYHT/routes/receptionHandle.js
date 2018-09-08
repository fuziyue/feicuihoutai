/**
 *  翡翠学院app功能接口
 *   2018-4-3
 */
var express = require('express');
var handler = require('./db.js');

var formidable = require('formidable');
var crypto = require('crypto');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

// 学生对象  的构造函数
function Student(userName) {
	this.userName = userName;
}

// 具体的接口
router.get("/UserHandler", function(req, res) {
	switch(req.query.action) {
//		case "isLogin": // 是否登录
//			if(req.session.student && req.session.student.userName) {
//				handler("find", "studentList", {
//					userName: req.session.student.userName,
//					isLogin: true
//				}, function(data) {
//					if(data.length > 0) {
//						res.send({
//							success: "已登录",
//							data: data[0]
//						})
//					} else {
//						res.send({
//							err: "该用户未登录"
//						})
//					}
//				})
//			} else {
//				res.send({
//					err: "该用户未登录"
//				})
//			}
//			break;
		case "quit": // 退出
			if(req.session.student && req.session.student.userName) {
				var selector = [{
					userName: req.session.student.userName
				}, {
					$set: {
						isLogin: false
					}
				}]
				handler("update", "studentList", selector, function(result) {
					if(result.result.n == 1) {
						// 清除session上的  student的值
						req.session.student = null;
						res.send({
							success: "退出成功",
						})
					} else {
						res.send({
							err: "退出失败"
						})

					}
				})
			} else {
				res.send({
					success: "退出成功",
				})
			}
			break;
		default:
			res.send({
				err: "系统内部错误，请重新操作，谢谢！！"
			})
			break;
	}

})
router.post("/UserHandler", function(req, res) {
	switch(req.query.action) {
		case "add": // 学员注册
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
						userInfos.password = crypto.createHash('md5').update(req.body.password).digest('base64');

						if(userInfos.phone != false && userInfos.userName != false && userInfos.turename != 'false' && userInfos.email != false) {
							//增加操作
							handler("insert", "studentList", userInfos, function(result) {
								if(result.result.n == 0) {
									res.send({
										"err": "抱歉，注册失败"
									});
								} else {
									res.send({
										"success": "注册成功"
									});
								}
							});
						} else {
							res.send({
								"err": "抱歉，数据格式有误，注册失败"
							});
						}

					});
				}
			})

			break;

		case "login":

			handler("find", "studentList", {
				userName: req.body.userName,
				password: crypto.createHash('md5').update(req.body.password).digest('base64')
			}, function(docs) {

				if(docs.length > 0) {
					if(docs[0].isstate == false) {
						var selector = [{
							userName: req.body.userName
						}, {
							$set: {
								isLogin: true
							}
						}]
						handler("update", "studentList", selector, function(result) {
							if(result.result.n == 1) {
								req.session.student = new Student(req.body.userName);

								res.send({
									success: "登录成功",
									data: {
										userName: docs[0].userName,
										phone: docs[0].phone,
										email: docs[0].email
									}
								})
							} else {
								res.send({
									err: "登录失败，请重新登录！！"
								})
							}
						})
					} else {
						res.send({
							err: "用户已经被冻结，无法登录！！请联系管理员"
						})
					}
				} else {
					res.send({
						err: "用户名或密码不正确，请重新输入！！"
					})
				}

			})

			break;

		default:
			res.send({
				err: "系统内部错误，请重新操作，谢谢！！"
			})
			break;
	}
})
router.get("/CourseHandler", function(req, res) {
	switch(req.query.action) {
		case "learn": // 学习页面中课程内容的请求
			// 	userName		用户名
			//  courseId       课程 id
			// 查询课程信息
			handler("find", "productList", {
				ID: parseInt(req.query.courseId)
			}, function(course) {
				if(course.length == 0) {
					res.send({
						err: "操作失败，系统中还没有该课程"
					})
				} else {
					// 课程信息
					//let courseInfo = {
					//	Cname: course[0].Cname, // 课程名称
					//	courseId: course[0].ID, // 课程id
					//	Cdescribe: course[0].Cdescribe, // 课程描述
					//	Cpic: course[0].Cpic, // 课程封面
					//	Cprice: course[0].Cname, // 课程价格
					//	Cdetails: course[0].Cdetails, // 课程详细名称
					//}

					// 查询课程下 视频信息
					// 查询 第一个目录下的视频
					handler("find", "videoList", {
						Vmosaic: {
							$regex: '.*' + course[0]._id.toString() + '.*'
						}
					}, function(videos) {
						let Vlist = []; // 视频数据
						if(videos.length == 0) {
							Vlist.push({
								"Vname": '',
								"ID": '',
								"Vtime": '',
								"Vurl": '',
								"isViewed": false,
								"isFinish": false
							})
						} else {
							for(var i = 0; i < videos.length; i++) {
								Vlist.push({
									"Vname": videos[i].Vname,
									"ID": videos[i]._id.toString(),
									"Vtime": videos[i].Vtime,
									"Vurl": videos[i].Vurl,
									"isViewed": false,
									"isFinish": false
								});
							}
						}

						handler("find", "commentList", {
							productId: course[0]._id.toString()
						}, function(coments) {
							//coments 评论
							let evaluate = coments;
							//if(coments.length == 0) {
							//	evaluate = [{
							//		userName: "",
							//createAt: "",
							//evaluate: "",
							//	}]
							//} else {
							//	evaluate = coments;
							//}
							// 发送数据
							if(req.query.userName) { // 登录的
								var selector = {
									userName: req.query.userName,
									productId: course[0]._id.toString()
								}
								handler("find", "myProductList", selector, function(order) {
									if(order.length == 0 && !order.isBuy) { //未购买
										res.send({
											success: "成功",
											data: {
												Vlist: Vlist,
												evaluate: evaluate,
												isBuy: false,
												Cname: course[0].Cname, // 课程名称
												courseId: course[0].ID, // 课程id
												Cdescribe: course[0].Cdescribe, // 课程描述
												Cpic: course[0].Cpic, // 课程封面
												Cprice: course[0].Cname, // 课程价格
												Cdetails: course[0].Cdetails, // 课程详细名称
											}

										})
									} else { // 购买

										res.send({
											success: "成功",
											data: {
												Vlist: Vlist,
												evaluate: evaluate,
												isBuy: true,
												Cname: course[0].Cname, // 课程名称
												courseId: course[0].ID, // 课程id
												Cdescribe: course[0].Cdescribe, // 课程描述
												Cpic: course[0].Cpic, // 课程封面
												Cprice: course[0].Cname, // 课程价格
												Cdetails: course[0].Cdetails, // 课程详细名称
											}

										})
									}
								})
							} else { // 未登录的
								res.send({
									success: "成功",
									data: {
										Vlist: Vlist,
										evaluate: evaluate,
										isBuy: false,
										Cname: course[0].Cname, // 课程名称
										courseId: course[0].ID, // 课程id
										Cdescribe: course[0].Cdescribe, // 课程描述
										Cpic: course[0].Cpic, // 课程封面
										Cprice: course[0].Cname, // 课程价格
										Cdetails: course[0].Cdetails, // 课程详细名称
									}

								})
							}
						})

					})
				}
			})

			break;
		case "indexshow": // 首页内容
			handler("find", "productList", null, function(docs) {
				var len = docs.length; // 课程总量
				if(len == 0) {

					res.send({
						err: "暂未发布课程，请询问管理员"
					})

				} else {
					var bannerList = [];
					var newList = [];
					for(let i = 0; i < len; i++) {
						if(i < 3) {
							var bannerItem = {
								Cname: docs[i].Cname, // 课程名称
								ID: docs[i].ID, //课程id
								Cdescribe: docs[i].Cdescribe, // 课程藐视
								Cpic: docs[i].Cpic, //课程封面
								Cprice: docs[i].Cprice, //价格
								createAt: docs[i].createAt, //创建日期
							}
							bannerList.push(bannerItem);
						}

						if(i > len - 7) { // 取六条数据
							var newItem = {
								Cname: docs[i].Cname, // 课程名称
								ID: docs[i].ID, //课程id
								Cdescribe: docs[i].Cdescribe, // 课程藐视
								Cpic: docs[i].Cpic, //课程封面
								Cprice: docs[i].Cprice, //价格
								createAt: docs[i].createAt, //创建日期
							}
							newList.push(newItem);
						}
					}

					res.send({
						success: "获取数据成功",
						data: {
							bannerList: bannerList,
							newList: newList
						}
					})

				}
			})
			break;

		case "getcategory": // 一级专业目录请求
			handler("find", "catalogList", {
				"fatherId": 0
			}, function(docs) {
				if(docs.length == 0) {
					res.send({
						err: "暂时是没有专业分类，请询问管理员"
					})
				} else {
					res.send({
						success: "成功",
						data: docs
					})
				}
			})
			break;

		case "courseshow": // 课程列表展示

			// req.query.sysId  分类
			// req.query.courseName 课程名称

			var selector = {}; // 查询条件
			if(req.query.courseName || req.query.sysId) {
				if(req.query.courseName) {
					selector.Cname = {
						$regex: '.*' + req.query.courseName + '.*'
					}
				}
				if(req.query.sysId) {
					selector.CategoryOne = req.query.sysId;
				}

			} else {

				selector = {}
			}

			handler("find", "productList", null, function(docs) {
				if(docs.length == 0) {
					res.send({
						err: "暂时没有课"
					})
				} else {
					handler("find", "productList", selector, function(data) {
						if(data.length == 0) {
							res.send({
								err: "没有查询到课程"
							})
						} else {
							var list = [];
							for(let i = 0, len = data.length; i < len; i++) {
								var item = {
									Cname: data[i].Cname, // 课程名称
									ID: data[i].ID, //课程id
									Cdescribe: data[i].Cdescribe, // 课程藐视
									Cpic: data[i].Cpic, //课程封面
									Cprice: data[i].Cprice, //价格
									createAt: data[i].createAt, //创建日期
								}
								list.push(item);
							}
							res.send({
								success: "成功",
								data: {
									pageSize: data.length,
									count: docs.length,
									list: list
								}
							})
						}
					})
				}
			})

			break;

			/*——————————————我的课程————————————*/
		case "mycourse": // 我的课程列表
			handler("find", "myProductList", {
				userName: req.query.userName
			}, function(docs) {

				if(docs.length > 0) {
					var _idArr = [];
					for(var i = 0; i < docs.length; i++) {
						if(docs[i].isBuy) {
							_idArr.push(new ObjectID(docs[i].productId));
						}
					}

					handler("find", "productList", {
						_id: {
							$in: _idArr
						}
					}, function(dat) {

						if(dat.length > 0) {
							var listData = [];
							for(var i = 0; i < dat.length; i++) {
								var obj = {};
								obj.Cname = dat[i].Cname;
								obj.Cdescribe = dat[i].Cdescribe;
								obj.Cnumber = dat[i].Cnumber;
								obj.courseID = dat[i].courseID;
								obj.Cpic = dat[i].Cpic;
								obj.Cprice = dat[i].Cprice;
								obj.createAt = dat[i].createAt;
								obj.CDetails = dat[i].CDetails;
								obj.CategoryOne = dat[i].CategoryOne;
								obj.CategoryTwo = dat[i].CategoryTwo;
								obj.CategoryThree = dat[i].CategoryThree;
								obj.isDelete = dat[i].isDelete;
								obj.isState = dat[i].isState;
								obj.isTop = dat[i].isTop;
								obj.onlineUser = dat[i].onlineUser;
								obj.ID = dat[i].ID;
								listData.push(obj);
							}
							res.send({
								"success": "成功",
								"data": listData
							});
						} else {
							res.send({
								err: "还没有购买任何课程"
							});
						}
					});
				} else {
					res.send({
						err: "还没有购买任何课程"
					});
				}
			});

			break;
		default:
			res.send({
				err: "系统内部错误，请重新操作，谢谢！！"
			})
			break;
	}
})
router.post("/CourseHandler", function(req, res) {
	switch(req.query.action) {
		case "buycourse": // 购买课程
			// req.body.userName   学生姓名
			// req.body.courseId  课程id
			if(req.body.userName != "" && req.body.courseId != "") {
				handler("find", "productList", {
					ID: parseInt(req.body.courseId)
				}, function(doc) {
					if(doc.length == 0) {
						res.send({
							err: "没有该课程，无法购买"
						})
					} else {
						var selector = {
							productId: doc[0]._id.toString(), // 课程的_id
							userName: req.body.userName, // 学生用户名
							isBuy: true // 是否购买
						}

						handler("insert", "myProductList", selector, function(result) {
							if(result.result.n == 1) {
								res.send({
									success: "购买成功"
								})
							} else {
								res.send({
									err: "购买失败"
								})
							}

						})

					}
				})

			} else {
				res.send({
					err: "购买失败"
				})

			}

			break;
		case "addcoursecomments": // 评价课程
			//courseId		课程id
			//evaluate		评价内容
			//userName		评论的用户

			if(req.body.userName != "" && req.body.courseId != "") {
				handler("find", "productList", {
					ID: parseInt(req.body.courseId)
				}, function(doc) {
					if(doc.length == 0) {
						res.send({
							err: "没有该课程，无法添加评论该课程"
						})
					} else {
						var selector = {
							productId: doc[0]._id.toString(), // 课程的_id
							userName: req.body.userName, // 学生用户名
							evaluate: req.body.evaluate, // 评论内容
							createAt: new Date() //评论的时间
						}

						handler("insert", "commentList", selector, function(result) {
							if(result.result.n == 1) {
								res.send({
									success: "添加评论成功"
								})
							} else {
								res.send({
									err: "添加评论失败"
								})
							}

						})

					}
				})

			} else {
				res.send({
					err: "添加评论失败"
				})

			}
			break;
		default:
			break;
	}
})


module.exports = router;