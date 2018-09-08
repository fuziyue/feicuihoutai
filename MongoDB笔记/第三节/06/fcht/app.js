// 创建错误的中间件
var createError = require('http-errors');
// 加载express 框架
var express = require('express');
// 加载 处理路径中间件
var path = require('path');
// 处理cookie中间件
var cookieParser = require('cookie-parser');
// 处理访问日志的中间件   ==》 在cmd中打印浏览器访问的记录
var logger = require('morgan');
// 加载  路由文件 
var indexRouter = require('./routes/index');
// 使用   
var app = express(); // 入口函数
// 使用处理日志的中间件
app.use(logger('dev'));
// 处理 post请求的中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 处理 cookie的中间件
app.use(cookieParser());
// 使用静态资源中间件   /  ..... /fcht/public
app.use(express.static(path.join(__dirname, 'public')));
// 使用路由文件
app.use('/', indexRouter);

// 暴露 app
module.exports = app;
