# Dish 菜品

```js



{
  "_id": "",
  "publishedAt": "", # 发布时间
  "sortId": "", # 排序值
  "isPublished": false, # 是否已发布

  "cookingType": "ready to cook", # ready to cook, ready to eat

  "sideDishType": "main", #主菜或配菜  main主菜 / topping浇头 / preferences菜属性


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
  "_id": "5583d19b66b1ff4b530d5567",
  "modifiedAt": "2015-06-19T08:23:55.116Z",
  "createdAt": "2015-06-19T08:23:55.116Z",
  "sortId": 100,
  "sideDishType": "main",
  "difficulty": 2,
  "time": 15,
  "servings": 1,
  "priceOriginal": 48,
  "__v": 0,
  "statisticViews": 0,
  "statisticLikes": 0,
  "statisticSales": 0,
  "statisticHot": 0,
  "recommendSet": [],
  "topping": [
    {
      "_id": "5583b7faa2845dec35276b97",
      "modifiedAt": "2015-06-19T08:13:25.672Z",
      "createdAt": "2015-06-19T08:13:25.672Z",
      "sortId": 501,
      "sideDishType": "topping",
      "priceOriginal": 20,
      "__v": 0,
      "statisticViews": 0,
      "statisticLikes": 0,
      "statisticSales": 0,
      "statisticHot": 0,
      "recommendSet": [],
      "topping": [],
      "preferences": [],
      "priceWholesale": [],
      "tagFilter": [],
      "region": [],
      "infoCookingStep": [],
      "infoIngredient": [],
      "infoUniqueFeature": [],
      "kitchenware": [],
      "cover": [],
      "title": {
        "zh": "澳牛",
        "en": "aoniu"
      },
      "cookingType": "ready to cook",
      "isPublished": true,
      "publishedAt": "2015-06-19T08:13:25.662Z"
    },
    {
      "_id": "5583b7faa2845dec35276b98",
      "modifiedAt": "2015-06-19T08:13:25.673Z",
      "createdAt": "2015-06-19T08:13:25.673Z",
      "sortId": 502,
      "sideDishType": "topping",
      "priceOriginal": 25,
      "__v": 0,
      "statisticViews": 0,
      "statisticLikes": 0,
      "statisticSales": 0,
      "statisticHot": 0,
      "recommendSet": [],
      "topping": [],
      "preferences": [],
      "priceWholesale": [],
      "tagFilter": [],
      "region": [],
      "infoCookingStep": [],
      "infoIngredient": [],
      "infoUniqueFeature": [],
      "kitchenware": [],
      "cover": [],
      "title": {
        "zh": "和牛",
        "en": "heniu"
      },
      "cookingType": "ready to cook",
      "isPublished": true,
      "publishedAt": "2015-06-19T08:13:25.664Z"
    }
  ],
  "preferences": [
    {
      "_id": "5583d19b66b1ff4b530d556c",
      "foodMaterial": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-06-19T08:13:25.666Z",
            "createdAt": "2015-06-19T08:13:25.666Z",
            "sortId": 100,
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikes": 0,
            "statisticSales": 0,
            "statisticHot": 0,
            "recommendSet": [],
            "topping": [],
            "preferences": [],
            "priceWholesale": [],
            "tagFilter": [],
            "region": [],
            "infoCookingStep": [],
            "infoIngredient": [],
            "infoUniqueFeature": [],
            "kitchenware": [],
            "cover": [],
            "title": {
              "zh": "澳牛",
              "en": "aoniu"
            },
            "cookingType": "ready to cook",
            "isPublished": true,
            "publishedAt": "2015-06-19T08:13:25.649Z"
          },
          "_id": "5583d19b66b1ff4b530d556e",
          "default": true
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b93",
            "modifiedAt": "2015-06-19T08:13:25.671Z",
            "createdAt": "2015-06-19T08:13:25.671Z",
            "sortId": 101,
            "sideDishType": "preferences",
            "priceOriginal": 25,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikes": 0,
            "statisticSales": 0,
            "statisticHot": 0,
            "recommendSet": [],
            "topping": [],
            "preferences": [],
            "priceWholesale": [],
            "tagFilter": [],
            "region": [],
            "infoCookingStep": [],
            "infoIngredient": [],
            "infoUniqueFeature": [],
            "kitchenware": [],
            "cover": [],
            "title": {
              "zh": "和牛",
              "en": "heniu"
            },
            "cookingType": "ready to cook",
            "isPublished": true,
            "publishedAt": "2015-06-19T08:13:25.655Z"
          },
          "_id": "5583d19b66b1ff4b530d556d",
          "default": false
        }
      ],
      "name": {
        "zh": "牛肉",
        "en": "beef"
      }
    },
    {
      "_id": "5583d19b66b1ff4b530d5568",
      "foodMaterial": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b94",
            "modifiedAt": "2015-06-19T08:13:25.671Z",
            "createdAt": "2015-06-19T08:13:25.671Z",
            "sortId": 201,
            "sideDishType": "preferences",
            "priceOriginal": 10,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikes": 0,
            "statisticSales": 0,
            "statisticHot": 0,
            "recommendSet": [],
            "topping": [],
            "preferences": [],
            "priceWholesale": [],
            "tagFilter": [],
            "region": [],
            "infoCookingStep": [],
            "infoIngredient": [],
            "infoUniqueFeature": [],
            "kitchenware": [],
            "cover": [],
            "title": {
              "zh": "茶树菇",
              "en": "chashugu"
            },
            "cookingType": "ready to cook",
            "isPublished": true,
            "publishedAt": "2015-06-19T08:13:25.657Z"
          },
          "_id": "5583d19b66b1ff4b530d556b",
          "default": true
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-06-19T08:13:25.672Z",
            "createdAt": "2015-06-19T08:13:25.672Z",
            "sortId": 202,
            "sideDishType": "preferences",
            "priceOriginal": 15,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikes": 0,
            "statisticSales": 0,
            "statisticHot": 0,
            "recommendSet": [],
            "topping": [],
            "preferences": [],
            "priceWholesale": [],
            "tagFilter": [],
            "region": [],
            "infoCookingStep": [],
            "infoIngredient": [],
            "infoUniqueFeature": [],
            "kitchenware": [],
            "cover": [],
            "title": {
              "zh": "香菇",
              "en": "xiaogu"
            },
            "cookingType": "ready to cook",
            "isPublished": true,
            "publishedAt": "2015-06-19T08:13:25.660Z"
          },
          "_id": "5583d19b66b1ff4b530d556a",
          "default": false
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b96",
            "modifiedAt": "2015-06-19T08:13:25.672Z",
            "createdAt": "2015-06-19T08:13:25.672Z",
            "sortId": 203,
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikes": 0,
            "statisticSales": 0,
            "statisticHot": 0,
            "recommendSet": [],
            "topping": [],
            "preferences": [],
            "priceWholesale": [],
            "tagFilter": [],
            "region": [],
            "infoCookingStep": [],
            "infoIngredient": [],
            "infoUniqueFeature": [],
            "kitchenware": [],
            "cover": [],
            "title": {
              "zh": "平菇",
              "en": "pinggu"
            },
            "cookingType": "ready to cook",
            "isPublished": true,
            "publishedAt": "2015-06-19T08:13:25.662Z"
          },
          "_id": "5583d19b66b1ff4b530d5569",
          "default": false
        }
      ],
      "name": {
        "zh": "菌菇",
        "en": "mushroom"
      }
    }
  ],
  "priceWholesale": [
    {
      "quantity": 4,
      "price": 42,
      "_id": "5583d19b66b1ff4b530d556f"
    }
  ],
  "cook": {
    "user": null,
    "tips": {
      "zh": "一般般",
      "en": "not bad"
    }
  },
  "tagFilter": [],
  "region": [],
  "infoCookingStep": [
    {
      "contentType": "txt",
      "_id": "5583d19b66b1ff4b530d5571",
      "value": {
        "zh": "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。",
        "en": "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
      },
      "title": {
        "zh": "准备工作",
        "en": "Preparation work"
      }
    },
    {
      "contentType": "txt",
      "_id": "5583d19b66b1ff4b530d5570",
      "value": {
        "zh": "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。",
        "en": "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."
      },
      "title": {
        "zh": "干煸茶树菇",
        "en": "Dry-fry the poplar mushroom"
      }
    }
  ],
  "infoIngredient": [
    {
      "contentType": "txt",
      "_id": "5583d19b66b1ff4b530d5573",
      "value": {
        "zh": "1/2个",
        "en": "1/2"
      },
      "title": {
        "zh": "彩椒",
        "en": "Bell Pepper"
      }
    },
    {
      "contentType": "txt",
      "_id": "5583d19b66b1ff4b530d5572",
      "value": {
        "zh": "1/4个",
        "en": "1/4"
      },
      "title": {
        "zh": "洋葱",
        "en": "Onion"
      }
    }
  ],
  "infoUniqueFeature": [
    {
      "contentType": "txt",
      "_id": "5583d19b66b1ff4b530d5575",
      "value": {
        "zh": "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。",
        "en": "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
      },
      "title": {
        "zh": "你知道吗？",
        "en": "Did you know?"
      }
    },
    {
      "contentType": "txt",
      "_id": "5583d19b66b1ff4b530d5574",
      "value": {
        "zh": "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。",
        "en": "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
      },
      "title": {
        "zh": "特点",
        "en": "Unique Feature"
      }
    }
  ],
  "kitchenware": [
    {
      "zh": "pan",
      "en": "pan",
      "_id": "5583d19b66b1ff4b530d5576"
    }
  ],
  "cover": [],
  "brief": {
    "zh": "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
    "en": "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
  },
  "title": {
    "zh": "干煸茶树菇孜然雪花牛柳",
    "en": "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
  },
  "cookingType": "ready to eat",
  "isPublished": true,
  "publishedAt": "2015-06-19T08:23:55.094Z"
}

```
