# Dish 菜品

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
  "_id": "55b1ed7843ffd0964028df9c",
  "modifiedAt": "2015-08-03T10:31:30.819Z",
  "createdAt": "2015-07-24T07:47:05.274Z",
  "autoIncrementId": 10529,
  "sortId": 1001,
  "cookingType": "ready to cook",
  "sideDishType": "main",
  "setType": "single",
  "difficulty": 2,
  "time": 10,
  "servings": 1,
  "priceOriginal": 48,
  "__v": 0,
  "statisticViews": 0,
  "statisticLikeUserList": [],
  "statisticLike": 0,
  "statisticSales": 0,
  "statisticHot": 0,
  "stock": 0,
  "recommendSet": [],
  "topping": [],
  "preferences": [],
  "priceWholesale": [],
  "tagFilter": [
    "5590d256103f46d9ac31e3eb",
    "5590d256103f46d9ac31e3f1",
    "5590d256103f46d9ac31e3f3",
    "5590d256103f46d9ac31e3f4"
  ],
  "region": [],
  "infoCookingStep": [
    {
      "contentType": "pic",
      "_id": "55b1ed7843ffd0964028e3d7",
      "sortId": 1,
      "value": {
        "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6042.jpg",
        "en": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6042.jpg"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3d6",
      "sortId": 1,
      "value": {
        "zh": "火龙果剥皮，一半切片，一半切丁。小芒果切丁。",
        "en": "Peel the pitaya, slice half of the fruit flesh, and dice the other half. Dice the mango flesh."
      },
      "title": {
        "zh": "准备工作",
        "en": "Preparation work"
      }
    },
    {
      "contentType": "pic",
      "_id": "55b1ed7843ffd0964028e3d5",
      "sortId": 2,
      "value": {
        "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6070.jpg",
        "en": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6070.jpg"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3d4",
      "sortId": 2,
      "value": {
        "zh": "不粘锅中火加热，抹少许黄油，倒入1/6薄饼浆，形成直径约10cm的圆饼，调小火煎至朝上的一面布满气泡，翻面煎1分钟，至底部呈棕黄色，取出。重复上述过程数次，直至薄饼浆用完。",
        "en": "Heat the pan over medium heat, add 1/3 of the butter, pour in 1/6 of the batter, forming a circle with diameter of 10 cm. Switch to low heat, pan-fry till the up side is full of bubbles. Flip side and fry for 1 minute till the bottom side turns brown, take out and set aside. Repeat the process for the remaining batter."
      },
      "title": {
        "zh": "制作薄饼",
        "en": "Make the pancake"
      }
    },
    {
      "contentType": "pic",
      "_id": "55b1ed7843ffd0964028e3d3",
      "sortId": 3,
      "value": {
        "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6091.jpg",
        "en": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6091.jpg"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3d2",
      "sortId": 3,
      "value": {
        "zh": "中火烧热平底锅，倒入水果酱，煮至冒泡，加入芒果丁，搅拌均匀。",
        "en": "Heat the pan over medium heat, add the jam, boil till bubbling. Add in diced mango, stir well."
      },
      "title": {
        "zh": "加热水果酱",
        "en": "Make the sauce"
      }
    },
    {
      "contentType": "pic",
      "_id": "55b1ed7843ffd0964028e3d1",
      "sortId": 4,
      "value": {
        "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6131.jpg",
        "en": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6131.jpg"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3d0",
      "sortId": 4,
      "value": {
        "zh": "盘中放上一块薄饼，铺一层火龙果片；再盖上一块薄饼，铺一层火龙果片，盖上一块薄饼。顶上铺一层火龙果粒，浇上水果酱，摆上蓝莓，筛一层糖粉，最后在中央摆上薄荷叶，根据个人口味蘸取糖油，即可享用。",
        "en": "Lay one piece of pancake on the plate, spread with sliced pitaya. Repeat the process. Lay diced pitaya on the top of the pancake tower, dress with fruit jam. Lay blueberries on the top, sift in the powdered sugar, lay the mint leaf in the center, dip with syrup to your taste and serve!"
      },
      "title": {
        "zh": "装盘",
        "en": "Plate your dish"
      }
    }
  ],
  "infoIngredient": [
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3e1",
      "sortId": 100,
      "value": {
        "zh": "1/2杯 薄饼浆",
        "en": "1/2 Cup House-made Batter"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3e0",
      "sortId": 100,
      "value": {
        "zh": "2汤匙 糖粉",
        "en": "2 Teaspoon Powdered Sugar"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3df",
      "sortId": 100,
      "value": {
        "zh": "1包 水果酱",
        "en": "1 Pack House-made Jam"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3de",
      "sortId": 100,
      "value": {
        "zh": "2汤匙 糖油",
        "en": "2 Teaspoon Syrup"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3dd",
      "sortId": 100,
      "value": {
        "zh": "1/2个 火龙果",
        "en": "1/2 Pitaya "
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3dc",
      "sortId": 100,
      "value": {
        "zh": "1个 小芒果",
        "en": "1 Mango"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3db",
      "sortId": 100,
      "value": {
        "zh": "2汤匙 蓝莓",
        "en": "2 Teaspoon Blueberry"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3da",
      "sortId": 100,
      "value": {
        "zh": "1汤匙 黄油",
        "en": "1 Teaspoon Butter"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3d9",
      "sortId": 100,
      "value": {
        "zh": "1片 薄荷叶",
        "en": "1 Mint Leaf"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "pic",
      "_id": "55b1ed7843ffd0964028e3d8",
      "sortId": 100,
      "value": {
        "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼食材图.jpg",
        "en": "https://dn-xinweicook.qbox.me/法式水果薄饼食材图.jpg"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "infoUniqueFeature": [
    {
      "contentType": "pic",
      "_id": "55b1ed7843ffd0964028e3e3",
      "sortId": 100,
      "value": {
        "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼diduknow.jpg",
        "en": "https://dn-xinweicook.qbox.me/法式水果薄饼diduknow.jpg"
      },
      "title": {
        "zh": "",
        "en": ""
      }
    },
    {
      "contentType": "txt",
      "_id": "55b1ed7843ffd0964028e3e2",
      "sortId": 100,
      "value": {
        "zh": "薄饼据说是在史前社会就存在的最古老的一种谷类食物，在公元前5世纪的诗歌中就可以找到用橄榄油煎的Pancake蘸蜂蜜和炼乳被当作早餐的记载。薄饼通常是一个圆形面饼在平底锅上烘烤而成，可根据自己的口味添加果酱、水果、糖浆、巧克力碎片等多种配料。",
        "en": "A pancake is a flat cake, often thin, and round, prepared from a starch-based batter and cooked on a hot surface such as a griddle or frying pan.They may be served at any time with a variety of toppings or fillings including jam, fruit, syrup, chocolate chips, or meat. Archaeological evidence suggests that pancakes are probably the earliest and most widespread cereal food eaten in prehistoric societies."
      },
      "title": {
        "zh": "薄饼",
        "en": "Pancake"
      }
    }
  ],
  "kitchenware": [
    {
      "zh": "pan",
      "en": "pan",
      "_id": "55b1ed7843ffd0964028e3e4"
    }
  ],
  "cover": [
    {
      "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6134.jpg",
      "en": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6134.jpg",
      "_id": "55b1ed7843ffd0964028e3e6"
    },
    {
      "zh": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6148.jpg",
      "en": "https://dn-xinweicook.qbox.me/法式水果薄饼s-_MG_6148.jpg",
      "_id": "55b1ed7843ffd0964028e3e5"
    }
  ],
  "brief": {
    "zh": "对于Pancake的爱不可取代，以至于你会找到城市里只卖各种口味薄饼的餐厅。在家自己动手，你可以更随心所欲，松软的薄饼和火龙果交替落成一座小山，在山顶码上水果，浇点果酱，再撒点糖粉，享受这个游戏般的过程吧，更何况你的游戏成果还很好吃！",
    "en": "Pancake is a worldwide love for breakfast and you can find pancake house almost everywhere. But homemade pancake is more you since you could add whatever you are fond of. Enjoy placing fruit and jam on top of your pancake as if it's a delicious game."
  },
  "shortTitle2": {
    "zh": "对于Pancake的爱不可取代，以至于你会找到城市里只卖各种口味薄饼的餐厅。在家自己动手，你可以更随心…",
    "en": "Pancake is a worldwide love for breakfast and you can find pancake house almost everywhere. But …"
  },
  "shortTitle1": {
    "zh": "松软薄饼搭配可口水果",
    "en": "Soft pancake topped with delicious fruits"
  },
  "title": {
    "zh": "法式水果松饼  ",
    "en": "Fruit Pancake"
  },
  "isFromAdminPanel": false,
  "isPublished": true,
  "publishedAt": "2015-07-24T07:47:04.950Z",
  "outOfStock": false,
  "id": "55b1ed7843ffd0964028df9c"
}

```
