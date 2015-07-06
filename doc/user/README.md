# User

## Group

| Name    | Groups                        | Desc       |
|:--------|:------------------------------|:-----------|
| guest   | guest, member, admin, partner | 游客(默认) |
| member  | member, admin                 | 普通用户   |
| admin   | admin                         | 管理员     |
| partner | partner, admin                | 合作方     |





## User 范例
```js

{
  "_id": "5582903e4eb98f251a0478d4",
  "modifiedAt": "2015-07-01T10:36:56.892Z",
  "createdAt": "2015-06-18T09:32:46.692Z",
  "id": 1,
  "mobile": "18600000000",
  "__v": 35,
  "couponList": [
    {
      "_id": "55926f4e06d06ab2835cc453",
      "modifiedAt": "2015-07-01T10:31:31.708Z",
      "createdAt": "2015-06-30T10:31:36.465Z",
      "price": 1,
      "code": "WYEcSUDJHW",
      "__v": 0,
      "user": "5582903e4eb98f251a0478d4",
      "isExpired": false,
      "isUsed": false,
      "endDate": "2015-07-30T10:31:26.000Z",
      "startDate": "2015-06-30T10:31:26.000Z",
      "priceLimit": 100,
      "name": {
        "zh": "优惠券444",
        "en": "coupon444"
      }
    },
    {
      "_id": "55926f10d5eb6b6f834dec8d",
      "modifiedAt": "2015-07-01T10:32:55.641Z",
      "createdAt": "2015-06-30T10:31:36.464Z",
      "price": 1,
      "code": "WZxcDhcrca",
      "__v": 0,
      "user": "5582903e4eb98f251a0478d4",
      "isExpired": false,
      "isUsed": false,
      "endDate": "2015-07-30T10:31:26.000Z",
      "startDate": "2015-06-30T10:31:26.000Z",
      "priceLimit": 10,
      "name": {
        "zh": "优惠券111",
        "en": "coupon111"
      }
    },
    {
      "_id": "55926f4b06d06ab2835cc444",
      "modifiedAt": "2015-07-01T10:36:56.889Z",
      "createdAt": "2015-06-30T10:31:36.464Z",
      "price": 2,
      "code": "XZfpRTG3dt",
      "__v": 0,
      "user": "5582903e4eb98f251a0478d4",
      "isExpired": false,
      "isUsed": false,
      "endDate": "2015-07-30T10:31:26.000Z",
      "startDate": "2015-06-30T10:31:26.000Z",
      "priceLimit": 10,
      "name": {
        "zh": "优惠券222",
        "en": "coupon222"
      }
    }
  ],
  "shoppingCart": [
    {
      "dish": {
        "_id": "558a602a3eba152266ff2b8c",
        "modifiedAt": "2015-06-29T06:10:56.198Z",
        "createdAt": "2015-06-29T06:10:56.198Z",
        "sortId": 100,
        "cookingType": "ready to cook",
        "sideDishType": "main",
        "setType": "single",
        "difficulty": 2,
        "time": 15,
        "servings": 1,
        "priceOriginal": 48,
        "__v": 0,
        "statisticViews": 0,
        "statisticLike": 0,
        "statisticSales": 0,
        "statisticHot": 0,
        "recommendSet": [],
        "topping": [
          "5583b7faa2845dec35276b97",
          "5583b7faa2845dec35276b98"
        ],
        "preferences": [
          {
            "_id": "5590e17018048fd1b05425f8",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b92",
                "_id": "5590e17018048fd1b05425fa",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b93",
                "_id": "5590e17018048fd1b05425f9",
                "default": false
              }
            ],
            "name": {
              "zh": "牛肉",
              "en": "beef"
            }
          },
          {
            "_id": "5590e17018048fd1b05425f4",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b94",
                "_id": "5590e17018048fd1b05425f7",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b95",
                "_id": "5590e17018048fd1b05425f6",
                "default": false
              },
              {
                "dish": "5583b7faa2845dec35276b96",
                "_id": "5590e17018048fd1b05425f5",
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
            "_id": "5590e17018048fd1b05425fb"
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
            "_id": "5590e17018048fd1b05425fd",
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
            "_id": "5590e17018048fd1b05425fc",
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
            "_id": "5590e17018048fd1b05425ff",
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
            "_id": "5590e17018048fd1b05425fe",
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
            "_id": "5590e17018048fd1b0542601",
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
            "_id": "5590e17018048fd1b0542600",
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
            "_id": "5590e17018048fd1b0542602"
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
        "publishedAt": "2015-06-29T06:10:56.178Z"
      },
      "number": 1,
      "_id": "55921372346b694d27a63956",
      "subDish": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-06-29T06:10:56.159Z",
            "createdAt": "2015-06-29T06:10:56.159Z",
            "sortId": 100,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLike": 0,
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
            "isPublished": true,
            "publishedAt": "2015-06-29T06:10:56.142Z"
          },
          "number": 1,
          "_id": "55921372346b694d27a63959"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-06-29T06:10:56.160Z",
            "createdAt": "2015-06-29T06:10:56.160Z",
            "sortId": 202,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 15,
            "__v": 0,
            "statisticViews": 0,
            "statisticLike": 0,
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
            "isPublished": true,
            "publishedAt": "2015-06-29T06:10:56.149Z"
          },
          "number": 1,
          "_id": "55921372346b694d27a63958"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-06-29T06:10:56.161Z",
            "createdAt": "2015-06-29T06:10:56.161Z",
            "sortId": 501,
            "cookingType": "ready to cook",
            "sideDishType": "topping",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLike": 0,
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
            "isPublished": true,
            "publishedAt": "2015-06-29T06:10:56.154Z"
          },
          "number": 2,
          "_id": "55921372346b694d27a63957"
        }
      ]
    },
    {
      "dish": {
        "_id": "558a602a3eba152266ff2b8c",
        "modifiedAt": "2015-06-29T06:10:56.198Z",
        "createdAt": "2015-06-29T06:10:56.198Z",
        "sortId": 100,
        "cookingType": "ready to cook",
        "sideDishType": "main",
        "setType": "single",
        "difficulty": 2,
        "time": 15,
        "servings": 1,
        "priceOriginal": 48,
        "__v": 0,
        "statisticViews": 0,
        "statisticLike": 0,
        "statisticSales": 0,
        "statisticHot": 0,
        "recommendSet": [],
        "topping": [
          "5583b7faa2845dec35276b97",
          "5583b7faa2845dec35276b98"
        ],
        "preferences": [
          {
            "_id": "5590e17018048fd1b05425f8",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b92",
                "_id": "5590e17018048fd1b05425fa",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b93",
                "_id": "5590e17018048fd1b05425f9",
                "default": false
              }
            ],
            "name": {
              "zh": "牛肉",
              "en": "beef"
            }
          },
          {
            "_id": "5590e17018048fd1b05425f4",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b94",
                "_id": "5590e17018048fd1b05425f7",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b95",
                "_id": "5590e17018048fd1b05425f6",
                "default": false
              },
              {
                "dish": "5583b7faa2845dec35276b96",
                "_id": "5590e17018048fd1b05425f5",
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
            "_id": "5590e17018048fd1b05425fb"
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
            "_id": "5590e17018048fd1b05425fd",
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
            "_id": "5590e17018048fd1b05425fc",
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
            "_id": "5590e17018048fd1b05425ff",
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
            "_id": "5590e17018048fd1b05425fe",
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
            "_id": "5590e17018048fd1b0542601",
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
            "_id": "5590e17018048fd1b0542600",
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
            "_id": "5590e17018048fd1b0542602"
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
        "publishedAt": "2015-06-29T06:10:56.178Z"
      },
      "number": 1,
      "_id": "55921372346b694d27a63952",
      "subDish": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-06-29T06:10:56.159Z",
            "createdAt": "2015-06-29T06:10:56.159Z",
            "sortId": 100,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLike": 0,
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
            "isPublished": true,
            "publishedAt": "2015-06-29T06:10:56.142Z"
          },
          "number": 1,
          "_id": "55921372346b694d27a63955"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-06-29T06:10:56.160Z",
            "createdAt": "2015-06-29T06:10:56.160Z",
            "sortId": 202,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 15,
            "__v": 0,
            "statisticViews": 0,
            "statisticLike": 0,
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
            "isPublished": true,
            "publishedAt": "2015-06-29T06:10:56.149Z"
          },
          "number": 1,
          "_id": "55921372346b694d27a63954"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-06-29T06:10:56.161Z",
            "createdAt": "2015-06-29T06:10:56.161Z",
            "sortId": 501,
            "cookingType": "ready to cook",
            "sideDishType": "topping",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLike": 0,
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
            "isPublished": true,
            "publishedAt": "2015-06-29T06:10:56.154Z"
          },
          "number": 2,
          "_id": "55921372346b694d27a63953"
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
      "_id": "55921363346b694d27a63950",
      "isDefault": false,
      "isValid": false,
      "isTemporary": false
    }
  ],
  "group": "member",
  "dishLikeList": [
    {
      "_id": "558a602a3eba152266ff2b8c",
      "modifiedAt": "2015-07-06T09:34:45.910Z",
      "createdAt": "2015-07-06T06:16:42.076Z",
      "sortId": 100,
      "cookingType": "ready to cook",
      "sideDishType": "main",
      "setType": "single",
      "difficulty": 2,
      "time": 15,
      "servings": 1,
      "priceOriginal": 48,
      "__v": 37,
      "statisticViews": 0,
      "statisticLikeUserList": [
        "559a1d9dfd69a2071deac899"
      ],
      "statisticLike": 1,
      "statisticSales": 0,
      "statisticHot": 0,
      "recommendSet": [],
      "topping": [
        "5583b7faa2845dec35276b97",
        "5583b7faa2845dec35276b98"
      ],
      "preferences": [
        {
          "_id": "559a1d4afd69a2071deac879",
          "foodMaterial": [
            {
              "dish": "5583b7faa2845dec35276b92",
              "_id": "559a1d4afd69a2071deac87b",
              "default": true
            },
            {
              "dish": "5583b7faa2845dec35276b93",
              "_id": "559a1d4afd69a2071deac87a",
              "default": false
            }
          ],
          "name": {
            "zh": "牛肉",
            "en": "beef"
          }
        },
        {
          "_id": "559a1d4afd69a2071deac875",
          "foodMaterial": [
            {
              "dish": "5583b7faa2845dec35276b94",
              "_id": "559a1d4afd69a2071deac878",
              "default": true
            },
            {
              "dish": "5583b7faa2845dec35276b95",
              "_id": "559a1d4afd69a2071deac877",
              "default": false
            },
            {
              "dish": "5583b7faa2845dec35276b96",
              "_id": "559a1d4afd69a2071deac876",
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
          "_id": "559a1d4afd69a2071deac87c"
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
          "_id": "559a1d4afd69a2071deac87e",
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
          "_id": "559a1d4afd69a2071deac87d",
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
          "_id": "559a1d4afd69a2071deac880",
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
          "_id": "559a1d4afd69a2071deac87f",
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
          "_id": "559a1d4afd69a2071deac882",
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
          "_id": "559a1d4afd69a2071deac881",
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
          "_id": "559a1d4afd69a2071deac883"
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
      "publishedAt": "2015-07-06T06:16:42.049Z"
    },
    {
      "_id": "558a602a3eba152266ff2b8c",
      "modifiedAt": "2015-07-06T09:34:45.910Z",
      "createdAt": "2015-07-06T06:16:42.076Z",
      "sortId": 100,
      "cookingType": "ready to cook",
      "sideDishType": "main",
      "setType": "single",
      "difficulty": 2,
      "time": 15,
      "servings": 1,
      "priceOriginal": 48,
      "__v": 37,
      "statisticViews": 0,
      "statisticLikeUserList": [
        "559a1d9dfd69a2071deac899"
      ],
      "statisticLike": 1,
      "statisticSales": 0,
      "statisticHot": 0,
      "recommendSet": [],
      "topping": [
        "5583b7faa2845dec35276b97",
        "5583b7faa2845dec35276b98"
      ],
      "preferences": [
        {
          "_id": "559a1d4afd69a2071deac879",
          "foodMaterial": [
            {
              "dish": "5583b7faa2845dec35276b92",
              "_id": "559a1d4afd69a2071deac87b",
              "default": true
            },
            {
              "dish": "5583b7faa2845dec35276b93",
              "_id": "559a1d4afd69a2071deac87a",
              "default": false
            }
          ],
          "name": {
            "zh": "牛肉",
            "en": "beef"
          }
        },
        {
          "_id": "559a1d4afd69a2071deac875",
          "foodMaterial": [
            {
              "dish": "5583b7faa2845dec35276b94",
              "_id": "559a1d4afd69a2071deac878",
              "default": true
            },
            {
              "dish": "5583b7faa2845dec35276b95",
              "_id": "559a1d4afd69a2071deac877",
              "default": false
            },
            {
              "dish": "5583b7faa2845dec35276b96",
              "_id": "559a1d4afd69a2071deac876",
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
          "_id": "559a1d4afd69a2071deac87c"
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
          "_id": "559a1d4afd69a2071deac87e",
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
          "_id": "559a1d4afd69a2071deac87d",
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
          "_id": "559a1d4afd69a2071deac880",
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
          "_id": "559a1d4afd69a2071deac87f",
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
          "_id": "559a1d4afd69a2071deac882",
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
          "_id": "559a1d4afd69a2071deac881",
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
          "_id": "559a1d4afd69a2071deac883"
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
      "publishedAt": "2015-07-06T06:16:42.049Z"
    }
  ]
}

```

