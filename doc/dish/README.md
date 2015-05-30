# Dish

```js
{
  "_id": "",
  "publishedAt": "", # 发布时间
  "sortId": "", # 排序值
  "isPublished": false, # 是否已发布
  "title": { # 菜名
    "zh": "",
    "en": ""
  },
  "difficulty": 1, # 难度
  "time": 1, # 烹饪时间 单位min
  "portion": 1, # 几人份
  "brief": { # 简介
    "zh": "",
    "en": ""
  },
  "special": [ # 特色
    {
      "key": "", # pic, txt, url, vid
      "value": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "ingredient": [ # 原料
    {
      "key": "",
      "value": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "step": [ # 步骤
    {
      "key": "",
      "value": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "heat": 0, # 热度
  "sales": 0, # 销量
  "likes": 0, # 赞数
  "reads": 0, # 浏览量
  "cover": [ # 封面
    {
      "zh": "",
      "en": ""
    }
  ],
  "cooker": [ # 厨具 "toaster","pot","pan","oven","mixer","bowl"
    {
      "zh": "",
      "en": ""
    }
  ],
  "tag": [ # tag
    {
      "zh": "",
      "en": ""
    }
  ],
  "attr": [ # 属性
    {
      "name": { # 类名 例: 肉类
        "zh": "",
        "en": ""
      },
      "attr": [
        {
          "name": { # 属性名, 例: 澳牛, 和牛
            "zh": "",
            "en": ""
          },
          "price": 0,
          "isDefault": true
        }
      ]
    }
  ],
  "base": [ # 基价
    {
      "num": 1 # 份数
      "price": 1 # 元/份
    }
  ],
  "originalPrice": 0 # 原价
  "add": [ # 附加 类似浇头概念
    {
      "name": {
        "zh": "",
        "en": ""
      },
      price: 0
    }
  ],
  "region": [ # 地区
    {
      "zh": "",
      "en": ""
    }
  ],
  "storage": 1 # 即食包冷藏保存期
  "type": { # ready to cook, ready to eat
    "zh": "",
    "en": ""
  },
  "pair": [ # 推荐搭配
    {
      dish: { # 另一个菜品的基本信息
      },
      desc
    }
    desc: { # 介绍
      "zh": "",
      "en": ""
    }
  ]
}
```
