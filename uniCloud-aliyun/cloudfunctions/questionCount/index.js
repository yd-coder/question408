'use strict';

exports.main = async (event, context) => {
	return await uniCloud.database().collection('user').where({
		openid: event.openid
	}).get().then(res => {
		if( !res.data[0].questionList.includes(event.id) ){
			let newArr = res.data[0].questionList.concat(event.id)
			uniCloud.database().collection('user').where({
				openid: event.openid
			}).update({
				questionList: newArr,
				count: res.data[0].count + 1
			})
		}
	})
}