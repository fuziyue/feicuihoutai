// index.js 使用 封装好的mongodb模块的文件

var handler = require("./db.js") // 加载 封装好的文件
// 3 -10
//  3
var arr = [{
		"name": "张三",
		"age": 18,
		"sex": 0
	},
	{
		"name": "李四",
		"age": 21,
		"sex": 1
	},
	{
		"name": "王五",
		"age": 16,
		"sex": 0
	},
	{
		"name": "赵六",
		"age": 50,
		"sex": 1
	},
	{
		"name": "孙七",
		"age": 40,
		"sex": 1
	},
	{
		"name": "吴九",
		"age": 8,
		"sex": 0
	},
	{
		"name": "郑十",
		"age": 20,
		"sex": 1
	},
]

//for(var i = 0, len = arr.length; i < len; i++) {
//	// 插入数据
//	// 参数
//	// 第一参数 操作的类型
//	// 第二参数 操作的集合
//	// 第三参数 操作的数据
//	// 第四参数  操作后的回调  ==> 操作的结果
//	handler("insert", "work", arr[i], function(result) {
//			if(result.result.n==0){
//				console.log("插入数据失败")
//			}else{
//				console.log("插入数据成功")
//			}
//	})
//}

// 1. 启动数据库 net start mongodb
// 2. 运行js     node index.js

//9. 把所有为性别为女的人的年龄改为18，结果截图

// 思路   1)查询到所有的数据(性别为女的)
//      2)在去修改 按姓名

// 查询性别为女的数据
handler("find", "work", {
	sex: 0
}, function(result) {
	// 判断下有没数据
	if(result.length > 0) {
		// 有数据  修改  [{},{},{}]
		console.log("有数据")
		for(var i = 0, len = result.length; i < len; i++) {
			// 修改 查找的数据(性别为女的人   age:18)
			handler("update", "work", [{
				name: result[i].name
			}, {$set: {	age: 19	}
			}], function(res) {
				if(res.result.n == 0) {
					console.log("修改失败")
				} else {
					console.log("修改成功")
				}
			})
		}

	} else {
		// 没有数据
		console.log("没有性别为女的人,无法去修改")
	}

})