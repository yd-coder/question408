'use strict';
const unipay = require('uni-pay')
exports.main = async (event, context) => {
	const unipayIns = unipay.initWeixin({
	   appId: '', //小程序appid
	   mchId: '', //微信商户号
	   key: '', //商户号的API密钥
	   //pfx: fs.readFileSync('/path/to/your/pfxfile'), // p12文件路径，使用微信退款时需要，需要注意的是阿里云目前不支持以相对路径读取文件，请使用绝对路径的形式
	})
   //event为客户端上传的参数
   let orderInfo = await unipayIns.getOrderInfo({
      openid: event.openid, //这个是客户端上传的用户的openid
      // subject: event.name, // 订单名称微信支付时不可填写此项
      body: event.goodName,
      outTradeNo: event.outTradeNo, //给他个随机号让他可以第二次发起支付,用的具有唯一的订单号
      totalFee: event.totalFee * 100, // 金额，单位分
      // 支付结果通知地址,没有该参数或者为空会报错,随便给了一个测试网址
      notifyUrl: 'https://mp.weixin.qq.com'
   })
   return { orderInfo }
};
