/**
 * Created by jinwyp on 7/16/15.
 */



var userAdmin = [
    {
        username : "x@x.com",
        pwd : "guessmypw~",
        mobile : "13564568301",
        email : "x@x.com",
        group : "admin"
    },
    {
        username : "shaoxiaoqing",
        pwd : "xwcook789",
        mobile : "18602327056",
        email : "dreamer0321@foxmail.com",
        group : "admin",
        fullName : "邵晓青"
    },
    {
        username : "chensilu",
        pwd : "xwcook789",
        mobile : "18601799423",
        email : "690363236@qq.com",
        group : "admin",
        fullName : "陈思璐"
    },
    {
        username : "mengfei",
        pwd : "xwcook789",
        mobile : "18215563108",
        email : "918372085@qq.com",
        group : "admin",
        fullName : "赵梦菲"
    }
];


var userAdmin = [
    {
        username : "x@x2.com",
        pwd : "guessmypw~",
        mobile : "13564568302",
        email : "x@x2.com",
        group : "admin"
    },
    {
        username : "steveadmin",
        pwd : "xwcook789",
        mobile : "18621378963",
        email : "x@x3.com",
        group : "admin",
        fullName : "steve"
    },
    {
        username : "yujia_huo",
        pwd : "xwcook789",
        mobile : "18321600053",
        email : "yujia_huo@xinweicook.com",
        group : "admin",
        fullName : "霍雨佳"
    }
];




var dishFilterTagList1 = [
    {
        _id: ObjectId("5590d256103f46d9ac31e3e1"),
        isFilter: true,
        group: {
            zh: "菜系",
            en: "Dishes system"
        },
        name: {
            zh: "家常中餐",
            en: "Chinese food"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3e2"),
        isFilter: true,
        group: {
            zh: "菜系",
            en: "Dishes system"
        },
        name: {
            zh: "逼格西餐",
            en: "Western-style food"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3e3"),
        isFilter: true,
        group: {
            zh: "菜系",
            en: "Dishes system"
        },
        name: {
            zh: "清新日餐",
            en: "Japanese food"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3e4"),
        isFilter: true,
        group: {
            zh: "菜系",
            en: "Dishes system"
        },
        name: {
            zh: "风味亚餐",
            en: "Asian food"
        }
    }
];



var dishFilterTagList2 = [
     {
        _id: ObjectId("5590d256103f46d9ac31e3e9"),
        isFilter: true,
        group: {
            zh: "食材",
            en: "Ingredients"
        },
        name: {
            zh: "海鲜",
            en: "seafood"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3ea"),
        isFilter: true,
        group: {
            zh: "食材",
            en: "Ingredients"
        },
        name: {
            zh: "肉类",
            en: "meat"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3eb"),
        isFilter: true,
        group: {
            zh: "食材",
            en: "Ingredients"
        },
        name: {
            zh: "素食",
            en: "vegetarian"
        }
    }
];


var dishFilterTagList3 = [
    {
        _id: ObjectId("5590d256103f46d9ac31e3f1"),
        isFilter: true,
        group: {
            zh: "场景",
            en: "Occasion"
        },
        name: {
            zh: "情侣约会",
            en: "Date Night"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3f2"),
        isFilter: true,
        group: {
            zh: "场景",
            en: "Occasion"
        },
        name: {
            zh: "朋友聚会",
            en: "Friends Party"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3f3"),
        isFilter: true,
        group: {
            zh: "场景",
            en: "Occasion"
        },
        name: {
            zh: "家庭晚餐",
            en: "Family Dinner"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3f4"),
        isFilter: true,
        group: {
            zh: "场景",
            en: "Occasion"
        },
        name: {
            zh: "健康乐活",
            en: "Health Live"
        }
    }
];


var dishFilterTagList9 = [
    {
        _id: ObjectId("5590d256103f46d9ac31e3f9"),
        isFilter: true,
        group: {
            zh: "推荐促销",
            en: "Promotion"
        },
        name: {
            zh: "新品",
            en: "New"
        }
    },
    {
        _id: ObjectId("5590d256103f46d9ac31e3fa"),
        isFilter: true,
        group: {
            zh: "推荐促销",
            en: "Promotion"
        },
        name: {
            zh: "热卖",
            en: "Hot"
        }
    }
];

var dishFilterList = dishFilterTagList1.concat(dishFilterTagList2, dishFilterTagList3, dishFilterTagList9);







var sampleReadyToEat = [
    {
        "_id"               : ObjectId("558a602a3eba152266ff2c01"),
        "isPublished"       : true,
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "title"             : {
            "zh" : "泰式香煎松阪肉",
            "en" : "Thai Style Pan-fried Pork Neck"
        },
        "cover"             : [
            {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_1.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_1.jpg"
            }
        ],
        "difficulty"        : 2,
        "time"              : 15,
        "servings"          : 1,
        "kitchenware"       : [
            {
                "zh" : "平底锅",
                "en" : "pan"
            }
        ],
        "brief"             : {
            "zh" : "泰餐厅的人气料理可以在家轻松享用！精选五星级酒店专供新鲜猪颈肉，以多种泰国香料腌制妥当；煎烤到表面金黄润泽，将丰富肉汁封锁在内，入口爽脆柔嫩，佐以特制泰式酸辣酱汁，仿佛瞬间来到泰国街头！",
            "en" : "Pork neck can often be found on Thai restaurant menus. With the preparation of Xinwei, you may now serve it in less than 10 minutes at home! It can be served as an appetizer or an main course with sticky rice or plain steamed jasmine rice."
        },
        "infoUniqueFeature" : [
            {
                "title"       : {
                    "zh" : "你知道吗？",
                    "en" : "Did you know?"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "俗称霜降猪肉或猪颈二层肉，由于油花分布均匀，好像大理石的纹路一样，口感媲美昂贵的日本松阪牛肉故而得名。由于一头猪身上只有两小块，也称为“黄金六两”，大部分供应给酒店或知名餐厅，较少见于传统家庭市场。",
                    "en" : "Pork neck, blessed with just the right amount of lean meat, fat and muscle, is considered one of the tastiest cuts in Asia. The fat throughout the cut will baste and flavor the meat deliciously, keeping it juicy and tender."
                }
            }, {
                "title"       : {
                    "zh" : "CHEF 语录",
                    "en" : "CHEF TALKS"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "事先在肉的表面用刀划出纹路，既能避免猪肉遇热收缩卷起，也能让肉质内部更易受热，缩短煎烤时间。",
                    "en" : "You can check by pressing with a spatula on the thick part of meat; if it is not cooked yet, it will be soft and it will get harder when it’s cooked."
                }
            }, {
                "title"       : {
                    "zh" : "原料",
                    "en" : "Ingredients"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1包 猪颈肉<br/> 1/4个 球生菜<br/> 1颗 香菜<br/> 1包 泰式酸辣汁<br/> 1包 特制香脆粉 2茶匙 色拉油<br/> 1包 蔬菜包（黄瓜、樱桃番茄）",
                    "en" : "1 Pack Pork Neck Meat<br/>1/4 Lettuce<br/>1 Coriander<br/>1 Pack Thai Dipping Sauce<br/>1 Pack Crispy Powder<br/>2 Tablespoon Cooking Oil<br/>1 Pack Mixed Vegetables"
                }
            }
        ],
        "infoIngredient"    : [
            {
                "title"       : {
                    "zh" : "彩椒",
                    "en" : "Bell Pepper"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1/2个",
                    "en" : "1/2"
                }
            }, {
                "title"       : {
                    "zh" : "洋葱",
                    "en" : "Onion"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1/4个",
                    "en" : "1/4"
                }
            }
        ],
        "infoCookingStep"   : [
            {
                "title"       : {
                    "zh" : "",
                    "en" : ""
                },
                "contentType" : "pic",
                "value"       : {
                    "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_2.jpg",
                    "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_2.jpg"
                }
            },
            {
                "title"       : {
                    "zh" : "1、准备工作",
                    "en" : "1. Preparation work"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "球生菜切丝，蔬菜包中的黄瓜切长条薄片，樱桃番茄切成8瓣，香菜切段。猪颈肉顺着肌理划刀痕，不要切断。",
                    "en" : "Slice the lettuce, cut the cucumber in half and slice; cut cherry tomatoes into 8 wedges, cut coriander into sections. Score the pork neck meat along the grain (make sure not to sever)."
                }
            },
            {
                "title"       : {
                    "zh" : "",
                    "en" : ""
                },
                "contentType" : "pic",
                "value"       : {
                    "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_5.jpg",
                    "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_5.jpg"
                }
            },
            {
                "title"       : {
                    "zh" : "2、煎猪颈肉",
                    "en" : "2. Fry the pork neck meat"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "大火烧热平底锅，倒入全部色拉油，调小火，放入猪颈肉，先煎无刀痕的一面，煎至该面呈焦黄色（约30秒），翻面继续煎至各面均呈焦黄色，刀缝中的肉变色。捞出沥油。",
                    "en" : "Heat the pan over high heat, pour in all cooking oil, switch to low heat and place in pork neck meat. Fry the unscored side first until golden (about 30 seconds), flip and fry other sides till all sides turns golden and the meat’s color in the slit changes too. Take out and drain."
                }
            },
            {
                "title"       : {
                    "zh" : "",
                    "en" : ""
                },
                "contentType" : "pic",
                "value"       : {
                    "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_7.jpg",
                    "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_7.jpg"
                }
            },
            {
                "title"       : {
                    "zh" : "3、切猪颈肉",
                    "en" : "3. Slice the pork neck meat"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "斜刀将猪颈肉切薄片。",
                    "en" : "Slice thinly the pork neck meat with oblique cutting."
                }
            },
            {
                "title"       : {
                    "zh" : "",
                    "en" : ""
                },
                "contentType" : "pic",
                "value"       : {
                    "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_15.jpg",
                    "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/ThaiStylePanfriedPorkNeck_15.jpg"
                }
            },
            {
                "title"       : {
                    "zh" : "4、摆盘",
                    "en" : "4. Plate your dish"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "把球生菜丝铺在盘中，浇入泰式酸辣汁拌匀。把切好的猪颈肉铺在生菜丝上，摆上黄瓜、樱桃番茄，撒上香脆粉和香菜，即可享用！",
                    "en" : "Arrange sliced lettuce on a platter. Drizzle with Thai sauce and mix well. Lay the sliced pork neck meat on the lettuce, sprinkle with crispy powder and coriander. Serve hot!"
                }
            },
        ],
        "cook"              : {
            "user" : "5583c96c7313f6c849c3aeb1",
            "tips" : {
                "zh" : "一般般",
                "en" : "not bad"
            }
        },
        "priceOriginal"     : 48,
        "priceWholesale"    : [
            {
                "quantity" : 1,
                "price"    : 45,
            }
        ],
        "preferences"       : [
            {
                "name"         : {
                    "zh" : "牛肉",
                    "en" : "beef"
                },
                "foodMaterial" : [
                    {
                        "dish"      : "5583b7faa2845dec35276b92",
                        "default" : true
                    }, {
                        "dish"      : "5583b7faa2845dec35276b93",
                        "default" : false
                    }
                ]
            }, {
                "name"         : {
                    "zh" : "菌菇",
                    "en" : "mushroom"
                },
                "foodMaterial" : [
                    {
                        "dish"      : "5583b7faa2845dec35276b94",
                        "default" : true
                    }, {
                        "dish"      : "5583b7faa2845dec35276b95",
                        "default" : false
                    }, {
                        "dish"      : "5583b7faa2845dec35276b96",
                        "default" : false
                    }
                ]
            }
        ],
        "topping"           : ["5583b7faa2845dec35276b97", "5583b7faa2845dec35276b98"],
        "tagFilter"         : ["5590d256103f46d9ac31e3ee", "5590d256103f46d9ac31e3f2"]
    },
    {
        "_id"               : ObjectId("558a602a3eba152266ff2c02"),
        "isPublished"       : true,
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "title"             : {
            "zh" : "杏脯西柠鸡",
            "en" : "Almond Flakes Crusted Lemon Chicken with Grapefruit"
        },
        "cover"             : [
            {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/AlmondFlakesCrustedLemonChickenwithGrapefruit_1.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/AlmondFlakesCrustedLemonChickenwithGrapefruit_1.jpg"
            },
            {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/AlmondFlakesCrustedLemonChickenwithGrapefruit_2.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/AlmondFlakesCrustedLemonChickenwithGrapefruit_2.jpg"
            }
        ],
        "difficulty"        : 3,
        "time"              : 20,
        "servings"          : 1,
        "kitchenware"       : [
            {
                "zh" : "平底锅",
                "en" : "pan"
            }
        ],
        "brief"             : {
            "zh" : "这道以泰式香料和新鲜柠檬汁腌制入味的杏脯西柠鸡绝对能在这个夏日将味蕾唤醒。在杏仁脆片的包裹下，鸡肉更显滑嫩多汁，杏仁的回甘也带出了肉质的鲜美。搭配饱满鲜红的西柚果肉，淋上大厨特制西柠汁，酸酸甜甜，清新开胃。",
            "en" : "This Cantonese-style based dish boasts the crunchy texture of the chicken fried to golden brown with a refreshing, tangy and sweet lemon sauce. Instead of flour or breadcrumbs, the boneless chicken thigh is coated with almond flakes, keeping it moist and airy. The use of grapefruit will definitely dress up the chicken with a fancy presentation and wake up your taste buds!"
        },
        "infoUniqueFeature" : [
            {
                "title"       : {
                    "zh" : "你知道吗？",
                    "en" : "Did you know?"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "有机去骨鸡腿肉。鸡腿肉肉质厚实，细嫩弹牙，可以说是鸡肉中最受欢迎的部分之一，适合多种烹调方式。新味的鸡肉来自以色列自然方式哺育的天然肉鸡，100%植物饲料，不含抗生素和其他有害化学物质。所培育的鸡健康强壮，肉质鲜美，鸡味香浓，健康安全，脂肪含量与传统工业方式喂养相比减少30%，更具营养价值。",
                    "en" : "Organic Natural Breeding Chicken. We source this flavorful and healthy chicken from the world class poultry group dedicated to producing healthier poultry by natural breeding methods that eliminate all antibiotics, stimulants, growth catalysts, hormones and other harmful additives usually associated with modern industrial poultry farming. The chicken turns out to be healthier, better tasting and contain 30% less fat than that raised in the traditional industrial manner."
                }
            }, {
                "title"       : {
                    "zh" : "原料",
                    "en" : "Ingredients"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1包 去骨鸡腿肉<br/>2茶匙 杏仁片<br/>1个 西柚<br/>1茶匙 生粉<br/>2汤匙 特制西柠汁<br/>3汤匙 色拉油<br/>1包 香料包（香茅、柠檬叶）",
                    "en" : "1 Pack Boneless Chicken Thigh<br/>2 Tablespoon Almond Flakes<br/>1 Grapefruit<br/>1 Tablespoon Cornstarch<br/>2 Tablespoon Lemon Sauce<br/>3 Tablespoon Cooking Oil<br/>1 Pack Mixed Herb"
                }
            }
        ],
        "infoIngredient"    : [
            {
                "title"       : {
                    "zh" : "彩椒",
                    "en" : "Bell Pepper"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1/2个",
                    "en" : "1/2"
                }
            }, {
                "title"       : {
                    "zh" : "洋葱",
                    "en" : "Onion"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1/4个",
                    "en" : "1/4"
                }
            }
        ],
        "infoCookingStep"   : [
        ],
        "cook"              : {
            "user" : "5583c96c7313f6c849c3aeb1",
            "tips" : {
                "zh" : "一般般",
                "en" : "not bad"
            }
        },
        "priceOriginal"     : 48,
        "priceWholesale"    : [
            {
                "quantity" : 1,
                "price"    : 45,
            }
        ],
        "preferences"       : [
            {
                "name"         : {
                    "zh" : "牛肉",
                    "en" : "beef"
                },
                "foodMaterial" : [
                    {
                        "dish"      : "5583b7faa2845dec35276b92",
                        "default" : true
                    }, {
                        "dish"      : "5583b7faa2845dec35276b93",
                        "default" : false
                    }
                ]
            }, {
                "name"         : {
                    "zh" : "菌菇",
                    "en" : "mushroom"
                },
                "foodMaterial" : [
                    {
                        "dish"      : "5583b7faa2845dec35276b94",
                        "default" : true
                    }, {
                        "dish"      : "5583b7faa2845dec35276b95",
                        "default" : false
                    }, {
                        "dish"      : "5583b7faa2845dec35276b96",
                        "default" : false
                    }
                ]
            }
        ],
        "topping"           : ["5583b7faa2845dec35276b97", "5583b7faa2845dec35276b98"],
        "tagFilter"         : ["5590d256103f46d9ac31e3ee", "5590d256103f46d9ac31e3f2"]
    },
    {
        "_id"               : ObjectId("558a602a3eba152266ff2b81"),
        "isPublished"       : true,
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "title"             : {
            "zh" : "法式水果薄饼",
            "en" : "Fruit Pancake"
        },
        "cover"             : [
            {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/FruitPancake_1.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/FruitPancake_1.jpg"
            }, {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/FruitPancake_2.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/FruitPancake_2.jpg"
            }
        ],
        "difficulty"        : 2,
        "time"              : 10,
        "servings"          : 1,
        "kitchenware"       : [
            {
                "zh" : "平底锅",
                "en" : "pan"
            }
        ],
        "brief"             : {
            "zh" : "对于Pancake的爱不可取代，以至于你会找到城市里只卖各种口味薄饼的餐厅。在家自己动手，你可以更随心所欲，松软的薄饼和火龙果交替落成一座小山，在山顶码上水果，浇点果酱，再撒点糖粉，享受这个游戏般的过程吧，更何况你的游戏成果还很好吃！",
            "en" : "Pancake is a worldwide love for breakfast and you can find pancake house almost everywhere. But homemade pancake is more “you” since you could add whatever you are fond of. Enjoy placing fruit and jam on top of your pancake as if it's a delicious game."
        },
        "infoUniqueFeature" : [
            {
                "title"       : {
                    "zh" : "你知道吗？",
                    "en" : "Did you know?"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "薄饼据说是在史前社会就存在的最古老的一种谷类食物，在公元前5世纪的诗歌中就可以找到用橄榄油煎的Pancake蘸蜂蜜和炼乳被当作早餐的记载。薄饼通常是一个圆形面饼在平底锅上烘烤而成，可根据自己的口味添加果酱、水果、糖浆、巧克力碎片等多种配料。",
                    "en" : "A pancake is a flat cake, often thin, and round, prepared from a starch-based batter and cooked on a hot surface such as a griddle or frying pan.They may be served at any time with a variety of toppings or fillings including jam, fruit, syrup, chocolate chips, or meat. Archaeological evidence suggests that pancakes are probably the earliest and most widespread cereal food eaten in prehistoric societies."
                }
            }, {
                "title": {
                    "zh": "原料",
                    "en": "Ingredients"
                },
                "contentType": "txt",
                "value": {
                    "zh": "1/4杯 薄饼浆<br/> 2汤匙 糖粉<br/> 1包 水果酱<br/>2汤匙 糖油<br/>1/2个 火龙果<br/>1个 小芒果<br/>2汤匙 蓝莓<br/>1汤匙 黄油<br/>1片 薄荷叶",
                    "en": "1/4 Cup House-made Batter<br/>2 Teaspoon Powdered Sugar<br/>1 Pack House-made Jam<br/>2 Teaspoon Syrup<br/>1/2 Pitaya <br/>1 Mango<br/>2 Teaspoon Blueberry<br/>1 Teaspoon Butter<br/>1 Mint Leaf"
                }
            }
        ],
        "infoIngredient"    : [
            {
                "title"       : {
                    "zh" : "1/4杯 薄饼浆",
                    "en" : "1/4 Cup House-made Batter"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1/2个",
                    "en" : "1/2"
                }
            }, {
                "title"       : {
                    "zh" : "洋葱",
                    "en" : "Onion"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "1/4个",
                    "en" : "1/4"
                }
            }
        ],
        "infoCookingStep"   : [
            {
                "title"       : {
                    "zh" : "准备工作",
                    "en" : "Preparation work"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "火龙果剥皮，一半切片，一半切丁。小芒果切丁。",
                    "en" : "Peel the pitaya, slice half of the fruit flesh, and dice the other half. Dice the mango flesh."
                }
            }, {
                "title"       : {
                    "zh" : "制作薄饼",
                    "en" : "Make the pancake"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "平底锅中火加热，抹少许黄油，倒入1/3薄饼浆，形成直径约10cm的圆饼，调小火煎至朝上的一面布满气泡，翻面煎1分钟，至底部呈棕黄色,取出。重复上述过程数次，直至薄饼浆用完。",
                    "en" : "Heat the pan over medium heat, add 1/3 of the butter, pour in 1/3 of the batter, forming a circle with diameter of 10 cm. Switch to low heat, pan-fry till the up side is full of bubbles. Flip side and fry for 1 minute till the bottom side turns brown, take out and set aside. Repeat the process for the remaining batter."
                }
            },
            {
                "title": {
                    "zh": "加热水果酱",
                    "en": "Make the sauce"
                },
                "contentType": "txt",
                "value": {
                    "zh": "中火烧热平底锅，倒入水果酱，煮至冒泡，加入芒果丁，搅拌均匀。",
                    "en": "Heat the pan over medium heat, add the jam, boil till bubbling. Add in diced mango, stir well."
                }
            },
            {
                "title": {
                    "zh": "装盘",
                    "en": "Plate your dish"
                },
                "contentType": "txt",
                "value": {
                    "zh": "盘中放上一块薄饼，铺一层火龙果片；再盖上一块薄饼，铺一层火龙果片，盖上一块薄饼。顶上铺一层火龙果粒，浇上水果酱，摆上蓝莓，筛一层糖粉，最后在中央摆上薄荷叶，根据个人口味蘸取糖油，即可享用。",
                    "en": "Lay one piece of pancake on the plate, spread with sliced pitaya. Repeat the process. Lay diced pitaya on the top of the pancake tower, dress with fruit jam. Lay blueberries on the top, sift in the powdered sugar, lay the mint leaf in the center, dip with syrup to your taste and serve!"
                }
            }
        ],
        "cook"              : {
            "user" : "5583c96c7313f6c849c3aeb1",
            "tips" : {
                "zh" : "一般般",
                "en" : "not bad"
            }
        },
        "priceOriginal"     : 48,
        "priceWholesale"    : [
            {
                "quantity" : 2,
                "price"    : 45
            }
        ],
        "preferences"       : [
        ],
        "topping"           : [
        ],
        "tagFilter"         : [
        ]
    },
    {
        "_id"               : ObjectId("558a602a3eba152266ff2b82"),
        "isPublished"       : true,
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "title"             : {
            "zh" : "香煎银鳕鱼配豆豉汁",
            "en" : "Pan-seared Cod with Black Bean Sauce"
        },
        "cover"             : [
            {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_1.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_1.jpg"
            }, {
                "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_2.jpg",
                "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_2.jpg"
            },
            {
                "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_3.jpg",
                "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_3.jpg"
            },
            {
                "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_4.jpg",
                "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_cover_4.jpg"
            }
        ],
        "difficulty"        : 3,
        "time"              : 15,
        "servings"          : 1,
        "kitchenware"       : [
            {
                "zh" : "平底锅",
                "en" : "pan"
            },
            {
                "zh": "汤锅",
                "en": "pot"
            }
        ],
        "brief"             : {
            "zh" : "将大块结实的冰岛鳕鱼煎到两面金黄，细嫩质地与香脆表皮形成口感对比，佐以大厨自制豆豉汁的咸鲜，更衬托出鱼肉本身的甘美；搭配满目翠绿、清脆微甜的荷兰豆、豌豆，以及樱桃萝卜那一抹亮色，好一出海洋与田园的交响曲！",
            "en" : "The delicate and luscious cod fillets are beautifully seared and served on a bed of green peas, snow peas, white beech mushroom and radish. The taste of fermented, salted black bean sauce makes the dish explode with a unique combination of flavors and textures."
        },
        "infoUniqueFeature" : [
            {
                "title"       : {
                    "zh" : "你知道吗？",
                    "en" : "Did you know?"
                },
                "contentType" : "txt",
                "value"       : {
                    "zh" : "新味的鳕鱼来自冰岛，为大西洋鳕，与太平洋鳕和格陵兰鳕同属世界三大纯正鳕鱼种类。冰岛鳕鱼生长在地球最北部的冰冷深海，冰岛优越的水域、气候和地理条件加上当地丰富的养殖经验使之成为世界上最好的鳕鱼之一。",
                    "en" : "Cods are found from California to Alaska, Florida to Iceland, Europe to Norway, and in Russian waters. We source the cod of highest-quality from Iceland, belonging to Atlantic cod, a unique delicacy available for only a few short months each year, a deep-water fish living deeply in cold Arctic waters. It is a good source of protein, low in fat and contains quantities of vitamin B12 and selenium."
                }
            },
            {
                "title": {
                    "zh": "小提示",
                    "en": "Tips"
                },
                "contentType": "txt",
                "value": {
                    "zh": "这道菜建议使用不粘锅。如果没有不粘锅，在煎鱼前须把锅预热到足够温度，并在热油中撒些盐，这样可以使鱼肉表面更香脆，同时也能在一定程度上防止粘锅。",
                    "en": "You may sprinkle some salt over the hot oil in the pan before searing the fish, in this way to make the cod crisper and keep it from sticking to the pan."
                }
            },
            {
                "title": {
                    "zh": "",
                    "en": ""
                },
                "contentType": "pic",
                "value": {
                    "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_ingredients.jpg",
                    "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_ingredients.jpg"
                }
            },
            {
                "title": {
                    "zh": "原料",
                    "en": "Ingredients"
                },
                "contentType": "txt",
                "value": {
                    "zh": "1/4杯 薄饼浆<br/> 2汤匙 糖粉<br/> 1包 水果酱<br/>2汤匙 糖油<br/>1/2个 火龙果<br/>1个 小芒果<br/>2汤匙 蓝莓<br/>1汤匙 黄油<br/>1片 薄荷叶",
                    "en": "1/4 Cup House-made Batter<br/>2 Teaspoon Powdered Sugar<br/>1 Pack House-made Jam<br/>2 Teaspoon Syrup<br/>1/2 Pitaya <br/>1 Mango<br/>2 Teaspoon Blueberry<br/>1 Teaspoon Butter<br/>1 Mint Leaf"
                }
            }
        ],
        "infoIngredient"    : [
        ],
        "infoCookingStep"   : [
            {
                "title"       : {
                    "zh" : "",
                    "en" : ""
                },
                "contentType" : "pic",
                "value"       : {
                    "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_1.jpg",
                    "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_1.jpg"
                }
            },
            {
                "title": {
                    "zh": "准备工作",
                    "en": "Preparation work"
                },
                "contentType": "txt",
                "value": {
                    "zh": "蔬菜包中的樱桃萝卜切薄片，荷兰豆对半斜切，白玉菇去根，红甜椒切小粒，鳕鱼切半，两面均匀撒上1勺盐和1勺白胡椒，待用。",
                    "en": "Slice the radish in vegetable pack, cut the snow peas in half, discard the stem of white beech mushroom, and dice the red pepper. Cut the cod in half, sprinkle with 1 teaspoon of salt and 1 teaspoon of white pepper, set aside."
                }
            },
            {
                "title": {
                    "zh": "",
                    "en": ""
                },
                "contentType": "pic",
                "value": {
                    "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_2.jpg",
                    "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_2.jpg"
                }
            },
            {
                "title": {
                    "zh": "煮蔬菜",
                    "en": "Boil the vegetables"
                },
                "contentType": "txt",
                "value": {
                    "zh": "汤锅加水，大火烧开，加1勺盐，1/5的色拉油。放入樱桃萝卜，15秒后放入青豆、白玉菇、荷兰豆，水再次烧开后捞出。",
                    "en": "Add water to the pot, bring to boil, add 1 teaspoon of salt and 1/5 of the cooking oil. Add in radish. After 15 seconds, add in green peas, white beech mushroom and snow peas. As the water boils again, take out and drain."
                }
            },
            {
                "title": {
                    "zh": "",
                    "en": ""
                },
                "contentType": "pic",
                "value": {
                    "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_3.jpg",
                    "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_3.jpg"
                }
            },
            {
                "title": {
                    "zh": "炒蔬菜",
                    "en": "Stir-fry the vegetables"
                },
                "contentType": "txt",
                "value": {
                    "zh": "平底锅大火烧热，倒入剩余色拉油的一半，放入煮好的蔬菜，撒1勺盐，半勺白胡椒，翻炒均匀，盛出待用。",
                    "en": "Heat the pan over high heat, pour in half of the remaining oil, put in boiled vegetables, add in 1 teaspoon of salt and 1/2 teaspoon of white pepper. Take out and set aside."
                }
            },
            {
                "title"       : {
                    "zh" : "",
                    "en" : ""
                },
                "contentType" : "pic",
                "value"       : {
                    "zh" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_4.jpg",
                    "en" : "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_4.jpg"
                }
            },
            {
                "title": {
                    "zh": "煎鳕鱼",
                    "en": "Fry the cod"
                },
                "contentType": "txt",
                "value": {
                    "zh": "平底锅大火烧热，倒入剩余色拉油，调小火，放入鳕鱼，先煎鱼皮面约1.5分钟，煎至鱼皮金黄，翻面再煎约2-3分钟。",
                    "en": "Heat the pan over high heat, pour in all the remaining oil, switch to low heat and put in the cod. Fry the skin side first for 1 minute and 30 seconds, till the skin turns gold. Then flip and fry for 2-3 minutes."
                }
            },
            {
                "title": {
                    "zh": "",
                    "en": ""
                },
                "contentType": "pic",
                "value": {
                    "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_5.jpg",
                    "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_5.jpg"
                }
            },
            {
                "title": {
                    "zh": "调味",
                    "en": "Seasoning"
                },
                "contentType": "txt",
                "value": {
                    "zh": "倒入豆豉汁，加50ml清水，煮约1分钟收汁，盛出。锅中留少许汤汁。",
                    "en": "Pour in black bean sauce and add 50ml of water, boil for 1 minute until liquids reduced and absorbed, take out. Reserve some sauce in pan."
                }
            },
            {
                "title": {
                    "zh": "",
                    "en": ""
                },
                "contentType": "pic",
                "value": {
                    "zh": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_6.jpg",
                    "en": "http://7xkf7i.com2.z0.glb.qiniucdn.com/Pan-searedCodwithBlackBeanSauce_step_6.jpg"
                }
            },
            {
                "title": {
                    "zh": "摆盘",
                    "en": "Plate your dish"
                },
                "contentType": "txt",
                "value": {
                    "zh": "将煎好的鳕鱼放在蔬菜上，将红椒粒倒入平底锅中稍微加热，倒在鳕鱼上，即可享用！",
                    "en": "Lay the fried cod on vegetables. Put diced red pepper in the pan and heat up, then pour over the cod. Serve hot!"
                }
            }
        ],
        "cook"              : {
            "user" : "5583c96c7313f6c849c3aeb1",
            "tips" : {
                "zh" : "一般般",
                "en" : "not bad"
            }
        },
        "priceOriginal"     : 58,
        "priceWholesale"    : [
            {
                "quantity" : 2,
                "price"    : 50
            }
        ],
        "preferences"       : [
        ],
        "topping"           : [
        ],
        "tagFilter"         : [
        ]
    }
];


var realReadyToEat = [
    {
        "_id"         : ObjectId("558a602a3eba152266ff2c01"),
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "cover"       : [
            {
                "zh" : "https://dn-xinweicook.qbox.me/EAT照片_MG_0086.jpg",
                "en" : "https://dn-xinweicook.qbox.me/EAT照片_MG_0086.jpg"
            }
        ],
        "brief"       : {
            "zh" : "经典法餐的奢侈享受让你即刻拥有！慢炖至软绵的牛腩富含天然胶质，轻咬牛肉，浓烈的香气伴以黏口的肉汁，长时间的炖煮已将酒精的苦涩去除，只余浓郁丰富的红酒酱汁，是整道菜的精华所在。",
            "en" : "This is a slightly trimmed down version of the iconic French dish, Beef Bourguignon. The beef is so meltingly tender that you can eat them with a spoon whereas the silky, intensely flavored red wine sauce is so tasty that you won’t want to waste even a drop of it."
        },
        "title"       : {"zh" : "红酒烩牛肉", "en" : "Beef Bourguignon"},
        "priceOriginal"     : 30,
        "isPublished" : true
    },
    {
        "_id"         : ObjectId("55b0a302181e6a7007c036e9"),
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "cover"       : [{
            "zh" : "https://dn-xinweicook.qbox.me/EAT照片_MG_0017.jpg",
            "en" : "https://dn-xinweicook.qbox.me/EAT照片_MG_0017.jpg"
        }],
        "brief"       : {
            "en" : "The deep red fermented bean curd sauce combines savory, slightly smoky and fragrant flavors that also bring a hint of sweetness to the pork and lotus root. An aromatic Chinese meat dish that has a great depth of flavor and perfect consistency!",
            "zh" : "绛红亮泽、浓郁丰盈的南乳汁将大厨精心炆腍的莲藕和腩排轻柔包裹，莲藕粉糯，入味十分，腩排已然酥嫩，轻松脱骨，又保持着应有的质感与滋润度，爽而不腻，香口下饭。"
        },
        "title"       : {
            "zh" : "南乳莲藕炆腩排",
            "en" : "Braised Pork Spareribs and Lotus Root with Red Beancurd Sauce"
        },
        "priceOriginal"     : 30,
        "isPublished" : true
    },
    {
        "_id"                   : ObjectId("55b0a37a181e6a7007c0371a"),
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "cover"                 : [{
            "zh"  : "https://dn-xinweicook.qbox.me/EAT照片_MG_0027.jpg",
            "en"  : "https://dn-xinweicook.qbox.me/EAT照片_MG_0027.jpg"
        }],
        "brief"                 : {
            "zh" : "将整块有机去骨鸡腿肉烤制得金黄焦香，滑嫩多汁，吸饱了大厨自制的醇浓照烧酱，拌上粒粒晶透白米饭，饱足一餐，元气满满！",
            "en" : "A gourmet specialty of grilled chicken thighs glazed with our homemade teriyaki sauce. Tender and moist chicken, steamed rice and sweet-salty sauce create an entrée packed with Asian flavor."
        },
        "title"                 : {"zh" : "照烧鸡腿", "en" : "Teriyaki Chicken Thigh"},
        "priceOriginal"     : 30,
        "isPublished"           : true
    },
    {
        "_id"                   : ObjectId("55b0a37a181e6a7007c0371b"),
        "sortId"            : 100,
        "cookingType"       : "ready to eat",
        "sideDishType"      : "main",
        "setType"           : "single",
        "cover"                 : [
            {
                "zh"  : "https://dn-xinweicook.qbox.me/EAT照片_MG_0115.jpg",
                "en"  : "https://dn-xinweicook.qbox.me/EAT照片_MG_0115.jpg"
            },
            {
                "zh"  : "https://dn-xinweicook.qbox.me/EAT照片_MG_0119.jpg",
                "en"  : "https://dn-xinweicook.qbox.me/EAT照片_MG_0119.jpg"
            }],
        "brief"                 : {
            "zh" : "爽爽落落一碟港式小炒，红葱已然慢火煸透，嗞嗞作响间，浓缩的甘美渗入馥郁醇厚的豆豉，裹挟着焦香嫩滑的去骨鸡腿肉，锁住丰富肉汁，入口即知妙不可言。",
            "en" : "This dish is a delicious combination of tender chicken thighs, red peppers, shallots, ginger, garlic and homemade black bean sauce, which, after slow cooking by our own chef, lends to the chicken a subtle fermented flavor and a wonderful nutty taste."
        },
        "title"                 : {"zh" : "豆豉鸡球", "en" : "Sautéed Chicken with Black Bean Sauce"},
        "priceOriginal"     : 30,
        "isPublished"           : true
    }
];

module.exports = {
    userAdmin : userAdmin,
    dishFilter : dishFilterList,
    sampleReadyToEat : realReadyToEat

};
