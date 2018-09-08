1. 如何在项目中下载一个mongodb模块，并安装到package.json的依赖中

2. 如何在express框架中通过请求获取如下地址的userName数据 （）
	http:127.0.0.1:4000/login?userName=jack&age=18
	A： req.body.userName        B：req.path.userName	
	C：req.query.userName         D： req.url.userName
3. 有如下表单，表单提交后怎么在后台获取表单中提交veri上面的数据（）
	<form action="/xxxx" method="post">
		<input type="text" name="veri">
		<input type="submit" value="提交">
	</form>
A：req.body.veri           B：req.post.veri
C：req.query.veri           D：req.method.veri
4.在express中可以发送静态资源的中间件是（）
	A : exoress. Router ()       B：express.public()   
	C: express.redirect()        D：express.static()
5.(多选)node怎么运行当前目录下index.js文件（）
	A：node  run  index       B :node  index
	C：node  index.js          D: node  install  index