// 时间戳计算函数
export function formatDate(date, fmt) {
/* 

          RegExp(正则表达式)
  RegExp 对象用于将文本与一个模式匹配。
  有两种方法可以创建一个RegExp对象：一种是字面量，另一种是构造函数。
  /(y+)/.test(正则匹配的对象)  字面量形式，匹配到了返回true，反之返回false
  new RegExp((y+)).test(正则匹配的对象) 构造函数形式
  replace(被替换的，要替换的)  返回替换后的字符串，不会改变原来的字符串

  y+ 1个或者多个y
  y* 0个或者多个y
  y? 0个或者1个y
*/
  if (/(y+)/.test(fmt)) {

    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));  // 获取年份

  }

  let o = {

    'M+': date.getMonth() + 1,

    'd+': date.getDate(),

    'h+': date.getHours(),

    'm+': date.getMinutes(),

    's+': date.getSeconds()

  };

  for (let k in o) {

    if (new RegExp(`(${k})`).test(fmt)) {

      let str = o[k] + '';

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));

    }

  }

  return fmt;

};



function padLeftZero (str) {

  return ('00' + str).substr(str.length);

};