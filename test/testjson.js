/**
 * Created by jinwyp on 6/25/15.
 */


var user = {
    "address" : [
        {
            "geoLatitude" : 20, // 纬度
            "geoLongitude" : 20, // 纬度

            "country" : "china",
            "province" : "shanghai",
            "city" : "shanghai",
            "district" : "shanghai",
            "street" : "枫林路",
            "address" : "510号",

            "isTemporary" : false,  //临时地址 下单后变为false
            "isDefault" : false,

            "contactPerson" : "xinwei",
            "mobile" : "13564568304",
            "alias" : "",
            "remark" : ""
        }
    ]
};


var dish = {
    "shoppingCart" : [
        {
            "dish" : "558a602a3eba152266ff2b8c",
            "number" : 1,
            "subDish" : [
                {
                    "dish" : "5583b7faa2845dec35276b92",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b95",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b97",
                    "number" : 2
                }
            ]
        },
        {
            "dish" : "558a602a3eba152266ff2b8c",
            "number" : 1,
            "subDish" : [
                {
                    "dish" : "5583b7faa2845dec35276b92",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b95",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b97",
                    "number" : 2
                }
            ]
        }
    ]
};


var order = {

    "cookingType" : "ready to cook",
    "clientFrom" : "ios",
    "credit" : 0,
    "freight" : 20,

    "coupon" : "5590d256103f46d9ac31e3ee",
    "promotionCode" : "xxxxxxx",

    "payment" : "alipay direct",
    "paymentUsedCash" : false,

    "deliveryDate" : "2015-06-13",
    "deliveryTime" : "10",


    "address" : {
        "geoLatitude" : 30,
        "geoLongitude" : 30,

        "country" : "",
        "province" : "shanghai",
        "city" : "shanghai",
        "district" : "shanghai",
        "street" : "shanghai",
        "address" : "xxxxx",

        "contactPerson" : "wangyupeng",
        "mobile" : "13564568304",
        "remark" : "comment"
    },


    "dishList" : [
        {
            "dish" : "558a602a3eba152266ff2b8c",
            "number" : 1,
            "subDish" : [
                {
                    "dish" : "5583b7faa2845dec35276b92",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b95",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b97",
                    "number" : 2
                }
            ]
        },
        {
            "dish" : "558a602a3eba152266ff2b8c",
            "number" : 1,
            "subDish" : [
                {
                    "dish" : "5583b7faa2845dec35276b92",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b95",
                    "number" : 1
                },
                {
                    "dish" : "5583b7faa2845dec35276b97",
                    "number" : 2
                }
            ]
        }
    ]
};





var alipay1 = {
    discount : '0.00',
    payment_type : '1',
    subject : 'XinWei_ReadyToCook',
    trade_no : '2015073000001000020058528698',
    buyer_email : '18629641521',
    gmt_create : '2015-07-30 17:31:33',
    notify_type : 'trade_status_sync',
    quantity : '1',
    out_trade_no : '201507301731239646112',
    seller_id : '2088111042213083',
    notify_time : '2015-07-30 17:31:33',
    body : 'XinWeiCook',
    trade_status : 'WAIT_BUYER_PAY',
    is_total_fee_adjust : 'Y',
    total_fee : '0.01',
    seller_email : 'steve.ge@me.com',
    price : '0.01',
    buyer_id : '2088412033326020',
    notify_id : 'fb25d93cb256758edbf9015e3b6a2a0724',
    use_coupon : 'N',
    sign_type : 'RSA',
    sign : 'HcV9Tl2ii4Kh7872WYbHNpUjOz5Slh03P0cF4nVFzkUFbKKby9PMPdC1qhKIDTP1kK/gAp3kdao1tQ+A0VsmGgW4UGHnbLLKJBYDtsPuChO2BMxjIVCCWMT84fGJJeBI2QewzE6vWrMRuTct6ewkObOTEQUA2OC6FrUuFECOv90='
};


var alipay2 = {
    discount : '0.00',
    payment_type : '1',
    subject : 'XinWei_ReadyToCook',
    trade_no : '2015073000001000020058530883',
    buyer_email : '18629641521',
    gmt_create : '2015-07-30 17:56:57',
    notify_type : 'trade_status_sync',
    quantity : '1',
    out_trade_no : '201507301756061517782',
    seller_id : '2088111042213083',
    notify_time : '2015-07-30 17:56:58',
    body : 'XinWeiCook',
    trade_status : 'TRADE_SUCCESS',
    is_total_fee_adjust : 'N',
    total_fee : '0.01',
    gmt_payment : '2015-07-30 17:56:58',
    seller_email : 'steve.ge@me.com',
    price : '0.01',
    buyer_id : '2088412033326020',
    notify_id : '3ef4dbf66b02100660c8bc9cdb670ef224',
    use_coupon : 'N',
    sign_type : 'RSA',
    sign : 'Bp0ahbYpzjMLLb+oBVz5u8nk606VH374tkA06Z7xXBynEAHjEPc109aKdi4mWDgoj/G8MZWmrX9WFL31Rg6Qu8JyJNd0FkivDuSFs51SYTJIokazwScBHOu35hDNRcuE4PIiL1cVDno7+aHHVa5pH2uS9FNDmAZGaSl/Wk33b/o='
};


var weixinpayUnifiedOrderReturn = {
    return_code : 'SUCCESS',
    return_msg  : 'OK',
    appid       : 'wx37a1323e488cef84',
    mch_id      : '1231161502',
    nonce_str   : 'ZbQ8DY5dyPCW4nIL',
    sign        : '245C297546C9CA152D35A32D283B109E',
    result_code : 'SUCCESS',
    prepay_id   : 'wx20150919164301bf2576da0d0761322778',
    trade_type  : 'JSAPI'
};


var weixinpayNotify = {
    appid : 'wxc31508f4ded1402b',
    attach : '55cb142f1ce9a11b3b29a3e1',
    bank_type : 'CFT',
    cash_fee : '1',
    fee_type : 'CNY',
    is_subscribe : 'N',
    mch_id : '1260182401',
    nonce_str : 'VyrZo041MlpySrO3',
    openid : 'o-SvZwvBW32tW3WE6ltyeEgfN-hM',
    out_trade_no : '201508121738550015511',
    result_code : 'SUCCESS',
    return_code : 'SUCCESS',
    sign : '357591EB80607E8F3FEE007CFCA6112F',
    time_end : '20150812174031',
    total_fee : '1',
    trade_type : 'APP',
    transaction_id : '1008770927201508120606427576'
};


var testDish = {
    "_id"             : "55d177b7d7886b10327769a2",
    "modifiedAt"      : "2015-08-19T05:56:22.889Z",
    "createdAt"       : "2015-08-17T05:57:11.637Z",
    "autoIncrementId" : 10283,
    "sortId"          : 1010,
    "cookingType"     : "ready to cook",
    "sideDishType"    : "main",
    "setType"         : "single",
    "difficulty"      : 2,
    "time"            : 20,
    "servings"        : 1,
    "storageLife"     : 2,
    "priceOriginal"   : 58,

    "statisticViews"        : 0,
    "statisticLikeUserList" : [],
    "statisticLike"         : 0,
    "statisticSales"        : 0,
    "statisticHot"          : 0,
    "stock"                 : 20,
    "recommendSet"          : [],
    "topping"               : [],
    "preferences"           : [],
    "priceWholesale"        : [],
    "tagFilter"             : ["5590d256103f46d9ac31e3e2", "5590d256103f46d9ac31e3f1", "5590d256103f46d9ac31e3f9", "5590d256103f46d9ac31e3f3"],
    "region"                : [],
    "infoCookingStep"       : [
        {"contentType" : "pic", "_id" : "55d177b7d7886b10327769a8", "sortId" : 10, "value" : {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2166.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2166.jpg"}, "title" : {"en" : "", "zh" : ""}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c717817", "sortId" : 10, "value" : {"zh" : "秋葵去蒂切片，小胡萝卜、玉米笋对半切开再切片。", "en" : "Cut okra into diamond shape. Cut baby carrots and baby corns in half and then slice them."}, "title" : {"zh" : "准备工作", "en" : "Preparation work"}},
        {"contentType" : "pic", "_id" : "55d41a861fe33ffe6c717816", "sortId" : 10, "value" : {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2184.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2184.jpg"}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c717815", "sortId" : 10, "value" : {"zh" : "汤锅加水，大火烧开，放入小胡萝卜煮约2分钟后捞出。继续放入秋葵煮约1分钟，捞出。最后放入玉米笋煮约半分钟，捞出。", "en" : "Add water to the pot and bring to boil, put in baby carrots and boil for 2 minutes, take out. Then put in okra, boil for 1 minute and take out. Finally, put in baby corns, boil for half minute and take out."}, "title" : {"zh" : "煮蔬菜", "en" : "Boil the vegetables"}},
        {"contentType" : "pic", "_id" : "55d41a861fe33ffe6c717814", "sortId" : 10, "value" : {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2196.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2196.jpg"}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c717813", "sortId" : 10, "value" : {"en" : "Heat the pan over low heat, pour in all taro puree, stir and heat for about 1 minute, take out and set aside.(You may also microwave it on high heat for 2 minutes.)", "zh" : "不粘锅小火热锅，倒入香芋泥，加热搅拌约1分钟，取出待用。（或用微波炉高火热2分钟亦可）"}, "title" : {"zh" : "加热香芋泥", "en" : "Heat the taro puree"}},
        {"contentType" : "pic", "_id" : "55d41a861fe33ffe6c717812", "sortId" : 10, "value" : {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2224.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2224.jpg"}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c717811", "sortId" : 10, "value" : {"zh" : "平底锅中火烧旺，倒入1/3的橄榄油，放入小胡萝卜、秋葵、玉米笋翻炒约1分钟取出，期间撒1/2茶匙盐、1/3茶匙黑胡椒碎调味。", "en" : "Heat the pan over medium heat, pour in 1/3 of the olive oil, add in okra, baby carrots and baby corns, stir-fry for about 1 minute and remove from heat. Meanwhile, add 1/2 teaspoon of salt and 1/3 teaspoon of black pepper to season."}, "title" : {"zh" : "炒蔬菜", "en" : "Stir-fry the vegetables"}},
        {"contentType" : "pic", "_id" : "55d41a861fe33ffe6c717810", "sortId" : 10, "value" : {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2239.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2239.jpg"}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c71780f", "sortId" : 10, "value" : {"en" : "Wipe the pan, add the remaining olive oil on low heat. Melt butter in the pan. Flatten the garlic and  add them to the pan, add thyme. Sear the duck leg  skin side down for 2 minutes then flip side and sear for another 4-5 minutes. Scoop butter on the duck leg continuously. Finally, switch to high heat to color the duck leg  dark brown.", "zh" : "平底锅简单擦拭后倒入剩余橄榄油，小火热锅，加入黄油至融化。用刀将大蒜拍扁后与百里香一起放入锅中，放入鸭腿，先煎鸭腿带皮一面约2分钟再翻面。期间不断将锅中热油浇在鸭腿上，持续约4-5分钟，最后用大火将鸭腿煎至呈棕色。"}, "title" : {"en" : "Sear the duck leg", "zh" : "煎鸭腿"}},
        {"contentType" : "pic", "_id" : "55d41a861fe33ffe6c71780e", "sortId" : 10, "value" : {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2307.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2307.jpg"}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c71780d", "sortId" : 10, "value" : {"en" : "Cut the duck leg in half, sprinkle with chocolate sauce and lingonberry jam (you may heat it up if you like), lay on your favorite plate with taro puree and serve!", "zh" : "鸭腿切半，淋上巧克力酱（可根据个人口味加热）和小红莓果酱，与香芋泥一起装入盘中，即可享用！"}, "title" : {"en" : "Plate your dish", "zh" : "摆盘"}}
    ],
    "infoIngredient"        : [
        {"contentType" : "txt", "linkTo" : "", "_id" : "55d177b7d7886b10327769ae", "sortId" : 10, "value" : {"zh" : "", "en" : ""}, "title" : {"zh" : "2茶匙 盐", "en" : "2 Teaspoon Salt"}},
        {"_id" : "55d177b7d7886b10327769ad", "sortId" : 10, "title" : {"zh" : "3汤匙 橄榄油", "en" : "3 Tablespoon Olive Oil"}},
        {"_id" : "55d177b7d7886b10327769ac", "sortId" : 10, "title" : {"zh" : "2汤匙 小红莓果酱", "en" : "2 Tablespoon Lingonberry Jam"}},
        {"_id" : "55d177b7d7886b10327769ab", "sortId" : 10, "title" : {"zh" : "1包 巧克力酱", "en" : "1 Pack Chocolate Sauce"}},
        {"_id" : "55d177b7d7886b10327769aa", "sortId" : 10, "title" : {"zh" : "1包 百里香", "en" : "1 Pack Thyme"}},
        {"_id" : "55d177b7d7886b10327769a9", "sortId" : 10, "title" : {"zh" : "1包 蔬菜包", "en" : "1 Pack Mixed Vegetable"}},
        {"_id" : "55d41a861fe33ffe6c71781c", "sortId" : 10, "title" : {"zh" : "1茶匙 黑胡椒碎", "en" : "1 Teaspoon Black Pepper"}},
        {"_id" : "55d41a861fe33ffe6c71781b", "sortId" : 10, "title" : {"zh" : "2汤匙 黄油", "en" : "2 Tablespoon Butter"}},
        {"_id" : "55d41a861fe33ffe6c71781a", "sortId" : 10, "title" : {"zh" : "1包 香芋泥", "en" : "1 Pack Taro Puree"}},
        {"_id" : "55d41a861fe33ffe6c717819", "sortId" : 10, "title" : {"zh" : "2颗 大蒜粒", "en" : "2 Chopped Garlic"}},
        {"_id" : "55d41a861fe33ffe6c717818", "sortId" : 10, "title" : {"zh" : "1包 鸭腿", "en" : "1 Pack Duck Leg"}}
    ],
    "infoUniqueFeature"     : [
        {"contentType" : "pic", "_id" : "55d177b7d7886b10327769af", "sortId" : 10, "value" : {"en" : "https://dn-xinweicook.qbox.me/油封鸭腿shutterstock_132057926-小.jpg", "zh" : "https://dn-xinweicook.qbox.me/油封鸭腿shutterstock_132057926-小.jpg"}, "title" : {"en" : "", "zh" : ""}},
        {"contentType" : "txt", "_id" : "55d41a861fe33ffe6c71781d", "sortId" : 10, "value" : {"en" : "A fresh interpretation of the traditional French duck confit. Marinated duck confit slow braised with garden-fresh vegetables and chef’s special chocolate and cranberry sauce, tender with rich flavors.", "zh" : "油封鸭腿是起源于法国保存食材的方法而延伸出来的一道菜。油封（confit）就是把肉泡在油脂中用低温小火慢慢煮熟的一种烹饪手法。大量的油脂可以把肉密封，隔绝空气，从而保持肉的柔嫩口感。新味的油封鸭腿，将鸭腿用鸭油、百里香、杜松果、大蒜、海盐等低温慢煮120分钟，鸭肉软嫩柔滑肥而不腻。"}, "title" : {"zh" : "油封鸭腿", "en" : "French Duck Leg Confit"}}
    ],
    "kitchenware"           : [
        {"zh" : "pan", "en" : "pan", "_id" : "55d177b7d7886b10327769b1"},
        {"zh" : "pot", "en" : "pot", "_id" : "55d177b7d7886b10327769b0"}
    ],
    "cover"                 : [
        {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2307.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2307.jpg", "_id" : "55d177b7d7886b10327769b2"},
        {"zh" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2309.jpg", "en" : "https://dn-xinweicook.qbox.me/油封鸭腿s-_MG_2309.jpg", "_id" : "55d41a861fe33ffe6c71781e"}
    ],
    "brief"                 : {
        "zh" : "传统法式油封鸭腿新味玩出新花样。精心炮制的油封鸭腿小火慢煎，搭配爽脆的新鲜蔬菜，佐以新味独家秘制的巧克力酱汁和小红莓酱汁，鸭肉柔嫩入味，带给你不一样的全新感受。",
        "en" : "A fresh interpretation of the traditional French duck confit. Marinated duck confit slow braised with garden-fresh vegetables and chef’s special chocolate and cranberry sauce, tender with rich flavors."
    },
    "title"                 : {
        "zh" : "法式油封鸭腿配红莓酱和巧克力汁",
        "en" : "French Duck Leg Confit with Lingonberry Jam and Chocolate Sauce"
    },
    "isFromAdminPanel"      : true,
    "isPublished"           : true,
    "publishedAt"           : "2015-08-17T05:57:11.616Z",
    "__v"                   : 1
};


var testOrder = {
    "_id" : "55d348169098a7ee3fbf4f47",
    "modifiedAt" : "2015-08-18T14:58:41.585Z",
    "createdAt" : "2015-08-18T14:58:30.104Z",
    "autoIncrementId" : 10695, "orderNumber" : "201508182258300433817", "user" : "55d336639098a7ee3fbf49e1", "cookingType" : "ready to cook", "clientFrom" : "ios", "payment" : "alipay direct", "paymentUsedCash" : false, "credit" : 0, "freight" : 24, "dishesPrice" : 180, "totalPrice" : 204, "deliveryDate" : "2015-08-20", "deliveryTime" : "00:00", "deliveryDateTime" : "2015-08-19T16:00:00.000Z", "deliveryDateType" : "today",
    "dishHistory" : [
    {"number" : 1, "dish" : {"_id" : "55b1b46e4c2900bb159cafe0", "modifiedAt" : "2015-08-17T19:05:21.073Z", "createdAt" : "2015-07-24T03:43:43.704Z", "autoIncrementId" : 10265, "sortId" : 1001, "cookingType" : "ready to cook", "sideDishType" : "main", "setType" : "single", "difficulty" : 1, "time" : 10, "servings" : 1, "priceOriginal" : 18, "__v" : 0, "statisticViews" : 0, "statisticLikeUserList" : [], "statisticLike" : 0, "statisticSales" : 0, "statisticHot" : 0, "stock" : 14, "recommendSet" : [], "topping" : [], "preferences" : [], "priceWholesale" : [], "tagFilter" : ["5590d256103f46d9ac31e3eb", "5590d256103f46d9ac31e3f3", "5590d256103f46d9ac31e3f4"], "region" : [], "infoCookingStep" : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb465", "sortId" : 1, "value" : {"zh" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7578.jpg", "en" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7578.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb464", "sortId" : 1, "value" : {"zh" : "汤锅加水烧开，加入2勺盐和所有色拉油，放入芥兰，当水再次烧开时，捞出沥干，装盘待用。", "en" : "Add water to the pot, bring to boil. Add 2 tsp of salt and all cooking oil. Put Chinese broccoli in, when the water boils again, take out and drain.Then lay on a plate."}, "title" : {"zh" : "煮芥兰", "en" : "Boil the Chinese broccoli"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb463", "sortId" : 2, "value" : {"zh" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7592.jpg", "en" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7592.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb462", "sortId" : 2, "value" : {"zh" : "平底锅加热，倒入特制酱油，加热至沸腾，关火，浇在盛有芥兰的盘中，即可趁热享用！", "en" : "Heat the pan over high heat, pour in soy sauce, heat till boiled. Turn off the heat, drizzle soy sauce on Chinese broccoli. Serve hot!"}, "title" : {"zh" : "加热酱油", "en" : "Heat the soy sauce"}}
    ], "infoIngredient"            : [
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb46a", "sortId" : 100, "value" : {"zh" : "2茶匙 盐", "en" : "2 Tablespoon Salt"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb469", "sortId" : 100, "value" : {"zh" : "1包 芥兰", "en" : "1 Pack Chinese Broccoli (Kai-lan)"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb468", "sortId" : 100, "value" : {"zh" : "2汤匙 特制酱油", "en" : "2 Tablespoon Chef Special Soy Sauce"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb467", "sortId" : 100, "value" : {"zh" : "1汤匙 色拉油", "en" : "1 Tablespoon Cooking Oil"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb466", "sortId" : 100, "value" : {"zh" : "https://dn-xinweicook.qbox.me/白灼芥兰白灼芥兰食材图.jpg", "en" : "https://dn-xinweicook.qbox.me/白灼芥兰白灼芥兰食材图.jpg"}, "title" : {"zh" : "", "en" : ""}}
    ], "infoUniqueFeature"         : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb46c", "sortId" : 100, "value" : {"zh" : "https://dn-xinweicook.qbox.me/白灼芥兰diduknow.jpg", "en" : "https://dn-xinweicook.qbox.me/白灼芥兰diduknow.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb46b", "sortId" : 100, "value" : {"zh" : "亦称芥蓝，主要产于中国广东、福建一带，是深绿色蔬菜的代表，其富含的叶绿素有助于疏散肝脏毒素，抗氧化，防辐射。芥兰所含有的有机碱使其带有一丝天然的苦味，入心经而降心火，在这个季节食用，利水祛湿，明目安神。", "en" : "Also known as Kai-lan or Chinese kale, Chinese broccoli is a leaf vegetable featuring big, thick and flat leaves with fat stems. Native to South China, the deep green vegetable helps to improve detoxification and prevent cancer with marvelous healing powers from the traditional Chinese culinary point of view."}, "title" : {"zh" : "芥兰", "en" : "Chinese Broccoli"}}
    ], "kitchenware"               : [
        {"zh" : "pan", "en" : "pan", "_id" : "55b1b46e4c2900bb159cb46e"},
        {"zh" : "pot", "en" : "pot", "_id" : "55b1b46e4c2900bb159cb46d"}
    ], "cover"                     : [
        {"zh" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7605.jpg", "en" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7605.jpg", "_id" : "55b1b46e4c2900bb159cb470"},
        {"zh" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7605.jpg", "en" : "https://dn-xinweicook.qbox.me/白灼芥兰s-_MG_7605.jpg", "_id" : "55b1b46e4c2900bb159cb46f"}
    ], "brief"                     : {"zh" : "碧绿油亮，脆美清香的芥兰，以白灼手法快速烫熟，在保留芥兰原汁原味的同时也避免了营养成分的流失。遵循新味的专业步骤，淋上大厨准备的特调味汁，连酒楼都做不出的住家好味，还不赶快尝试！", "en" : "The famous Chinese vegetable dish now you can create it at home, delicious and healthy, surprisingly simple to prepare. Following the professional directions from Xinwei, you may easily present on table a plate of Chinese broccoli briefly but perfectly blanched retaining their natural vibrant green color and the crunchy texture!"}, "shortTitle2" : {"zh" : "碧绿油亮，脆美清香的芥兰，以白灼手法快速烫熟，在保留芥兰原汁原味的同时也避免了营养成分的流失……", "en" : "The famous Chinese vegetable dish now you can create it at home, delicious and healthy, surprisingly ……"}, "shortTitle1" : {"zh" : "原汁原味、天然清香的白灼芥兰 ", "en" : "Delicious and healthy Chinese broccoli "}, "title" : {"zh" : "白灼芥兰 ", "en" : "Blanched Kai-lan with Soy Sauce"}, "isFromAdminPanel" : false, "isPublished" : true, "publishedAt" : "2015-07-24T03:43:42.963Z"}},
    {"number" : 1, "dish" : {"_id" : "55b1b46e4c2900bb159cafdf", "modifiedAt" : "2015-08-16T14:32:18.311Z", "createdAt" : "2015-07-24T03:43:43.570Z", "autoIncrementId" : 10264, "sortId" : 1001, "cookingType" : "ready to cook", "sideDishType" : "main", "setType" : "single", "difficulty" : 3, "time" : 20, "servings" : 1, "priceOriginal" : 48, "__v" : 4, "statisticViews" : 0, "statisticLikeUserList" : ["55c1d700266f6aa67d34cf7d", "55cf39a505a2008c366aba46"], "statisticLike" : 2, "statisticSales" : 0, "statisticHot" : 0, "stock" : 2, "recommendSet" : [], "topping" : [], "preferences" : [], "priceWholesale" : [], "tagFilter" : ["5590d256103f46d9ac31e3ea", "5590d256103f46d9ac31e3f1", "5590d256103f46d9ac31e3f3"], "region" : [], "infoCookingStep" : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb454", "sortId" : 1, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7434.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7434.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb453", "sortId" : 1, "value" : {"zh" : "西柚去皮切瓣，将一半的生粉加适量水搅拌成糊状。把另一半生粉撒入鸡腿肉中，拌匀，使浆浓稠。", "en" : "Peel the grapefruit and cut into wedges. Mix half of the cornstarch with some water and stir into paste. Sprinkle the other half cornstarch on the chicken thigh and stir evenly to make the paste thick."}, "title" : {"zh" : "准备工作", "en" : "Preparation work"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb452", "sortId" : 2, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7464.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7464.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb451", "sortId" : 2, "value" : {"zh" : "把一半的杏仁片均匀撒在干净的盘中，放上鸡腿肉，再在上面撒上另一半杏仁片，使鸡肉上下面均匀沾上杏仁片。", "en" : "Sprinkle half the almond flakes over the plate, place on the chicken thigh, then sprinkle upon the other half almond flakes. Make sure both sides of the chicken thigh are well coated with almond flakes."}, "title" : {"zh" : "沾杏仁片", "en" : "Coat with almond flakes"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb450", "sortId" : 3, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7488.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7488.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb44f", "sortId" : 3, "value" : {"zh" : "大火烧热锅，倒入全部色拉油，加热至投入一片杏仁片立刻冒泡的状态，调小火，放入鸡腿肉，炸至冒小泡，杏仁呈金黄色，调中火，使鸡腿肉周围的热油保持冒小泡的状态，至鸡腿肉浮上来时，捞出待用。整个过程约8-10分钟。", "en" : "Heat the pan over high heat, pour in all cooking oil and heat up. Throw in an almond flake for testing, if the oil around it starts bubbling immediately, switch to low heat and put in the chicken. Fry till the oil bubbles again around the chicken. Switch to medium heat, make sure the oil keeps bubbling around the chicken. As the chicken comes up to the surface, take out and drain. "}, "title" : {"zh" : "炸鸡腿肉", "en" : "Fry the chicken thigh"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb44e", "sortId" : 4, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7503.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7503.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb44d", "sortId" : 4, "value" : {"zh" : "余油倒出，大火烧热锅，倒入西柠汁，烧开时转小火，倒入生粉水，拌匀勾芡至浓稠，关火。", "en" : "Discard remaining oil, heat the pan over high heat, pour in the lemon sauce. When it's boiled, switch to low heat. Add some cornstarch mixture, stir until thicken. Turn off the heat."}, "title" : {"zh" : "加热西柠汁", "en" : "Heat the lemon sauce"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb44c", "sortId" : 5, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7526.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7526.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb44b", "sortId" : 5, "value" : {"zh" : "将杏仁鸡腿肉切块，摆入盘中，淋上西柠汁，即可趁热享用！", "en" : "Cut the chicken thigh and lay on your favorite plate, sprinkle with lemon sauce. Serve hot!"}, "title" : {"zh" : "摆盘", "en" : "Plate your dish"}}
    ], "infoIngredient"            : [
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb45c", "sortId" : 100, "value" : {"zh" : "1包 去骨鸡腿肉", "en" : "1 Pack Boneless Chicken Thigh"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb45b", "sortId" : 100, "value" : {"zh" : "2茶匙 杏仁片", "en" : "2 Tablespoon Almond Flakes"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb45a", "sortId" : 100, "value" : {"zh" : "1个 西柚", "en" : "1 Grapefruit"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb459", "sortId" : 100, "value" : {"zh" : "1茶匙 生粉", "en" : "1 Tablespoon Cornstarch"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb458", "sortId" : 100, "value" : {"zh" : "2汤匙 特制西柠汁", "en" : "2 Tablespoon Lemon Sauce"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb457", "sortId" : 100, "value" : {"zh" : "3汤匙 色拉油", "en" : "3 Tablespoon Cooking Oil"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb456", "sortId" : 100, "value" : {"zh" : "1包 香料包", "en" : "1 Pack Mixed Herb"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb455", "sortId" : 100, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡食材图.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡食材图.jpg"}, "title" : {"zh" : "", "en" : ""}}
    ], "infoUniqueFeature"         : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb45e", "sortId" : 100, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡diduknow.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡diduknow.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb45d", "sortId" : 100, "value" : {"zh" : "鸡腿肉肉质厚实，细嫩弹牙，可以说是鸡肉中最受欢迎的部分之一，适合多种烹调方式。新味的鸡肉来自以色列自然方式哺育的天然肉鸡，100%植物饲料，不含抗生素和其他有害化学物质。所培育的鸡健康强壮，肉质鲜美，鸡味香浓，健康安全，脂肪含量与传统工业方式喂养的相比减少30%，更具营养价值。", "en" : "We source this flavorful and healthy chicken from the world class poultry group dedicated to producing healthier poultry by natural breeding methods that eliminate all antibiotics, stimulants, growth catalysts, hormones and other harmful additives usually associated with modern industrial poultry farming. The chickens turns out to be healthier, better tasting and contains 30% less fat than chickens raised in the traditional industrial manner. "}, "title" : {"zh" : "有机去骨鸡腿肉", "en" : "Organic Natural Breeding Chicken"}}
    ], "kitchenware"               : [
        {"zh" : "pan", "en" : "pan", "_id" : "55b1b46e4c2900bb159cb45f"}
    ], "cover"                     : [
        {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7534.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7534.jpg", "_id" : "55b1b46e4c2900bb159cb461"},
        {"zh" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7543.jpg", "en" : "https://dn-xinweicook.qbox.me/杏脯西柠鸡s-_MG_7543.jpg", "_id" : "55b1b46e4c2900bb159cb460"}
    ], "brief"                     : {"zh" : "这道以泰式香料和新鲜柠檬汁腌制入味的杏脯西柠鸡绝对能在这个夏日将味蕾唤醒。在杏仁脆片的包裹下，鸡肉更显滑嫩多汁，杏仁的回甘也带出了肉质的鲜美。搭配饱满鲜红的西柚果肉，淋上大厨特制西柠汁，酸酸甜甜，清新开胃。", "en" : "This Cantonese-style based dish boasts the crunchy texture of the chicken fried to golden brown with a refreshing, tangy and sweet lemon sauce. Instead of flour or breadcrumbs, the boneless chicken thigh is coated with almond flakes, keeping it moist and airy. The use of grapefruit will definitely dress up the chicken with a fancy presentation and wake up your taste buds! "}, "shortTitle2" : {"zh" : "这道以泰式香料和新鲜柠檬汁腌制入味的杏脯西柠鸡绝对能在这个夏日将味蕾唤醒。在杏仁脆片的包裹下，鸡肉…", "en" : "This Cantonese-style based dish boasts the crunchy texture of the chicken fried to golden brown with a ……"}, "shortTitle1" : {"zh" : "香脆杏仁与嫩滑鸡肉搭配饱满西柚", "en" : "Tender chicken thigh coated by crispy almond flakes and dressed with juicy grapefruit!"}, "title" : {"zh" : "杏脯西柠鸡  ", "en" : "Almond Flakes Crusted Lemon Chicken with Grapefruit "}, "isFromAdminPanel" : false, "isPublished" : true, "publishedAt" : "2015-07-24T03:43:42.943Z"}},
    {"number" : 1, "dish" : {"_id" : "55b1b46e4c2900bb159cafc1", "modifiedAt" : "2015-08-17T06:28:08.354Z", "createdAt" : "2015-07-24T03:43:43.568Z", "autoIncrementId" : 10234, "sortId" : 1001, "cookingType" : "ready to cook", "sideDishType" : "main", "setType" : "single", "difficulty" : 1, "time" : 10, "servings" : 1, "priceOriginal" : 28, "__v" : 5, "statisticViews" : 0, "statisticLikeUserList" : ["55b1f591ca15939a23b7bddb"], "statisticLike" : 1, "statisticSales" : 0, "statisticHot" : 0, "stock" : 0, "recommendSet" : [], "topping" : [], "preferences" : [], "priceWholesale" : [], "tagFilter" : ["5590d256103f46d9ac31e3e9", "5590d256103f46d9ac31e3f3"], "region" : [], "infoCookingStep" : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1af", "sortId" : 1, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1415.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1415.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1ae", "sortId" : 1, "value" : {"zh" : "汤锅加水，加热至冒泡时挤入柠檬汁，将柠檬放入水中继续煮。", "en" : "Pour in water to soup pot, squeeze in lemon juice when it starts to bubble, put in the whole lemon, and continue boiling."}, "title" : {"zh" : "准备工作", "en" : "Preparation work"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1ad", "sortId" : 2, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1439.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1439.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1ac", "sortId" : 2, "value" : {"zh" : "煮至水沸腾时，倒入八爪鱼，煮至水再次沸腾时关火，将水和柠檬倒出。", "en" : "When the water is boiled, put the octopus in, when the water is boiled again, turn off the heat, pour the water and lemon out."}, "title" : {"zh" : "煮八爪鱼", "en" : "Boil the octopus"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1ab", "sortId" : 3, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1475.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1475.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1aa", "sortId" : 3, "value" : {"zh" : "将煮好的八爪鱼切半，放入盘中待用。樱桃番茄切瓣，香菜切末，放入盘中。", "en" : "Cut the boiled octopus in half, put in a plate and set aside. Cut the cherry tomatoes in half, coriander minced, put on the plate."}, "title" : {"zh" : "切食材", "en" : "Chop the ingredients"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1a9", "sortId" : 4, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1481.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1481.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1a8", "sortId" : 4, "value" : {"zh" : "将油醋汁淋入盘中，与食材搅拌均匀后撒一勺盐、一小勺黑胡椒，拌匀即可。", "en" : "Sprinkle the vinaigrette into the plate, mix well with all ingredients. Add in 1 teaspoon of salt and 1 teaspoon of black pepper, stir well."}, "title" : {"zh" : "拌色拉", "en" : "Toss the salad"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1a7", "sortId" : 5, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1528.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1528.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1a6", "sortId" : 5, "value" : {"zh" : "将拌好的色拉据个人喜好摆盘，即可享用！", "en" : "Dish up to your preference and serve!"}, "title" : {"zh" : "摆盘", "en" : "Dish up"}}
    ], "infoIngredient"            : [
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b7", "sortId" : 100, "value" : {"zh" : "2茶匙 盐", "en" : "2 Teaspoon Salt"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b6", "sortId" : 100, "value" : {"zh" : "1茶匙 黑胡椒", "en" : "1 Teaspoon Black Pepper"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b5", "sortId" : 100, "value" : {"zh" : "2个 樱桃番茄", "en" : "2 Cherry Tomato Red"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b4", "sortId" : 100, "value" : {"zh" : "半个 柠檬", "en" : "1/2 Lemon"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b3", "sortId" : 100, "value" : {"zh" : "1包 油醋汁", "en" : "1 Pack Vinaigrette"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b2", "sortId" : 100, "value" : {"zh" : "1/4杯 香菜", "en" : "1/4 Cup Coriander"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b1", "sortId" : 100, "value" : {"zh" : "1/4杯 小八爪鱼", "en" : "1/4 Cup Small Octopus"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1b0", "sortId" : 100, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉八爪鱼色拉食材.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉八爪鱼色拉食材.jpg"}, "title" : {"zh" : "", "en" : ""}}
    ], "infoUniqueFeature"         : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb1b9", "sortId" : 100, "value" : {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉小八爪鱼.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉小八爪鱼.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb1b8", "sortId" : 100, "value" : {"zh" : "烹饪小八爪鱼也许需要一点点的技巧以保持它的鲜嫩口感。在希腊，八爪鱼色拉是一道很受欢迎的开胃菜，配上茴香味的餐酒，是最传统的吃法。", "en" : "Cooking with octopus is a bit trickier than cooking with squid, but if you follow this octopus recipe you can enjoy the tender, rich flavor of octopus. Greeks eat a lot of octopus, and a cold octopus salad is a common appetizer served with raki or ouzo, the local anise-flavored liqueurs. "}, "title" : {"zh" : "小八爪鱼", "en" : "Octopus"}}
    ], "kitchenware"               : [
        {"zh" : "pot", "en" : "pot", "_id" : "55b1b46e4c2900bb159cb1ba"}
    ], "cover"                     : [
        {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1531.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1531.jpg", "_id" : "55b1b46e4c2900bb159cb1bc"},
        {"zh" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1530.jpg", "en" : "http://xinweicook.qiniudn.com/八爪鱼色拉s-_MG_1530.jpg", "_id" : "55b1b46e4c2900bb159cb1bb"}
    ], "brief"                     : {"zh" : "还记得当年神一样的章鱼保罗么？萌萌小八爪鱼不仅口感独特，也许还能带来新年好运！酸甜可口的八爪鱼色拉作为新年大餐的前菜，清爽开胃，让你的味蕾瞬间被唤醒！", "en" : "Do you still remember Octopus Paul, who supposedly predicted the results of football matches? To tell the truth, the octopus is not only smart, but delicious as well! The fresh taste of octopus salad serves as a perfect start of your New Year’s Eve dinner, just enjoy!"}, "shortTitle2" : {"zh" : "还记得当年神一样的章鱼保罗么？萌萌小八爪鱼不仅口感独特，也许还能带来新年好运！酸甜可口的八爪鱼色拉作为新年大餐的前菜，清爽开胃，让你的味蕾瞬间被唤醒！", "en" : "Do you still remember Octopus Paul, who supposedly predicted the results of football matches? To tell the truth, the octopus is not only smart, but delicious as well! The fresh taste of octopus salad serves as a perfect start of your New Year’s Eve dinner, just enjoy!"}, "shortTitle1" : {"zh" : "酸甜八爪鱼瞬间唤醒你的味蕾", "en" : "Sour and sweet octopus that electrifies all your taste buds at once."}, "title" : {"zh" : "八爪鱼色拉", "en" : "Octopus Salad"}, "isFromAdminPanel" : false, "isPublished" : true, "publishedAt" : "2015-07-24T03:43:42.409Z"}},
    {"number" : 1, "dish" : {"_id" : "55b1b46e4c2900bb159cafde", "modifiedAt" : "2015-08-16T14:30:42.218Z", "createdAt" : "2015-07-24T03:43:43.439Z", "autoIncrementId" : 10263, "sortId" : 1001, "cookingType" : "ready to cook", "sideDishType" : "main", "setType" : "single", "difficulty" : 2, "time" : 15, "servings" : 1, "priceOriginal" : 48, "__v" : 1, "statisticViews" : 0, "statisticLikeUserList" : ["55cf39a505a2008c366aba46"], "statisticLike" : 1, "statisticSales" : 0, "statisticHot" : 0, "stock" : 1, "recommendSet" : [], "topping" : [], "preferences" : [], "priceWholesale" : [], "tagFilter" : ["5590d256103f46d9ac31e3ea", "5590d256103f46d9ac31e3f2", "5590d256103f46d9ac31e3f3"], "region" : [], "infoCookingStep" : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb43c", "sortId" : 1, "value" : {"zh" : "https://dn-xinweicook.qbox.me/牛柳1.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳1.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb43b", "sortId" : 1, "value" : {"zh" : "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。", "en" : "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."}, "title" : {"zh" : "准备工作", "en" : "Preparation work"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb43a", "sortId" : 2, "value" : {"zh" : "https://dn-xinweicook.qbox.me/牛柳2.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳2.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb439", "sortId" : 2, "value" : {"zh" : "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。", "en" : "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."}, "title" : {"zh" : "干煸茶树菇", "en" : "Dry-fry the poplar mushroom"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb438", "sortId" : 3, "value" : {"zh" : "https://dn-xinweicook.qbox.me/牛柳3.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳3.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb437", "sortId" : 3, "value" : {"zh" : "大火加热锅中剩余的油至冒青烟，加入牛柳，调中火，翻炒至变色，取出放入盛有茶树菇的盘中，待用。", "en" : "Heat the remaining oil over high heat till smoke comes out. Pour in marbled beef strips, switch to medium heat and stir fry till color changes on each side. Take out and put on the plate with poplar mushroom."}, "title" : {"zh" : "炒牛柳", "en" : "Fry the marbled beef strips"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb436", "sortId" : 4, "value" : {"zh" : "https://dn-xinweicook.qbox.me/干煸茶树菇孜然雪花牛柳s-_MG_7368.jpg", "en" : "https://dn-xinweicook.qbox.me/干煸茶树菇孜然雪花牛柳s-_MG_7368.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb435", "sortId" : 4, "value" : {"zh" : "大火烧锅，倒入剩余的色拉油，放入大蒜爆香，再加入洋葱、干辣椒，翻炒至洋葱变软。加入彩椒，稍微翻炒约10秒即可。倒入茶树菇和牛柳，翻炒均匀。", "en" : "Heat the pan over high heat, pour in remaining oil, sauté till aroma comes out. Then add in onion and chilies, sauté till the onion turns soft. Add in bell peppers, sauté for 10 seconds. Pour in poplar mushroom and beef strips, stir evenly. "}, "title" : {"zh" : "调味", "en" : "Seasoning"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb434", "sortId" : 5, "value" : {"zh" : "https://dn-xinweicook.qbox.me/牛柳4.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳4.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb433", "sortId" : 5, "value" : {"zh" : "根据个人口味倒入酱汁，继续翻炒至汁水浓稠，约为之前的1/2时，放入香菜，翻炒均匀。", "en" : "Add cumin sauce to your taste, keep stirring till the sauce turns thick (about 1/2 less). Add in coriander and stir evenly."}, "title" : {"zh" : "加热酱汁", "en" : "Heat up the sauce"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb432", "sortId" : 6, "value" : {"zh" : "https://dn-xinweicook.qbox.me/牛柳5.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳5.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb431", "sortId" : 6, "value" : {"zh" : "出锅装盘，即可享用！", "en" : "Take out the dish and lay on your favorite plate, serve hot!"}, "title" : {"zh" : "装盘", "en" : "Plate your dish"}}
    ], "infoIngredient"            : [
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb445", "sortId" : 100, "value" : {"zh" : "1/2个 彩椒", "en" : "1/2 Bell Pepper"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb444", "sortId" : 100, "value" : {"zh" : "1/4个 洋葱", "en" : "1/4 Onion"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb443", "sortId" : 100, "value" : {"zh" : "1/4杯 香菜", "en" : "1/4 Cup Coriander"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb442", "sortId" : 100, "value" : {"zh" : "1包 雪花牛柳", "en" : "1 Pack Marbled Beef Strips"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb441", "sortId" : 100, "value" : {"zh" : "1包 茶树菇", "en" : "1 Pack Poplar Mushroom"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb440", "sortId" : 100, "value" : {"zh" : "1包 特制孜然酱汁", "en" : "1 Pack House-made Cumin Sauce"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb43f", "sortId" : 100, "value" : {"zh" : "3汤匙 色拉油", "en" : "3 Tablespoon Cooking Oil"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb43e", "sortId" : 100, "value" : {"zh" : "1包 香料包", "en" : "1 Pack Mixed Herb"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb43d", "sortId" : 100, "value" : {"zh" : "https://dn-xinweicook.qbox.me/牛柳食材图.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳食材图.jpg"}, "title" : {"zh" : "", "en" : ""}}
    ], "infoUniqueFeature"         : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb447", "sortId" : 100, "value" : {"zh" : "https://dn-xinweicook.qbox.me/杏鲍菇黑椒雪花牛仔粒雪花牛肉.jpg", "en" : "https://dn-xinweicook.qbox.me/杏鲍菇黑椒雪花牛仔粒雪花牛肉.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb446", "sortId" : 100, "value" : {"zh" : "我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。", "en" : "The cut of beef chuck eye roll from top grade (M7) Australian Wagyu cattle is consisted of high levels of fine white flecks of fat weaving throughout the meat, known as “marbling”  which makes sure the tenderness and terrific flavor. We source the best quality Wagyu Beef from Australia’s accredited meat supplier who operates under the highest industry certifications to ensure the safety, taste and health of the product."}, "title" : {"zh" : "澳洲雪花和牛", "en" : "Australian Wagyu Beef"}}
    ], "kitchenware"               : [
        {"zh" : "pan", "en" : "pan", "_id" : "55b1b46e4c2900bb159cb448"}
    ], "cover"                     : [
        {"zh" : "https://dn-xinweicook.qbox.me/牛柳6.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳6.jpg", "_id" : "55b1b46e4c2900bb159cb44a"},
        {"zh" : "https://dn-xinweicook.qbox.me/牛柳s-_MG_7419.jpg", "en" : "https://dn-xinweicook.qbox.me/牛柳s-_MG_7419.jpg", "_id" : "55b1b46e4c2900bb159cb449"}
    ], "brief"                     : {"zh" : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。", "en" : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."}, "shortTitle2" : {"zh" : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇…", "en" : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar…"}, "shortTitle1" : {"zh" : "优质澳洲M7和牛搭配新鲜山野茶树菇", "en" : "The high quality of Australian M7 Wagyu beef with fresh poplar mushrooms."}, "title" : {"zh" : "干煸茶树菇孜然雪花牛柳  ", "en" : "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"}, "isFromAdminPanel" : false, "isPublished" : true, "publishedAt" : "2015-07-24T03:43:42.921Z"}},
    {"number" : 1, "dish" : {"_id" : "55b1b46e4c2900bb159cafce", "modifiedAt" : "2015-08-07T15:59:59.314Z", "createdAt" : "2015-07-24T03:43:43.288Z", "autoIncrementId" : 10247, "sortId" : 1001, "cookingType" : "ready to cook", "sideDishType" : "main", "setType" : "single", "difficulty" : 2, "time" : 15, "servings" : 1, "priceOriginal" : 38, "__v" : 0, "statisticViews" : 0, "statisticLikeUserList" : [], "statisticLike" : 0, "statisticSales" : 0, "statisticHot" : 0, "stock" : 1, "recommendSet" : [], "topping" : [], "preferences" : [], "priceWholesale" : [], "tagFilter" : ["5590d256103f46d9ac31e3ea", "5590d256103f46d9ac31e3f3", "5590d256103f46d9ac31e3f2"], "region" : [], "infoCookingStep" : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb300", "sortId" : 1, "value" : {"zh" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1480.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1480.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb2ff", "sortId" : 1, "value" : {"zh" : "小葱切段，火葱去蒂去皮切片，取2片留用剩余部分切末，红甜椒切小丁，大蒜拍扁后切末。", "en" : "Section spring onions, slice the shallot. Keep 2 shallot slices for garnishing and mince the rest. Dice red bell pepper, mince the garlic."}, "title" : {"zh" : "准备工作", "en" : "Preparation work"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb2fe", "sortId" : 2, "value" : {"zh" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1518.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1518.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb2fd", "sortId" : 2, "value" : {"zh" : "平底锅大火加热，倒入全部色拉油烧至6成热，调中火放入排条炸1分钟左右，用滤网取出静置约2分钟。平底锅继续加热，调大火将油烧至7成热（微冒青烟）再放入排条，炸至排条变金黄色即可，取出放在厨房纸上。", "en" : "Heat the pan over high heat, add all cooking oil and heat it to medium-high heat. Switch to medium heat and add pork strips, fry them for about 1 minute, drain them and set aside for 2 minutes.Keep heating the pan, switch to high heat and heat the oil to smoking hot, add the pork strips again, fry them till their skin turns golden. Take out and put them on a kitchen towel.\n"}, "title" : {"zh" : "炸排条", "en" : "Fry the pork strips"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb2fc", "sortId" : 3, "value" : {"zh" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1586.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1586.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb2fb", "sortId" : 3, "value" : {"zh" : "将平底锅中的大部分油倒出，留少许在锅中大火加热后关火，倒入大蒜末，火葱末，小葱末和红甜椒丁，翻炒出香味后倒入排条，依个人口味酌情撒入椒盐粉翻炒一下。", "en" : "Discard most of the oil but 1 tablespoon in the pan. Heat up the oil over high heat, then turn off the heat. Add minced garlic, shallot, spring onion and diced red bell pepper, stir-fry till the aroma comes out. Add in pork strips and the pepper salt powder to suit your taste and then stir well."}, "title" : {"zh" : "调味", "en" : "Seasoning"}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb2fa", "sortId" : 4, "value" : {"zh" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1613.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1613.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb2f9", "sortId" : 4, "value" : {"zh" : "将炒好的食材摆入盘中，撒上香菜叶，即可享用。\n", "en" : "Lay the finished dish on your plate, sprinkle with coriander and serve hot!"}, "title" : {"zh" : "装盘", "en" : "Plate your dish"}}
    ], "infoIngredient"            : [
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb306", "sortId" : 100, "value" : {"zh" : "1茶匙 椒盐粉", "en" : "1 Teaspoon  Pepper Salt Powder"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb305", "sortId" : 100, "value" : {"zh" : "1汤匙 色拉油", "en" : "1 Tablespoon Cooking Oil"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb304", "sortId" : 100, "value" : {"zh" : "1张  厨房纸", "en" : "1 Paper Towel"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb303", "sortId" : 100, "value" : {"zh" : "1包 猪排条", "en" : "1 Bag Pork Rib"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb302", "sortId" : 100, "value" : {"zh" : "1包 蔬菜包", "en" : "1 Pack Mixed Vegetable"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb301", "sortId" : 100, "value" : {"zh" : "http://xinweicook.qiniudn.com/椒盐排条2015.4.26.椒盐排条.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条2015.4.26.椒盐排条.jpg"}, "title" : {"zh" : "", "en" : ""}}
    ], "infoUniqueFeature"         : [
        {"contentType" : "pic", "_id" : "55b1b46e4c2900bb159cb308", "sortId" : 100, "value" : {"zh" : "http://xinweicook.qiniudn.com/椒盐排条椒盐diduknow.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条椒盐diduknow.jpg"}, "title" : {"zh" : "", "en" : ""}},
        {"contentType" : "txt", "_id" : "55b1b46e4c2900bb159cb307", "sortId" : 100, "value" : {"zh" : "花椒粒炒香后磨成的粉末即为花椒粉，若加入炒黄的盐则成为花椒盐，常用于油炸食物沾食之用。 是川菜常用佐料，香麻而咸， 多用于热菜, 比较常见的佳肴有椒盐八宝鸡、椒盐排条、 椒盐鱼卷、椒盐大虾等。", "en" : "Pepper salt is a mixture of fried paper powder and salt, commonly used in Sichuan cuisine. It is usually seasoned on fried dish such as pork, fish and shrimping, developing a fragrant and spicy taste."}, "title" : {"zh" : "椒盐", "en" : "Pepper Salt"}}
    ], "kitchenware"               : [
        {"zh" : "pan", "en" : "pan", "_id" : "55b1b46e4c2900bb159cb309"}
    ], "cover"                     : [
        {"zh" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1637.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1637.jpg", "_id" : "55b1b46e4c2900bb159cb30b"},
        {"zh" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1638.jpg", "en" : "http://xinweicook.qiniudn.com/椒盐排条s-_MG_1638.jpg", "_id" : "55b1b46e4c2900bb159cb30a"}
    ], "brief"                     : {"zh" : "椒盐排条不只在饭店里可以吃到，在家一样可以欢享美味！热气腾腾的油炸排条裹上椒盐和香料，趁热咬下去，咸鲜、香辣的丰富口感定会让你快意升腾！", "en" : "Spicy deep fried spareribs are no longer limited in restaurants, since Xinwei has brought the dish to your table! Season the deep fried spareribs with spiced salt and mixed herbs, and just enjoy it hot!"}, "shortTitle2" : {"zh" : "椒盐排条不只在饭店里可以吃到，在家一样可以欢享美味！热气腾腾的油炸排条裹上椒盐和香料，趁热咬下…", "en" : "Spicy deep fried spareribs are no longer limited in restaurants, since Xinwei has brought the dish to …"}, "shortTitle1" : {"zh" : "咸鲜、香辣，口感丰富的椒盐排条", "en" : "Salty, spicy and tasty pork strips with Chinese pepper salt"}, "title" : {"zh" : "香酥椒盐排条", "en" : "Pepper Salt Pork Ribs"}, "isFromAdminPanel" : false, "isPublished" : true, "publishedAt" : "2015-07-24T03:43:42.634Z"}}
], "dishList"          : [
    {"number" : 1, "_id" : null, "dish" : "55b1b46e4c2900bb159cafe0", "remark" : null, "subDish" : []},
    {"number" : 1, "_id" : null, "dish" : "55b1b46e4c2900bb159cafdf", "remark" : null, "subDish" : []},
    {"number" : 1, "_id" : null, "dish" : "55b1b46e4c2900bb159cafc1", "remark" : null, "subDish" : []},
    {"number" : 1, "_id" : null, "dish" : "55b1b46e4c2900bb159cafde", "remark" : null, "subDish" : []},
    {"number" : 1, "_id" : null, "dish" : "55b1b46e4c2900bb159cafce", "remark" : null, "subDish" : []}
], "status"            : "paid", "isPaymentPaid" : true, "address" : {"mobile" : "15166665203", "contactPerson" : "任真", "geoLongitude" : 120.3927247537109, "province" : "山东", "street" : "华城路四小区18号楼", "address" : "1单元", "alias" : "", "city" : "青岛", "geoLatitude" : 36.31319352210113, "district" : "城阳区", "country" : "china", "remark" : "", "isValid" : true}, "childOrderList" : [], "isChildOrder" : false, "isSplitOrder" : false, "__v" : 0, "paymentAlipay" : {"notify_time" : "2015-08-18 22:58:38", "notify_type" : "trade_status_sync", "notify_id" : "d821963f81418cfa2aa283d9c886189334", "sign_type" : "RSA", "sign" : "RSA", "out_trade_no" : "201508182258300433817", "subject" : "XinWei_ReadyToCook", "payment_type" : "1", "trade_no" : "2015081800001000200065107844", "trade_status" : "TRADE_SUCCESS", "price" : 204, "total_fee" : 204, "quantity" : 1, "body" : "XinWeiCook", "is_total_fee_adjust" : "N", "use_coupon" : "N", "gmt_create" : "2015-08-18 22:58:37", "gmt_payment" : "2015-08-18 22:58:38", "seller_email" : "steve.ge@me.com", "buyer_email" : "15020088077", "seller_id" : "2088111042213083",
        "buyer_id" : "2088512557232202"}
};
















