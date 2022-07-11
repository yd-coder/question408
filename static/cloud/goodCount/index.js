// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 自动切换默认环境
})

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('goods').where({
     name: event.goodName
    }).update({
      data: {
        count: event.count + 1
      },
    })
}