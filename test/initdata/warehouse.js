/**
 * Created by jinwyp on 11/13/15.
 */





var warehouseList = [
    {
        "_id"                  : "56332187594b09af6e6c7dd2",
        "name"                 : "xinweioffice",
        "locationGeoLatitude"  : 31.195693,
        "locationGeoLongitude" : 121.467155,
        "displayName"          : {"zh" : "新味办公室", "en" : "Xinwei Office"},
        "address"              : "中山南二路510号",
        "deliveryRange"        : 6000,
        "sortId"               : 1000,
        "isActivated"          : true
    },
    {
        "_id"                  : "56332196594b09af6e6c7dd7",
        "name"                 : "caohejing1",
        "locationGeoLatitude"  : 31.175474,
        "locationGeoLongitude" : 121.40523,
        "displayName"          : {"zh" : "漕河泾仓库", "en" : "Caohejing warehouse"},
        "address"              : "虹梅路2008号虹梅大楼",
        "deliveryRange"        : 1500,
        "sortId"               : 900,
        "isActivated"          : true
    },
    {
        "_id"                  : "564ab6de2bde80bd10a9bc60",
        "name"                 : "lujiazui1",
        "locationGeoLatitude"  : 31.243494,
        "locationGeoLongitude" : 121.527943,
        "displayName"          : {"zh" : "陆家嘴仓库", "en" : "Lujiazui warehouse"},
        "address"              : "东方路227号",
        "deliveryRange"        : 2500,
        "sortId"               : 800,
        "isActivated"          : true,

        "polygonPointList" : [
            {
                "sortId" : "0",
                "title"  : "浦电路崂山路",

                "longitude" : "121.53231",
                "latitude"  : "31.225758"

            },
            {
                "sortId" : "1",
                "title"  : "浦电路福山路",

                "longitude" : "121.538858",
                "latitude"  : "31.22802"

            },
            {
                "sortId" : "2",
                "title"  : "世纪大道1666号",

                "longitude" : "121.543188",
                "latitude"  : "31.229294"

            },
            {
                "sortId" : "3",
                "title"  : "松林路浦电路",

                "longitude" : "121.542925",
                "latitude"  : "31.231473"

            },
            {
                "sortId" : "4",
                "title"  : "源深路浦电路",

                "longitude" : "121.544073",
                "latitude"  : "31.231953"

            },
            {
                "sortId" : "5",
                "title"  : "浦东大道源深路",

                "longitude" : "121.535898",
                "latitude"  : "31.246866"

            },
            {
                "sortId" : "6",
                "title"  : "昌邑路源深路",

                "longitude" : "121.534522",
                "latitude"  : "31.248631"

            },
            {
                "sortId" : "7",
                "title"  : "滨江大道源深路",

                "longitude" : "121.533805",
                "latitude"  : "31.249664"

            },
            {
                "sortId" : "8",
                "title"  : "黄浦江点1",

                "longitude" : "121.533457",
                "latitude"  : "31.25224"

            },
            {
                "sortId" : "9",
                "title"  : "黄浦江点2",

                "longitude" : "121.5125",
                "latitude"  : "31.251923"

            },
            {
                "sortId" : "10",
                "title"  : "黄浦江点3",

                "longitude" : "121.499546",
                "latitude"  : "31.245702"

            },
            {
                "sortId" : "11",
                "title"  : "黄浦江点4",

                "longitude" : "121.501924",
                "latitude"  : "31.23934"

            },
            {
                "sortId" : "12",
                "title"  : "黄浦江点5",

                "longitude" : "121.511303",
                "latitude"  : "31.231899"

            },
            {
                "sortId" : "13",
                "title"  : "黄浦江点6",

                "longitude" : "121.517663",
                "latitude"  : "31.221801"
            }
        ]

    }

];

module.exports = warehouseList;