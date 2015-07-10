# User

## Group

| Name    | Groups                        | Desc       |
|:--------|:------------------------------|:-----------|
| guest   | guest, member, admin, partner | 游客(默认) |
| member  | member, admin                 | 普通用户   |
| admin   | admin                         | 管理员     |
| partner | partner, admin                | 合作方     |



###  头像字段 avatarPic
| Name      | Type   | Desc   |
|:-------   |:-------|:-------|
| avatarPic | String | 头像字段 |



## User 范例
```js

{
  "_id": "559e28764fa0f11b1d26eacc",
  "modifiedAt": "2015-07-10T09:14:26.781Z",
  "createdAt": "2015-07-09T07:53:26.966Z",
  "autoIncrementId": 10002,
  "mobile": "13564568304",
  "__v": 4,
  "dishLikeList": [
    {
      "_id": "558a602a3eba152266ff2b8c",
      "modifiedAt": "2015-07-09T10:20:28.264Z",
      "createdAt": "2015-07-09T10:16:21.595Z",
      "autoIncrementId": 10007,
      "sortId": 100,
      "cookingType": "ready to cook",
      "sideDishType": "main",
      "setType": "single",
      "difficulty": 2,
      "time": 15,
      "servings": 1,
      "priceOriginal": 48,
      "__v": 2,
      "recommendSet": [],
      "priceWholesale": [
        {
          "quantity": 4,
          "price": 42,
          "_id": "559e49f51d9b9ef438566718"
        }
      ],
      "cook": {
        "user": "5583c96c7313f6c849c3aeb1",
        "tips": {
          "zh": "一般般",
          "en": "not bad"
        }
      },
      "tagFilter": [
        "5590d256103f46d9ac31e3ee",
        "5590d256103f46d9ac31e3f2"
      ],
      "region": [],
      "infoCookingStep": [
        {
          "contentType": "txt",
          "_id": "559e49f51d9b9ef43856671a",
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
          "_id": "559e49f51d9b9ef438566719",
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
          "_id": "559e49f51d9b9ef43856671c",
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
          "_id": "559e49f51d9b9ef43856671b",
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
          "_id": "559e49f51d9b9ef43856671e",
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
          "_id": "559e49f51d9b9ef43856671d",
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
          "_id": "559e49f51d9b9ef43856671f"
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
      "isPublished": true,
      "publishedAt": "2015-07-09T10:16:21.571Z"
    },
    {
      "_id": "558a602a3eba152266ff2b8c",
      "modifiedAt": "2015-07-09T10:20:28.264Z",
      "createdAt": "2015-07-09T10:16:21.595Z",
      "autoIncrementId": 10007,
      "sortId": 100,
      "cookingType": "ready to cook",
      "sideDishType": "main",
      "setType": "single",
      "difficulty": 2,
      "time": 15,
      "servings": 1,
      "priceOriginal": 48,
      "__v": 2,
      "recommendSet": [],
      "priceWholesale": [
        {
          "quantity": 4,
          "price": 42,
          "_id": "559e49f51d9b9ef438566718"
        }
      ],
      "cook": {
        "user": "5583c96c7313f6c849c3aeb1",
        "tips": {
          "zh": "一般般",
          "en": "not bad"
        }
      },
      "tagFilter": [
        "5590d256103f46d9ac31e3ee",
        "5590d256103f46d9ac31e3f2"
      ],
      "region": [],
      "infoCookingStep": [
        {
          "contentType": "txt",
          "_id": "559e49f51d9b9ef43856671a",
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
          "_id": "559e49f51d9b9ef438566719",
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
          "_id": "559e49f51d9b9ef43856671c",
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
          "_id": "559e49f51d9b9ef43856671b",
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
          "_id": "559e49f51d9b9ef43856671e",
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
          "_id": "559e49f51d9b9ef43856671d",
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
          "_id": "559e49f51d9b9ef43856671f"
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
      "isPublished": true,
      "publishedAt": "2015-07-09T10:16:21.571Z"
    }
  ],
  "couponList": [],
  "shoppingCart": [
    {
      "dish": {
        "_id": "558a602a3eba152266ff2b8c",
        "modifiedAt": "2015-07-09T10:20:28.264Z",
        "createdAt": "2015-07-09T10:16:21.595Z",
        "autoIncrementId": 10007,
        "sortId": 100,
        "cookingType": "ready to cook",
        "sideDishType": "main",
        "setType": "single",
        "difficulty": 2,
        "time": 15,
        "servings": 1,
        "priceOriginal": 48,
        "__v": 2,
        "recommendSet": [],
        "priceWholesale": [
          {
            "quantity": 4,
            "price": 42,
            "_id": "559e49f51d9b9ef438566718"
          }
        ],
        "cook": {
          "user": "5583c96c7313f6c849c3aeb1",
          "tips": {
            "zh": "一般般",
            "en": "not bad"
          }
        },
        "tagFilter": [
          "5590d256103f46d9ac31e3ee",
          "5590d256103f46d9ac31e3f2"
        ],
        "region": [],
        "infoCookingStep": [
          {
            "contentType": "txt",
            "_id": "559e49f51d9b9ef43856671a",
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
            "_id": "559e49f51d9b9ef438566719",
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
            "_id": "559e49f51d9b9ef43856671c",
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
            "_id": "559e49f51d9b9ef43856671b",
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
            "_id": "559e49f51d9b9ef43856671e",
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
            "_id": "559e49f51d9b9ef43856671d",
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
            "_id": "559e49f51d9b9ef43856671f"
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
        "isPublished": true,
        "publishedAt": "2015-07-09T10:16:21.571Z"
      },
      "number": 1,
      "_id": "559f8cf26058e60f78b288fe",
      "subDish": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-07-09T10:16:21.545Z",
            "createdAt": "2015-07-09T10:16:21.545Z",
            "autoIncrementId": 10000,
            "sortId": 100,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "recommendSet": [],
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
            "isPublished": true,
            "publishedAt": "2015-07-09T10:16:21.526Z"
          },
          "number": 1,
          "_id": "559f8cf26058e60f78b28901"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-07-09T10:16:21.560Z",
            "createdAt": "2015-07-09T10:16:21.560Z",
            "autoIncrementId": 10003,
            "sortId": 202,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 15,
            "__v": 0,
            "recommendSet": [],
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
            "isPublished": true,
            "publishedAt": "2015-07-09T10:16:21.532Z"
          },
          "number": 1,
          "_id": "559f8cf26058e60f78b28900"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-07-09T10:16:21.545Z",
            "createdAt": "2015-07-09T10:16:21.545Z",
            "autoIncrementId": 10005,
            "sortId": 501,
            "cookingType": "ready to cook",
            "sideDishType": "topping",
            "priceOriginal": 20,
            "__v": 0,
            "recommendSet": [],
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
            "isPublished": true,
            "publishedAt": "2015-07-09T10:16:21.534Z"
          },
          "number": 2,
          "_id": "559f8cf26058e60f78b288ff"
        }
      ]
    },
    {
      "dish": {
        "_id": "558a602a3eba152266ff2b8c",
        "modifiedAt": "2015-07-09T10:20:28.264Z",
        "createdAt": "2015-07-09T10:16:21.595Z",
        "autoIncrementId": 10007,
        "sortId": 100,
        "cookingType": "ready to cook",
        "sideDishType": "main",
        "setType": "single",
        "difficulty": 2,
        "time": 15,
        "servings": 1,
        "priceOriginal": 48,
        "__v": 2,
        "recommendSet": [],
        "priceWholesale": [
          {
            "quantity": 4,
            "price": 42,
            "_id": "559e49f51d9b9ef438566718"
          }
        ],
        "cook": {
          "user": "5583c96c7313f6c849c3aeb1",
          "tips": {
            "zh": "一般般",
            "en": "not bad"
          }
        },
        "tagFilter": [
          "5590d256103f46d9ac31e3ee",
          "5590d256103f46d9ac31e3f2"
        ],
        "region": [],
        "infoCookingStep": [
          {
            "contentType": "txt",
            "_id": "559e49f51d9b9ef43856671a",
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
            "_id": "559e49f51d9b9ef438566719",
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
            "_id": "559e49f51d9b9ef43856671c",
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
            "_id": "559e49f51d9b9ef43856671b",
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
            "_id": "559e49f51d9b9ef43856671e",
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
            "_id": "559e49f51d9b9ef43856671d",
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
            "_id": "559e49f51d9b9ef43856671f"
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
        "isPublished": true,
        "publishedAt": "2015-07-09T10:16:21.571Z"
      },
      "number": 1,
      "_id": "559f8cf26058e60f78b288fa",
      "subDish": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-07-09T10:16:21.545Z",
            "createdAt": "2015-07-09T10:16:21.545Z",
            "autoIncrementId": 10000,
            "sortId": 100,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "recommendSet": [],
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
            "isPublished": true,
            "publishedAt": "2015-07-09T10:16:21.526Z"
          },
          "number": 1,
          "_id": "559f8cf26058e60f78b288fd"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-07-09T10:16:21.560Z",
            "createdAt": "2015-07-09T10:16:21.560Z",
            "autoIncrementId": 10003,
            "sortId": 202,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 15,
            "__v": 0,
            "recommendSet": [],
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
            "isPublished": true,
            "publishedAt": "2015-07-09T10:16:21.532Z"
          },
          "number": 1,
          "_id": "559f8cf26058e60f78b288fc"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-07-09T10:16:21.545Z",
            "createdAt": "2015-07-09T10:16:21.545Z",
            "autoIncrementId": 10005,
            "sortId": 501,
            "cookingType": "ready to cook",
            "sideDishType": "topping",
            "priceOriginal": 20,
            "__v": 0,
            "recommendSet": [],
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
            "isPublished": true,
            "publishedAt": "2015-07-09T10:16:21.534Z"
          },
          "number": 2,
          "_id": "559f8cf26058e60f78b288fb"
        }
      ]
    }
  ],
  "isPromoOn": true,
  "isSpam": false,
  "credit": 0,
  "address": [
    {
      "geoLatitude": 20,
      "geoLongitude": 20,
      "country": "china",
      "province": "shanghai",
      "city": "shanghai",
      "district": "shanghai",
      "street": "枫林路",
      "address": "510号",
      "contactPerson": "xinwei",
      "mobile": "13564568304",
      "alias": "",
      "remark": "",
      "_id": "559f8cef6058e60f78b288f8",
      "sortOrder": 0,
      "isDefault": false,
      "isValid": false,
      "isTemporary": false
    }
  ],
  "group": "member"
}

```

