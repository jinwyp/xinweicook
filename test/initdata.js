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

var dishFilterList = dishFilterTagList1.concat(dishFilterTagList2, dishFilterTagList3);



module.exports = {
    userAdmin : userAdmin,
    dishFilter : dishFilterList

};
