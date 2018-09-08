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

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 使用处理日志的中间件
app.use(logger('dev'));


// 处理 post请求的中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 使用 这两个 之后  才能通过 req.body 获取数据



// 处理 cookie的中间件
app.use(cookieParser());
// 使用静态资源中间件   /  ..... /fcht/public
app.use(express.static(path.join(__dirname, 'public')));


// 使用路由文件
// 第一个参数    路径
app.use('/VueHandler', indexRouter);


// 设置错误处理
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// 暴露 app
module.exports = app;
