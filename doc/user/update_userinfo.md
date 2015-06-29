## Req

PUT `/user`

Group `member`


### Body
| Name                  | Type   | Desc    |
|:-------               |:-------|:------- |
| address               | Array  | 收货地址  |
|   -> geoLatitude      | Number | 纬度     |
|   -> geoLongitude     | Number | 经度     |
|   -> country          | String | 国家     |
|   -> province         | String | 省       |
|   -> city             | String | 市       |
|   -> district         | String | 区       |
|   -> street           | String | 街道      |
|   -> address          | String | 详细地    |
|   -> contactPerson    | String | 联系人    |
|   -> mobile           | String | 手机    |
|   -> alias            | String | 别名    |
|   -> remark           | String | 备注    |
|   -> isTemporary      | Boolean | 是否是临时地址  |
|   -> isDefault        | Boolean | 默认地址  |



```js
{
    "address":[
        {
            "geoLatitude" : 20,
            "geoLongitude" : 20,

            "country" : "china",
            "province": "shanghai",
            "city": "shanghai",
            "district": "shanghai",
            "street" : "枫林路",
            "address": "510号",

            "isTemporary" : false,
            "isDefault":  false,

            "contactPerson": "xinwei",
            "mobile": "13564568304",
            "alias": "",
            "remark": ""
        }
    ]
}
```



## Res
### Body


> 返回的数据中 pwd 密码字段会排除掉

```js
{
  "_id": "5582903e4eb98f251a0478d4",
  "modifiedAt": "2015-06-25T07:31:53.103Z",
  "createdAt": "2015-06-18T09:32:46.692Z",
  "id": 1,
  "mobile": "18600000000",
  "cart": [],
  "address": [],
  "__v": 18,
  "shoppingCart": [
    {
      "dish": {
        "_id": "558a602a3eba152266ff2b8c",
        "modifiedAt": "2015-06-25T04:25:36.643Z",
        "createdAt": "2015-06-25T04:25:36.643Z",
        "sortId": 100,
        "cookingType": "ready to cook",
        "sideDishType": "main",
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
            "_id": "558b82c069943ad7b259401a",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b92",
                "_id": "558b82c069943ad7b259401c",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b93",
                "_id": "558b82c069943ad7b259401b",
                "default": false
              }
            ],
            "name": {
              "zh": "牛肉",
              "en": "beef"
            }
          },
          {
            "_id": "558b82c069943ad7b2594016",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b94",
                "_id": "558b82c069943ad7b2594019",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b95",
                "_id": "558b82c069943ad7b2594018",
                "default": false
              },
              {
                "dish": "5583b7faa2845dec35276b96",
                "_id": "558b82c069943ad7b2594017",
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
            "_id": "558b82c069943ad7b259401d"
          }
        ],
        "cook": {
          "user": "5583c96c7313f6c849c3aeb1",
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
            "_id": "558b82c069943ad7b259401f",
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
            "_id": "558b82c069943ad7b259401e",
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
            "_id": "558b82c069943ad7b2594021",
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
            "_id": "558b82c069943ad7b2594020",
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
            "_id": "558b82c069943ad7b2594023",
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
            "_id": "558b82c069943ad7b2594022",
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
            "_id": "558b82c069943ad7b2594024"
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
        "publishedAt": "2015-06-25T04:25:36.607Z"
      },
      "number": 1,
      "_id": "558b8b56c3c6064cbca10585",
      "subDish": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-06-25T04:25:36.582Z",
            "createdAt": "2015-06-25T04:25:36.582Z",
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
            "publishedAt": "2015-06-25T04:25:36.566Z"
          },
          "number": 1,
          "_id": "558b8b56c3c6064cbca10588"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-06-25T04:25:36.583Z",
            "createdAt": "2015-06-25T04:25:36.583Z",
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
            "publishedAt": "2015-06-25T04:25:36.574Z"
          },
          "number": 1,
          "_id": "558b8b56c3c6064cbca10587"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-06-25T04:25:36.584Z",
            "createdAt": "2015-06-25T04:25:36.584Z",
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
            "publishedAt": "2015-06-25T04:25:36.577Z"
          },
          "number": 2,
          "_id": "558b8b56c3c6064cbca10586"
        }
      ]
    },
    {
      "dish": {
        "_id": "558a602a3eba152266ff2b8c",
        "modifiedAt": "2015-06-25T04:25:36.643Z",
        "createdAt": "2015-06-25T04:25:36.643Z",
        "sortId": 100,
        "cookingType": "ready to cook",
        "sideDishType": "main",
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
            "_id": "558b82c069943ad7b259401a",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b92",
                "_id": "558b82c069943ad7b259401c",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b93",
                "_id": "558b82c069943ad7b259401b",
                "default": false
              }
            ],
            "name": {
              "zh": "牛肉",
              "en": "beef"
            }
          },
          {
            "_id": "558b82c069943ad7b2594016",
            "foodMaterial": [
              {
                "dish": "5583b7faa2845dec35276b94",
                "_id": "558b82c069943ad7b2594019",
                "default": true
              },
              {
                "dish": "5583b7faa2845dec35276b95",
                "_id": "558b82c069943ad7b2594018",
                "default": false
              },
              {
                "dish": "5583b7faa2845dec35276b96",
                "_id": "558b82c069943ad7b2594017",
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
            "_id": "558b82c069943ad7b259401d"
          }
        ],
        "cook": {
          "user": "5583c96c7313f6c849c3aeb1",
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
            "_id": "558b82c069943ad7b259401f",
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
            "_id": "558b82c069943ad7b259401e",
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
            "_id": "558b82c069943ad7b2594021",
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
            "_id": "558b82c069943ad7b2594020",
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
            "_id": "558b82c069943ad7b2594023",
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
            "_id": "558b82c069943ad7b2594022",
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
            "_id": "558b82c069943ad7b2594024"
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
        "publishedAt": "2015-06-25T04:25:36.607Z"
      },
      "number": 1,
      "_id": "558b8b56c3c6064cbca10581",
      "subDish": [
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-06-25T04:25:36.582Z",
            "createdAt": "2015-06-25T04:25:36.582Z",
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
            "publishedAt": "2015-06-25T04:25:36.566Z"
          },
          "number": 1,
          "_id": "558b8b56c3c6064cbca10584"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-06-25T04:25:36.583Z",
            "createdAt": "2015-06-25T04:25:36.583Z",
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
            "publishedAt": "2015-06-25T04:25:36.574Z"
          },
          "number": 1,
          "_id": "558b8b56c3c6064cbca10583"
        },
        {
          "dish": {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-06-25T04:25:36.584Z",
            "createdAt": "2015-06-25T04:25:36.584Z",
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
            "publishedAt": "2015-06-25T04:25:36.577Z"
          },
          "number": 2,
          "_id": "558b8b56c3c6064cbca10582"
        }
      ]
    }
  ],
  "isPromoOn": true,
  "isSpam": false,
  "credit": 0,
  "info": [],
  "group": "member"
}
```

[User](../User)