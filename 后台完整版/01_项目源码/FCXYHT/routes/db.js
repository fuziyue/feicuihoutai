
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://127.0.0.1:27017";
var DBNAME = "fchtdata"; // 操作的数据库
var insert = function(client, collection, data, callback) {
    collection.insert(data, function(err, result) {
        if (err) {
            console.log("添加失败");
            console.log(err);
        } else {
            callback(result);
        }
        client.close(); // 关闭客户端
    })
}


var update = function(client, collection, data, callback) {
    collection.updateOne(data[0], data[1], function(err, result) {
        if (err) {
            console.log("修改失败");
            console.log(err);
        } else { callback(result); }
        client.close();
    })
}


var deletes = function(client, collection, data, callback) {
        collection.deleteOne(data, function(err, result) {
            if (err) {
                consle.log("删除失败");
                console.log(err);
            } else {
                callback(result);
            }
            client.close();
        })
    }

var find = function(client, collection, data, callback) {

        collection.find(data).toArray(function(err, result) {
            if (err) {
                console.log("查询失败");
                console.log(err);
            } else {
                callback(result);
            }
            client.close();
        })
    }
// 对象保存 增删改查 的 方法
var methodType = {
        insert: insert, // 添加数据
        update: update, // 更新数据
        find: find, // 查找数据
        delete: deletes // 删除数据
    }

module.exports = function(type, collections, data, callback) {
    MongoClient.connect(url, function(err, client) {
        if (err) {
            console.log('链接失败');
            console.log(err);
        } else { // 链接成功
            var db = client.db(DBNAME); // 对数据库的链接
            var collection = db.collection(collections); // 对集合的链接

            methodType[type](client, collection, data, callback);
        }
    })
}