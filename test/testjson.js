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


alipay = { discount: '0.00',
    payment_type: '1',
    subject: '新味',
    trade_no: '2015070200001000020056308303',
    buyer_email: '18629641521',
    gmt_create: '2015-07-02 15:35:23',
    notify_type: 'trade_status_sync',
    quantity: '1',
    out_trade_no: 'XWORDER399Tf121313',
    seller_id: '2088111042213083',
    notify_time: '2015-07-02 15:35:24',
    body: '新味用',
    trade_status: 'TRADE_SUCCESS',
    is_total_fee_adjust: 'N',
    total_fee: '0.01',
    gmt_payment: '2015-07-02 15:35:24',
    seller_email: 'steve.ge@me.com',
    price: '0.01',
    buyer_id: '2088412033326020',
    notify_id: '5242e77a99040f2c845e80b98f83b21e24',
    use_coupon: 'N',
    sign_type: 'RSA',
    sign: 'MRATG5iMgTJFBw3ksMfKgidJxx2sPtOK42con1bwdQroPaOeBkv6XYZkhYivR0O3uda0vzcme6olG6tdkJhLDm+2SUf1w4DCWNfKjqL/zrUr46lDrbF5KlrcdIKRD3a41FN5gWwctVaOwe7nT+6aw0vqhpwG1uDpe9xGl5brgcY='
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