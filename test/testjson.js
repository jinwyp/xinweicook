/**
 * Created by jinwyp on 6/25/15.
 */


user = {
    "address":[
        {
            "geoLatitude" : 20, // 纬度
            "geoLongitude" : 20, // 纬度

            "country" : "china",
            "province": "shanghai",
            "city": "shanghai",
            "district": "shanghai",
            "street" : "枫林路",
            "address": "510号",

            "isTemporary" : false,  //临时地址 下单后变为false
            "isDefault":  false,

            "contactPerson": "xinwei",
            "mobile": "13564568304",
            "alias": "",
            "remark": ""
        }
    ]
}


dish =
{
    "shoppingCart" : [
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "subDish" : [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2
                }
            ]
        },
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "subDish" : [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2
                }
            ]
        }
    ]
};




order =
{
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
        "province": "shanghai",
        "city": "shanghai",
        "district": "shanghai" ,
        "street" : "shanghai" ,
        "address": "xxxxx" ,

        "contactPerson": "wangyupeng" ,
        "mobile": "13564568304" ,
        "remark": "comment"
    },


    "dishList" : [
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "subDish" : [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2
                }
            ]
        },
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "subDish" : [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2
                }
            ]
        }
    ]
};


alipay = {
    discount            : '0.00',
    payment_type        : '1',
    subject             : 'XinWei_ReadyToCook',
    trade_no            : '2015073000001000020058528698',
    buyer_email         : '18629641521',
    gmt_create          : '2015-07-30 17:31:33',
    notify_type         : 'trade_status_sync',
    quantity            : '1',
    out_trade_no        : '201507301731239646112',
    seller_id           : '2088111042213083',
    notify_time         : '2015-07-30 17:31:33',
    body                : 'XinWeiCook',
    trade_status        : 'WAIT_BUYER_PAY',
    is_total_fee_adjust : 'Y',
    total_fee           : '0.01',
    seller_email        : 'steve.ge@me.com',
    price               : '0.01',
    buyer_id            : '2088412033326020',
    notify_id           : 'fb25d93cb256758edbf9015e3b6a2a0724',
    use_coupon          : 'N',
    sign_type           : 'RSA',
    sign                : 'HcV9Tl2ii4Kh7872WYbHNpUjOz5Slh03P0cF4nVFzkUFbKKby9PMPdC1qhKIDTP1kK/gAp3kdao1tQ+A0VsmGgW4UGHnbLLKJBYDtsPuChO2BMxjIVCCWMT84fGJJeBI2QewzE6vWrMRuTct6ewkObOTEQUA2OC6FrUuFECOv90='
};



var deliverTime = [
    {
        day : 11,
        segment : [{
            name : "12",
            text : "10:00 - 12:00",
            status : false
        }]
    }
];