// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "type": {
    "rules": [
      {
        "required": true,
        "errorMessage": "{label}无效"
      },
      {
        "format": "int",
        "errorMessage": "{label}无效"
      },
      {
        "range": [
          {
            "text": "选择题",
            "value": 1
          },
          {
            "text": "判断题",
            "value": 2
          }
        ],
        "errorMessage": "{label}无效"
      }
    ],
    "label": "题目类别"
  },
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "题目"
  },
  "answer": {
    "rules": [
      {
        "required": true,
        "errorMessage": "{label}无效"
      },
      {
        "format": "string",
        "errorMessage": "{label}无效"
      },
      {
        "range": [
          {
            "text": "选择题A判断题对",
            "value": "A"
          },
          {
            "text": "选择题B判断题错",
            "value": "B"
          },
          {
            "text": "选择题C",
            "value": "C"
          },
          {
            "text": "选择题D",
            "value": "D"
          }
        ],
        "errorMessage": "{label}无效"
      }
    ],
    "label": "答案"
  },
  "answerDoubt": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "题目解析"
  }
}

const enumConverter = {
  "type_valuetotext": {
    "1": "选择题",
    "2": "判断题"
  },
  "answer_valuetotext": {
    "A": "选择题A判断题对",
    "B": "选择题B判断题错",
    "C": "选择题C",
    "D": "选择题D"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
