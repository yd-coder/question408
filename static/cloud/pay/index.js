const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 自动切换默认环境
})

exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : event.goodName,  // 商品名称或商品描述
    "outTradeNo" : event.outTradeNo,  // 订单号
    "spbillCreateIp" : "127.0.0.1",  // 后台ip
    "subMchId" : "1627071107", // 微信支付商户号
    "totalFee" : event.totalFee * 100, // 支付金额，单位分
    "envId": "zhangwo408-6gmhb55b89eb4fee", // 环境id
    "functionName": "payCallBack"  // 函数名
  })
  return res
}
