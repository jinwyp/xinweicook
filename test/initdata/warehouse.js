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
        "deliveryRange"        : 6100,
        "sortId"               : 100,
        "isActivated"          : true
    },
    {
        "_id"                  : "56332196594b09af6e6c7dd7",
        "name"                 : "caohejing1",
        "locationGeoLatitude"  : 31.17546886907618,
        "locationGeoLongitude" : 121.4051452465212,
        "displayName"          : {"zh" : "漕河泾仓库", "en" : "Caohejing Warehouse"},
        "address"              : "虹梅路2008号虹梅大楼",
        "deliveryRange"        : 1500,
        "sortId"               : 95,
        "isActivated"          : true
    },
    {
        "_id"                  : "564ab6de2bde80bd10a9bc60",
        "name"                 : "lujiazui1",
        "locationGeoLatitude"  : 31.24232042013846,
        "locationGeoLongitude" : 121.5277729316883,
        "displayName"          : {"zh" : "陆家嘴仓库", "en" : "Lujiazui Warehouse"},
        "address"              : "东方路286号",
        "deliveryRange"        : 2500,
        "sortId"               : 90,
        "isActivated"          : true,

        "polygonPointList" : [
            {
                "sortId" : 10,
                "title"  : "浦电路崂山路",

                "longitude" : "121.53231",
                "latitude"  : "31.225758"
            },

            {
                "sortId" : 11,
                "title"  : "浦电路东方路",

                "longitude" : "121.53514",
                "latitude"  : "31.226636"
            },
            {
                "sortId" : 12,
                "title"  : "东方路1130号",

                "longitude" : "121.535742",
                "latitude"  : "31.224637"
            },
            {
                "sortId" : 13,
                "title"  : "东方路1264号",

                "longitude" : "121.535796",
                "latitude"  : "31.221892"
            },
            {
                "sortId" : 14,
                "title"  : "东方路峨山路",

                "longitude" : "121.535526",
                "latitude"  : "31.220531"
            },
            {
                "sortId" : 15,
                "title"  : "东方路杨高南路",

                "longitude" : "121.540939",
                "latitude"  : "31.22062"
            },
            {
                "sortId" : 16,
                "title"  : "杨高南路378",

                "longitude" : "121.543014",
                "latitude"  : "31.225881"
            },
            {
                "sortId" : 17,
                "title"  : "源深路杨高中路",

                "longitude" : "121.545457",
                "latitude"  : "31.229058"
            },


            //{
            //    "sortId" : 22,
            //    "title"  : "浦电路福山路",
            //
            //    "longitude" : "121.538858",
            //    "latitude"  : "31.22802"
            //},
            //{
            //    "sortId" : 23,
            //    "title"  : "世纪大道1666号",
            //
            //    "longitude" : "121.543188", //121.5413912432196
            //    "latitude"  : "31.229294"   //31.22950665779515
            //
            //},
            //{
            //    "sortId" : 24,
            //    "title"  : "松林路浦电路",
            //
            //    "longitude" : "121.542925",
            //    "latitude"  : "31.231473"
            //
            //},
            {
                "sortId" : 25,
                "title"  : "源深路浦电路",

                "longitude" : "121.544073",
                "latitude"  : "31.231953"

            },
            {
                "sortId" : 26,
                "title"  : "浦东大道源深路",

                "longitude" : "121.535898",
                "latitude"  : "31.246866"

            },
            {
                "sortId" : 27,
                "title"  : "昌邑路源深路",

                "longitude" : "121.534522",
                "latitude"  : "31.248631"

            },
            {
                "sortId" : 28,
                "title"  : "滨江大道源深路",

                "longitude" : "121.533805",
                "latitude"  : "31.249664"

            },
            {
                "sortId" : 29,
                "title"  : "黄浦江点1",

                "longitude" : "121.533457",
                "latitude"  : "31.25224"

            },
            {
                "sortId" : 30,
                "title"  : "黄浦江点2",

                "longitude" : "121.5125",
                "latitude"  : "31.251923"

            },
            {
                "sortId" : 31,
                "title"  : "黄浦江点3",

                "longitude" : "121.499546",
                "latitude"  : "31.245702"

            },
            {
                "sortId" : 32,
                "title"  : "黄浦江点4",

                "longitude" : "121.501924",
                "latitude"  : "31.23934"

            },
            {
                "sortId" : 33,
                "title"  : "黄浦江点5",

                "longitude" : "121.511303",
                "latitude"  : "31.231899"

            },
            {
                "sortId" : 34,
                "title"  : "黄浦江点6",

                "longitude" : "121.517663",
                "latitude"  : "31.221801"
            }
        ]

    },
    {
        "_id"                  : "56c41a9e632771df68dbae0b",
        "name"                 : "pujiangzhen1",
        "locationGeoLatitude"  : 31.102757,
        "locationGeoLongitude" : 121.513828,
        "displayName"          : {"zh" : "浦江镇仓库", "en" : "Pujiangzhen Warehouse"},
        "address"              : "陈行公路2388号浦江科技广场",
        "deliveryRange"        : 300,
        "sortId"               : 80,
        "isActivated"          : true,

        "polygonPointList" : [
            {
                "sortId" : 1,
                "title"  : "浦星公路陈行公路",

                "longitude" : "121.512929",
                "latitude"  : "31.100967"
            },
            {
                "sortId" : 2,
                "title"  : "大刘家宅陈行公路",

                "longitude" : "121.517425",
                "latitude"  : "31.103614"
            },
            {
                "sortId" : 3,
                "title"  : "大刘家宅",

                "longitude" : "121.516423",
                "latitude"  : "31.1063"
            },
            {
                "sortId" : 4,
                "title"  : "浦星公路",

                "longitude" : "121.511303",
                "latitude"  : "31.105342"
            }
        ]
    }

];

module.exports = warehouseList;
