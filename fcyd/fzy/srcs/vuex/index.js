//vuex   /index.js
//写xuex的代码
// 1)加载vue
// 2)加载vuex
// 3)在vue中使用vuex   vue.use()
// 4)暴露一个store实例   new Vuex.Store({})

import Vue from "vue";  //加载
import Vuex from "vuex";

//加载之后，在vue中使用vuex
Vue.use(Vuex);

export default new Vuex.Store({
	state:{//数据
		title:"vuex中控制的计数器",
		num:0
	},
	mutations:{//改变数据的方法
		add(state,data){
			state.num++;
		},
		sub(state,data){
			state.num--;
		}
	}
})
