// db2.js 


// 1. 加载mongodb模块
// 2. 创建一个mongodb的客户端
// 3. 创建 本地mongodb数据的地址 url


// 封装前   确定参数
//     操作的数据库
//     操作的集合
//    （增删改查 操作） ： 操作的数据  操作后回调

function (操作的数据库, 操作的集合, 操作的数据  操作后回调){
	// 4. 客户端和  本地的地址  链接  ==》  链接好的 客户端   
// 5. 链接好的 客户端   ==》链接操作的数据库 // 可变 
// 6. 链接好的数据库  ==》 链接操作的集合     // 可变
// 7. 链接好的集合  ==>  在上面操作数据 （增删改查 操作） // 可变

// 8. 关闭客户端 

// 操作数据之后    执行其他的代码
//              登录  ==> 用户名 和 密码 在数据库中查找  ===》 有  登录成功    无 登录失败
//              搜索（百度） ==》  express的相关信息  ==》 有      显示          无    原因
  	
}
function fn( 操作的数据,操作后的回调){
	// 查找数据
	find({操作的数据}).toArray(function(err,data){
		if(err){	
		}else{ // 成功  
			操作后的回调(data)
		}
	})
}
// 操作数据之后干什么 
fn("用户的信息",function(data){
	if(data.length==0){
		登录失败
	}else{
		登录成功
	}
})
fn("exprss的信息",function(data){
	if(data.length==0){
		原因
	}else{
		显示
	}
})
/* 点击之后干什么 */
click(function(){
	
})

function click(callback){
	onclick=function(){
		callback()
	}
	
}
