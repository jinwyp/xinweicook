# User

## Group Permisson

| Group Name | Group Permisson                   | Desc       |
|:-----------|:-----------------------------------------------|:-----------|
| guest      | guest                                          | 游客(默认) |
| member     | guest, member                                  | 普通用户   |
| courier    | guest, member, courier                         | 快递员     |
| partner    | guest, member, courier, partner                | 合作方     |
| cs         | guest, member, courier, cs, admin, partner     | 客服       |
| admin      | guest, member, courier, cs, admin, partner     | 管理员     |





###  用户字段
| Name               | Type   | Desc   |
|:-------            |:-------|:-------|
| avatarPic          | String | 头像字段 |
| invitationSendCode | String | 该用户可以发送给朋友的邀请码 |
| invitationUserList | Array  | 该用户已邀请的朋友列表 |



## User 范例
```js

{
  "_id": "55f7b37c81dc2fc37c588d9c",
  "modifiedAt": "2015-10-16T07:22:55.227Z",
  "createdAt": "2015-09-15T05:58:20.345Z",
  "autoIncrementId": 10057,
  "mobile": "13564568304",
  "__v": 11,
  "lastOrderDate": "2015-10-10T06:23:08.000Z",
  "invitationSendCode": "HNCJWGTD",
  "isPaid10Orders": true,
  "isPaid5Orders": true,
  "firstTimeRegFromApp": true,
  "isHaveFirstOrderCoupon": false,
  "isUsedInvitationSendCode": false,
  "invitedUserNumberHaveOrder": 5,
  "sharedInvitationSendCodeTotalCount": 10,
  "sharedInvitationSendCodeUsedTime": 0,
  "isSharedInvitationSendCode": false,
  "dishLikeList": [
    {
      "_id": "558a602a3eba152266ff2b8c",
      "modifiedAt": "2015-09-21T09:45:15.564Z",
      "createdAt": "2015-07-26T06:38:48.714Z",
      "autoIncrementId": 10549,
      "sortId": 100,
      "cookingType": "ready to cook",
      "sideDishType": "main",
      "setType": "single",
      "difficulty": 2,
      "time": 15,
      "servings": 1,
      "priceOriginal": 48,
      "__v": 2,
      "stock": 1856,
      "recommendSet": [],
      "priceWholesale": [
        {
          "quantity": 4,
          "price": 42,
          "_id": "55b480785ed3f7e58375ff83"
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
          "_id": "55b480785ed3f7e58375ff85",
          "sortId": 10,
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
          "_id": "55b480785ed3f7e58375ff84",
          "sortId": 10,
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
          "_id": "55b480785ed3f7e58375ff87",
          "sortId": 10,
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
          "_id": "55b480785ed3f7e58375ff86",
          "sortId": 10,
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
          "_id": "55b480785ed3f7e58375ff89",
          "sortId": 10,
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
          "_id": "55b480785ed3f7e58375ff88",
          "sortId": 10,
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
          "_id": "55b480785ed3f7e58375ff8a"
        }
      ],
      "cover": [
        {
          "zh": "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg",
          "en": "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg",
          "_id": "55b480785ed3f7e58375ff8c"
        },
        {
          "zh": "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg",
          "en": "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg",
          "_id": "55b480785ed3f7e58375ff8b"
        }
      ],
      "brief": {
        "zh": "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
        "en": "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
      },
      "title": {
        "zh": "干煸茶树菇孜然雪花牛柳",
        "en": "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
      },
      "isFromAdminPanel": false,
      "isPublished": true,
      "publishedAt": "2015-07-26T06:38:48.691Z"
    }
  ],
  "couponList": [
    {
      "_id": "5608bc98f75ca0521d7948da",
      "modifiedAt": "2015-09-28T04:05:44.444Z",
      "createdAt": "2015-09-28T04:05:44.444Z",
      "price": 10,
      "couponType": "coupon",
      "user": "55f7b37c81dc2fc37c588d9c",
      "__v": 0,
      "usedUserList": [],
      "isUsedCount": 0,
      "isUsed": false,
      "isExpired": false,
      "endDate": "2015-12-27T04:05:37.000Z",
      "startDate": "2015-09-28T04:05:37.000Z",
      "usedCountLimitOfOneUser": 1,
      "usedTime": 1,
      "priceLimit": 10,
      "name": {
        "zh": "满5单优惠券",
        "en": "Achieve 5 orders Coupon"
      }
    },
    {
      "_id": "5608bd83520644b71da825c8",
      "modifiedAt": "2015-09-28T04:09:39.913Z",
      "createdAt": "2015-09-28T04:09:39.913Z",
      "price": 20,
      "couponType": "coupon",
      "user": "55f7b37c81dc2fc37c588d9c",
      "__v": 0,
      "usedUserList": [],
      "isUsedCount": 0,
      "isUsed": false,
      "isExpired": false,
      "endDate": "2015-12-27T04:07:08.000Z",
      "startDate": "2015-09-28T04:07:08.000Z",
      "usedCountLimitOfOneUser": 1,
      "usedTime": 1,
      "priceLimit": 10,
      "name": {
        "zh": "满10单优惠券",
        "en": "Achieve 10 orders Coupon"
      }
    }
  ],
  "shoppingCart": [],
  "isPromoOn": true,
  "isSpam": false,
  "credit": 0,
  "address": [
    {
      "geoLatitude": 30,
      "geoLongitude": 30,
      "province": "shanghai",
      "city": "shanghai",
      "district": "shanghai",
      "street": "shanghai",
      "address": "xxxxx",
      "contactPerson": "王宇鹏",
      "mobile": "13564568304",
      "_id": "55f7c2c1d2b401eb06ad8e90",
      "sortOrder": 0,
      "isDefault": true,
      "isValid": false,
      "isTemporary": false
    }
  ],
  "group": "member",
  "invitationUserList": [
    {
      "_id": "55d2f6224466939461404df6",
      "modifiedAt": "2015-09-21T09:52:28.675Z",
      "createdAt": "2015-08-18T09:08:50.299Z",
      "autoIncrementId": 10046,
      "mobile": "18629641521",
      "pwd": "$2a$04$E59jsZ.xWhS1q0omnWrZoeHU6a1DR9x1psOoNQGwsHNL6BxC3Bfvu",
      "invitationSendCode": "XWUQDTNT",
      "__v": 217,
      "invitationFromCode": "ZWNAAPCD",
      "invitationFromUser": "55f7b37c81dc2fc37c588d9c",
      "lastOrderDate": "2015-09-21T09:07:46.000Z",
      "isPaid10Orders": false,
      "isPaid5Orders": true,
      "firstTimeRegFromApp": true,
      "isHaveFirstOrderCoupon": true,
      "isUsedInvitationSendCode": true,
      "invitedUserNumberHaveOrder": 0,
      "sharedInvitationSendCodeTotalCount": 9,
      "sharedInvitationSendCodeUsedTime": 1,
      "isSharedInvitationSendCode": false,
      "dishLikeList": [
        "55b0a37a181e6a7007c0371a"
      ],
      "couponList": [
        "55ffc8553dcc982d719ca4db"
      ],
      "shoppingCart": [],
      "isPromoOn": true,
      "isSpam": false,
      "credit": 0,
      "address": [
        {
          "mobile": "18629641521",
          "contactPerson": "在于我们",
          "geoLongitude": 121.4669486656077,
          "province": "上海",
          "street": "中山南二路",
          "address": "520-1-临",
          "alias": "",
          "city": "上海市",
          "geoLatitude": 31.19551081112586,
          "district": "徐汇区",
          "country": "china",
          "remark": "",
          "_id": "55ebe6f279236d7a3619bb05",
          "sortOrder": 0,
          "isDefault": true,
          "isValid": true,
          "isTemporary": false
        }
      ],
      "group": "member"
    }
  ]
}

```

