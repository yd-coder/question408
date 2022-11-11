'use strict';

exports.main = async (event, context) => {
  return await uniCloud.database().collection('goods').where({
     name: event.goodName
    }).update({
        count: event.count + 1
    })
}