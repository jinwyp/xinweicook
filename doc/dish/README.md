# Dish 菜品


字段 stockWarehouse 是一个数组, 为每个仓库的库, 为了方便增加辅助字段 stockWarehouseObj 把数组转成了对象
字段 stockWarehouseNotPublished 为了方便增加辅助字段 用来控制对应仓库不显示, 该数组里面为仓库ID, 则用户当前地址(对应仓库)不显示的该商品



```js



{
  "_id": "",
  "publishedAt": "", # 发布时间
  "sortId": "", # 排序值
  "isPublished": false, # 是否已发布

  "cookingType": "ready to cook", # ready to cook, ready to eat

  "sideDishType": "main", #主菜或配菜  main主菜 / topping浇头 / preferences菜属性 / drink饮料

  "setType": String # 餐食类型  单品single 或 套餐set


  "title": { # 菜名
    "zh": "",
    "en": ""
  },
  "difficulty": 1, # 难度
  "time": 1, # 烹饪时间 单位min
  "servings": 1, # 几人份
  "cover": [ # 封面
    {
      "zh": "",
      "en": ""
    }
  ],
  "brief": { # 简介
    "zh": "",
    "en": ""
  },
  "infoUniqueFeature": [ # 特色
    {
      "title": {
        "zh": "",
        "en": ""
      }
      "contentType": "", # pic, txt, url, vid
      "value": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "infoIngredient": [ # 原料
    {
      "title": {
        "zh": "",
        "en": ""
      }
      "contentType": "", # pic, txt, url, vid
      "value": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "infoCookingStep": [ # 步骤
    {
      "title": {
        "zh": "",
        "en": ""
      }
      "contentType": "", # pic, txt, url, vid
      "value": {
        "zh": "",
        "en": ""
      }
    }
  ],

  "kitchenware": [ # 厨具 "toaster","pot","pan","oven","mixer","bowl"
    {
      "zh": "",
      "en": ""
    }
  ],

  "region": [ # 地区
    {
      "zh": "",
      "en": ""
    }
  ],

  "storageLife": 1 # 即食包冷藏保存期


  "statisticHot": 0, # 热度
  "statisticSales": 0, # 销量
  "statisticLikes": 0, # 赞数
  "statisticViews": 0, # 浏览量


  "tagFilter": [ # ref to tag
    "Schema.ObjectId1", "Schema.ObjectId2"
  ],


  "priceOriginal": 0 # 原价
  "priceWholesale": [ # 批发价
    {
      "quantity": 1 # 份数
      "price": 1 # 元/份
    }
  ],

  "preferences": [ # 属性
    {
      "name": { # 类名 例: 肉类
        "zh": "",
        "en": ""
      },
      "foodMaterial": [
        {
          "name": { # 属性名, 例: 澳牛, 和牛
            "zh": "",
            "en": ""
          },
          "price": 0,
          "default": true
        }
      ]
    }
  ],

  "topping": [ # 附加 类似浇头概念
    {
      "name": {
        "zh": "",
        "en": ""
      },
      price: 0
    }
  ],


  "recommendSet": [ # 推荐搭配
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

## 菜品 范例

```js
{
  "_id": "55ffc3517e6977d44a77bc71",
  "modifiedAt": "2015-11-20T09:16:19.841Z",
  "createdAt": "2015-11-13T05:11:03.314Z",
  "sortId": 1013,
  "cookingType": "ready to eat",
  "sideDishType": "main",
  "setType": "single",
  "servings": 1,
  "priceOriginal": 29,
  "showForWarehouse": "xinweioffice",
  "stockWarehouse": [
    {
      "warehouse": "56332187594b09af6e6c7dd2",
      "_id": "564d3680ce5a3e4618bbc9bb",
      "isPublished": true,
      "stock": 947
    },
    {
      "warehouse": "56332196594b09af6e6c7dd7",
      "_id": "564d3680ce5a3e4618bbc9bc",
      "isPublished": true,
      "stock": 0
    },
    {
      "warehouse": "564ab6de2bde80bd10a9bc60",
      "_id": "569c91a90a5845ef24e4cbc0",
      "isPublished": true,
      "stock": 0
    }
  ],
  "stock": 235,
  "topping": [],
  "preferences": [],
  "priceWholesale": [],
  "tagFilter": [],
  "infoCookingStep": [],
  "infoIngredient": [],
  "infoUniqueFeature": [],
  "kitchenware": [],
  "cover": [
    {
      "zh": "https://dn-xinweicook.qbox.me/1106xian.jpg",
      "en": "https://dn-xinweicook.qbox.me/1106xian.jpg",
      "_id": "55ffc3517e6977d44a77bc72"
    }
  ],
  "brief": {
    "zh": "马友咸鱼肉质结实成片，味道咸而鲜，配上精心剁制的猪肉馅，一起搅拌，做成肉饼，入锅蒸制。肉饼滑溜鲜美，咸鱼肉带着特有的香气，色香味俱全的完美享受。",
    "en": "Salted fish is firm, salty, and fresh; combined with carefully chopped pork filling to make pot-steaming meatloaf patty. Patty is slippery delicious, salty fish with a unique aroma, perfect combination of color, aroma, taste, and appearance."
  },
  "title": {
    "zh": "咸香蒸肉饼",
    "en": "Steamed Pork Pie with Salted Fish Cutlet"
  },
  "isFromAdminPanel": true,
  "isPublished": true,

  "stockWarehouseNotPublished": [
    "56332187594b09af6e6c7dd2"
  ],
  "stockWarehouseObj": {
    "56c41a9e632771df68dbae0b": 0,
    "564ab6de2bde80bd10a9bc60": 0,
    "56332196594b09af6e6c7dd7": 0,
    "56332187594b09af6e6c7dd2": 28
  },
  "outOfStock": false,
  "id": "55ffc3517e6977d44a77bc71"
}

```
