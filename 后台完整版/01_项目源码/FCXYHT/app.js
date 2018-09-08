var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

// 操作后台管理接口
var backstageHandle = require('./routes/backstageHandle');
// 操作移动端接口
var receptionHandle = require('./routes/receptionHandle');
// 加载处理数据的模块
var handler = require('./routes/db')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置session
app.use(session({
    "name": "FCXYHT", // 设置cookie的名称，他有个默认的 connect.sid
    "secret": "FCXYHT", // 设置加密的字符串，它是一个必须的属性
    "cookie": { maxAge: 8000000000 }, //设置cookie的失效时间
    "resave": false, // 每次请求是否新设置session
    "saveUninitialized": false //每次请求是否初始化
}));
app.use(express.static(path.join(__dirname, 'public')));
// 视频数据的托管
app.use(express.static(path.join(__dirname, 'videoData')));
//特殊图片请求，
//注意：放置处理处理history和静态资源的最前面的最前面
app.get('/DownLoadPicHandler', function(req, res) {
    var arr = req.originalUrl.split("=");
    handler("find", "coverList", { pathName: arr[arr.length - 1] }, function(docs) {
        if (docs.length==0) {
            res.end('{"err":"抱歉，图片请求失败"}');
        } else {
            res.send(docs[0].contents.buffer);
        }
    })
});




// 解决 调取数据后在控制台显示乱码的问题
app.use(function(req,res,next){
	res.header("Content-Type", "application/json;charset=utf-8");
  	next();
})
// 加载路由    后台管理
app.use('/VueHandler', backstageHandle);
// 加载路由   移动端
app.use("/Handler",receptionHandle);


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
  res.header("Content-Type", "text/html;charset=utf-8");
  res.render('error');
});

module.exports = app;
