# Order 订单


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| cookingType      | String   | "ready to cook" 或 "ready to eat"                   |
| status           | String   | 订单状态 not paid未支付 / paid已支付 / making dish制作中 / shipped已发货 / canceled已取消 / finished已完成     |
| payment          | String   | 支付方式 alipay direct / weixinpay / paypal          |
| isPaymentPaid    | Boolean  | 是否付款 未支付 false / 已支付 true                   |
| isSplitOrder     | Boolean  | 是否有子订单  无子订单 false / 有拆分的子订单 true    订单会生成三个订单，一个主订单（用于支付）和另外两个子订单（用于以后在用户中心的订单里面查询）。    |
| isChildOrder     | Boolean  | 是否是子订单  false / true       |
| childOrderList   | Array    | 主订单包括子订单的ID                                  |



## 订单 范例

```js
{
  "__v": 0,
  "modifiedAt": "2015-07-08T06:49:27.889Z",
  "createdAt": "2015-07-08T06:49:27.889Z",
  "id": 19,
  "orderNumber": "201507081449278223134",
  "user": "559a1d9dfd69a2071deac899",
  "cookingType": "ready to cook",
  "clientFrom": "ios",
  "payment": "alipay direct",
  "paymentUsedCash": false,
  "coupon": "5590d256103f46d9ac31e3ee",
  "promotionCode": "xxxxxxx",
  "credit": 0,
  "freight": 20,
  "dishesPrice": 246,
  "totalPrice": 266,
  "deliveryDateTime": "2015-06-13T02:00:00.000Z",
  "deliveryDate": "2015-06-13",
  "deliveryTime": "10",
  "_id": "559cc7f766835c3486630d75",
  "dishHistory": [
    {
      "_id": "5583b7faa2845dec35276b92",
      "modifiedAt": "2015-07-06T06:16:42.027Z",
      "createdAt": "2015-07-06T06:16:42.027Z",
      "sortId": 100,
      "cookingType": "ready to cook",
      "sideDishType": "preferences",
      "priceOriginal": 20,
      "__v": 0,
      "statisticViews": 0,
      "statisticLikeUserList": [],
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
      "publishedAt": "2015-07-06T06:16:42.015Z"
    },
    {
      "_id": "5583b7faa2845dec35276b95",
      "modifiedAt": "2015-07-06T06:16:42.027Z",
      "createdAt": "2015-07-06T06:16:42.027Z",
      "sortId": 202,
      "cookingType": "ready to cook",
      "sideDishType": "preferences",
      "priceOriginal": 15,
      "__v": 0,
      "statisticViews": 0,
      "statisticLikeUserList": [],
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
      "publishedAt": "2015-07-06T06:16:42.021Z"
    },
    {
      "_id": "5583b7faa2845dec35276b97",
      "modifiedAt": "2015-07-06T06:16:42.028Z",
      "createdAt": "2015-07-06T06:16:42.028Z",
      "sortId": 501,
      "cookingType": "ready to cook",
      "sideDishType": "topping",
      "priceOriginal": 20,
      "__v": 0,
      "statisticViews": 0,
      "statisticLikeUserList": [],
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
      "publishedAt": "2015-07-06T06:16:42.023Z"
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
    },
    {
      "_id": "559cbd81ec2d61f2798a1fda",
      "modifiedAt": "2015-07-08T06:04:49.208Z",
      "createdAt": "2015-07-08T06:04:49.208Z",
      "sortId": 99999,
      "cookingType": "ready to eat",
      "sideDishType": "main",
      "setType": "single",
      "difficulty": 2,
      "time": 15,
      "servings": 1,
      "priceOriginal": 48,
      "__v": 0,
      "statisticViews": 0,
      "statisticLikeUserList": [],
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
          "_id": "559cbd81ec2d61f2798a1fdf",
          "foodMaterial": [
            {
              "dish": "5583b7faa2845dec35276b92",
              "_id": "559cbd81ec2d61f2798a1fe1",
              "default": true
            },
            {
              "dish": "5583b7faa2845dec35276b93",
              "_id": "559cbd81ec2d61f2798a1fe0",
              "default": false
            }
          ],
          "name": {
            "zh": "牛肉",
            "en": "beef"
          }
        },
        {
          "_id": "559cbd81ec2d61f2798a1fdb",
          "foodMaterial": [
            {
              "dish": "5583b7faa2845dec35276b94",
              "_id": "559cbd81ec2d61f2798a1fde",
              "default": true
            },
            {
              "dish": "5583b7faa2845dec35276b95",
              "_id": "559cbd81ec2d61f2798a1fdd",
              "default": false
            },
            {
              "dish": "5583b7faa2845dec35276b96",
              "_id": "559cbd81ec2d61f2798a1fdc",
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
          "_id": "559cbd81ec2d61f2798a1fe2"
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
          "_id": "559cbd81ec2d61f2798a1fe4",
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
          "_id": "559cbd81ec2d61f2798a1fe3",
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
          "_id": "559cbd81ec2d61f2798a1fe6",
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
          "_id": "559cbd81ec2d61f2798a1fe5",
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
          "_id": "559cbd81ec2d61f2798a1fe8",
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
          "_id": "559cbd81ec2d61f2798a1fe7",
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
          "_id": "559cbd81ec2d61f2798a1fe9"
        }
      ],
      "cover": [],
      "brief": {
        "zh": "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
        "en": "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
      },
      "title": {
        "zh": "干煸茶树菇孜然雪花牛柳6-10",
        "en": "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
      },
      "isPublished": true,
      "publishedAt": "2015-07-08T06:04:49.165Z"
    }
  ],
  "dishList": [
    {
      "dish": "558a602a3eba152266ff2b8c",
      "number": 1,
      "_id": "559cc7f766835c3486630d7a",
      "subDish": [
        {
          "dish": "5583b7faa2845dec35276b92",
          "number": 1,
          "_id": "559cc7f766835c3486630d7d"
        },
        {
          "dish": "5583b7faa2845dec35276b95",
          "number": 1,
          "_id": "559cc7f766835c3486630d7c"
        },
        {
          "dish": "5583b7faa2845dec35276b97",
          "number": 2,
          "_id": "559cc7f766835c3486630d7b"
        }
      ]
    },
    {
      "dish": "559cbd81ec2d61f2798a1fda",
      "number": 1,
      "_id": "559cc7f766835c3486630d76",
      "subDish": [
        {
          "dish": "5583b7faa2845dec35276b92",
          "number": 1,
          "_id": "559cc7f766835c3486630d79"
        },
        {
          "dish": "5583b7faa2845dec35276b95",
          "number": 1,
          "_id": "559cc7f766835c3486630d78"
        },
        {
          "dish": "5583b7faa2845dec35276b97",
          "number": 2,
          "_id": "559cc7f766835c3486630d77"
        }
      ]
    }
  ],
  "status": "not paid",
  "isPaymentPaid": false,
  "address": {
    "geoLatitude": 30,
    "geoLongitude": 30,
    "country": "",
    "province": "shanghai",
    "city": "shanghai",
    "district": "shanghai",
    "street": "shanghai",
    "address": "xxxxx",
    "contactPerson": "wangyupeng",
    "mobile": "13564568304",
    "remark": "comment",
    "isValid": false
  },
  "childOrderList": [
    "559cc7f766835c3486630d73",
    "559cc7f766835c3486630d74"
  ],
  "isSplitOrder": true
}

```
