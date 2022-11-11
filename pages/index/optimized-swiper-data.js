/*
	数据字段解释
	----------------------
	type：题目类型		1：选择题，2：判断题
	title：题目标题		
	answerSheet：答题选项, Array
	answerResult：答题结果
	answerDoubt：题目解析
	answer：答案
	favorite：是否收藏
	
*/

let dataList= function(){
	return [
		{
			"type":"1",
			"title":"uni-app 中，轮播图组件的名称是？",
			"answer":"B",
			"answerSheet":[
				{"value":'A',"name":"view"},
				{"value":'B',"name":"swiper"},
				{"value":'C',"name":"image"},
				{"value":'D',"name":"button"}
			],
			"answerDoubt":"轮播图组件的名称是 swiper，可参考文档：https://uniapp.dcloud.io/component/swiper.html",
			"favorite":"true"
		},
		{
			"type":"1",
			"title":"以下不属于web前端开发的知识点是？",
			"answer":"D",
			"answerSheet":[
				{"value":'A',"name":"ajax 异步请求"},
				{"value":'B',"name":"GET / POST请求"},
				{"value":'C',"name":"DIV + CSS"},
				{"value":'D',"name":"MySQL"}
			],
			"answerDoubt":"MySQL是一个关系型数据库管理系统，属于后端开发的知识点"
		},
		{
			"type":"1",
			"title":"以下那一项不属于作者的联系方式",
			"answer":"C",
			"answerSheet":[
				{"value":'A',"name":"QQ：2395183536"},
				{"value":'B',"name":"邮箱：2395183536@qq.com"},
				{"value":'C',"name":"电话：1888888888"},
			],
			"answerDoubt":"我的电话不是 18888888888"
		}
	]
};

let getDataList = function(){
	let list = [];
	let size = Math.floor(Math.random()*500);
	if(size<200){
		size+=200;
	}
	let dataList1 = dataList();
	for(let i=5;i<size;i++){
		dataList1.push({
			"type":"2",
			"title":`这是随机生成的第 ${i} 题，请您猜一猜答案。`,
			"answer":`${Math.random() > 0.5 ? 'A':'B'}`,
			"answerSheet":[
				{"value":'A',"name":"是"},
				{"value":'B',"name":"否"},
			],
			"answerDoubt":`这是随机生成的第 ${i} 题，题目解析内容。`,
		});
	}
	return new Promise((reslove)=>{
		reslove(dataList1)
	})
}

export default {
	getDataList
}