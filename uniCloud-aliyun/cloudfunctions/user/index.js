'use strict';
const mp_wx_data = {
    AppID: 'wxd1cf59668e07a107',
    AppSecret: '5b52ea7d3625f779a8cdddcba4f6c06f'
}

exports.main = async (event, context) => {
    //event为客户端上传的参数
    // console.log('event : ', JSON.stringify(event))

    const db = uniCloud.database();
    // 获取 `user` 集合的引用
    const user = db.collection('user');

    // 循环判断客户端传递过来的 action
    // 通过 action 判断请求对象

    let result = {};

    switch (event.action) {
        // 通过 code 获取用户 session和openid
        case 'code2Session':
            const res_session = await uniCloud.httpclient.request(
                'https://api.weixin.qq.com/sns/jscode2session', {
                    method: 'GET',
                    data: {
                        appid: mp_wx_data.AppID,
                        secret: mp_wx_data.AppSecret,
                        js_code: event.js_code,
                        grant_type: 'authorization_code'
                    },
                    dataType: 'json'
                }
            )
            // console.log(res_session)
            const success = res_session.status === 200 && res_session.data && res_session.data.openid

            if (!success) {
                return {
                    status: -2,
                    msg: '从微信获取登录信息失败'
                }
            }
			
						// 用code获取的openid查user表是否存在该用户
            const res_user = await user.where({
                openid: res_session.data.openid
            }).get()

            if (res_user.data && res_user.data.length === 0) {
                // 没有用户信息，进入注册
                const register = await uniCloud.callFunction({
                    name: 'user',
                    data: {
                        action: 'register',
                        open_id: res_session.data.openid,
                        user_info: event.user_info
                    }
                }).then(res => {
                    result = res
                })
            } else {
                // const update = await uniCloud.callFunction({
                //     name: 'user',
                //     data: {
                //         action: 'update',
                //         open_id: res_session.data.openid,
                //         _id: res_user.data[0]._id,
                //         user_info: event.user_info
                //     }
                // }).then(res => {
                //     result = res
                // })
								await uniCloud.callFunction({
								    name: 'user',
								    data: {
								        action: 'getUser',
								        open_id: res_session.data.openid
								    }
								}).then(res => {
								    result = res
								})
            }
            break;
        case 'register':
            const res_reg = await user.add({
                nickName: event.user_info.nickName,
                avatarUrl: event.user_info.avatarUrl,
                openid: event.open_id,
								questionList: [],
								count: 0,
								favorite: [],
                register_date: new Date().getTime(),
								admin: false
            })

            if (res_reg.id) {
                const res_reg_val = await uniCloud.callFunction({
                    name: 'user',
                    data: {
                        action: 'getUser',
                        open_id: event.open_id
                    }
                }).then(res => {
                    result = res
                })
            } else {
                result = {
                    status: -1,
                    msg: '微信登录'
                }
            }
            break;
        case 'update':
            const res_update = await user.doc(event._id).update({
                nickName: event.user_info.nickName,
                avatarUrl: event.user_info.avatarUrl,
                openid: event.open_id
            })

            const res_update_val = await uniCloud.callFunction({
                name: 'user',
                data: {
                    action: 'getUser',
                    open_id: event.open_id
                }
            }).then(res => {
                result = res
            })
            break;
        case 'getUser':
            const res_val = await user.where({
                openid: event.open_id
            }).get()
            return res_val.data[0]
            break;
    }
    return result;
};