/**
 * Created by jinwyp on 9/17/15.
 */





exports.userNewComerRate = function(req, res, next) {

    var result = {
        totalUserCount : 0,
        totalUserLast7dayCount : 0,
        totalPurchasedUserCount : 0,

        purchased2MoreTimeUserCount : 0,
        purchased3MoreTimeUserCount : 0,

        totalTime : 0,
        totalOrderNumber : 0,
        avgTime : 0,
        twoMoreTimeUserListWithOrder : []
    };

    var purchasedUserIdList = {
        oneMoreTime : [],
        twoMoreTime : [],
        threeMoreTime : []
    };


    var today = moment().startOf('day');
    //console.log(today.format("YYYY-MM-DD hh:mm:ss"));

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var last7Day = today.clone().subtract(7, 'days');

    var orderStatus = [];
    orderStatus.push(models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished);

    var cookingType = [];
    cookingType.push( models.dish.constantCookingType().eat);




    var queryAll = {};
    var queryLast7Day = {};
    var queryLast7DayOrderGte1 = {};
    var queryLast7DayOrderGte2 = {};
    var queryLast7DayOrderGte3 = {};



    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        //queryAll = {  createdAt: {"$gte": new Date(req.query.createdAt)} };
        //queryLast7Day = { createdAt:{"$gte": new Date(req.query.createdAt), "$lt": last7Day } };
        //queryLast7DayOrderGte1 = { createdAt:{"$gte": new Date(req.query.createdAt), "$lt": last7Day }, sharedInvitationSendCodeTotalCount:{"$gte": 1} };
        //
        //queryLast7DayOrder1 = { createdAt:{"$gte": new Date(req.query.createdAt)}, sharedInvitationSendCodeTotalCount:{"$eq": 1} };
        //queryLast7DayOrder2 = { createdAt:{"$gte": new Date(req.query.createdAt)}, sharedInvitationSendCodeTotalCount:{"$eq": 2} };
        //
        //queryLast7DayOrderGte2 = { createdAt:{"$gte": new Date(req.query.createdAt)}, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        //queryLast7DayOrderGte3 = { createdAt:{"$gte": new Date(req.query.createdAt)}, sharedInvitationSendCodeTotalCount:{"$gte": 3} };

        queryAll = {  createdAt:{"$lt": today } };
        queryLast7Day = { createdAt:{ "$lt": last7Day } };

        queryLast7DayOrderGte1 = { createdAt:{ "$lt": last7Day }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        queryLast7DayOrderGte2 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 3} };
        queryLast7DayOrderGte3 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 4} };

    }else{
        queryAll = {};
        queryLast7Day = { createdAt:{"$lt": last7Day } };

        queryLast7DayOrderGte1 = { createdAt:{"$lt": last7Day }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        queryLast7DayOrderGte2 = {  sharedInvitationSendCodeTotalCount:{"$gte": 3} };
        queryLast7DayOrderGte3 = {  sharedInvitationSendCodeTotalCount:{"$gte": 4} };

    }




    var pipeline = [];
    var pipelineLast7Day = [];

    // Grouping pipeline
    pipeline.push(
        {
            "$match" : {
                "createdAt" : {"$lt": today.toDate() },
                "isChildOrder" : false,
                "cookingType"  : {$in : cookingType},
                "status"       : {$in : orderStatus}
            }
        },

        { $sort: { user: 1, createdAt: 1 } },

        { "$group": {
            "_id": "$user",

            "firstOrderDate": { $first: "$createdAt" },
            "firstOrderId": { $first: "$_id" },
            "firstOrderNumber": { $first: "$orderNumber" },
            "firstOrderTotalPrice": { $first: "$totalPrice" },
            "firstOrderContactPerson": { $first: "$address.contactPerson" },
            "firstOrderContactMobile": { $first: "$address.mobile" },
            "orderList": { "$push": { "_id": "$_id", "user": "$user",  "orderNumber": "$orderNumber", "createdAt": "$createdAt", "contactPerson": "$address.contactPerson", "contactMobile": "$address.mobile", "totalPrice": "$totalPrice"  } }
        }},

        { "$sort": { "firstOrderDate" : 1 } },

        { "$limit": 100000 }
    );

    pipelineLast7Day.push(
        {
            "$match" : {
                "createdAt" : {"$lt": last7Day.toDate() },
                "isChildOrder" : false,
                "cookingType"  : {$in : cookingType},
                "status"       : {$in : orderStatus}
            }
        },

        { $sort: { user: 1, createdAt: 1 } },

        { "$group": {
            "_id": "$user",

            "firstOrderDate": { $first: "$createdAt" },
            "firstOrderId": { $first: "$_id" },
            "firstOrderNumber": { $first: "$orderNumber" },
            "firstOrderTotalPrice": { $first: "$totalPrice" },
            "firstOrderContactPerson": { $first: "$address.contactPerson" },
            "firstOrderContactMobile": { $first: "$address.mobile" },
            "orderList": { "$push": { "_id": "$_id", "user": "$user",  "orderNumber": "$orderNumber", "createdAt": "$createdAt", "contactPerson": "$address.contactPerson", "contactMobile": "$address.mobile", "totalPrice": "$totalPrice"  } }
        }},

        { "$sort": { "firstOrderDate" : 1 } },

        { "$limit": 100000 }
    );

    //if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
    //
    //    pipeline[0].$match.createdAt  = {"$lt": today.toDate() };
    //
    //}


    var promiseList = [
        models.user.count(queryAll).execAsync(),
        models.user.count(queryLast7Day).execAsync(),

        models.user.count(queryLast7DayOrderGte1).execAsync(),
        models.user.count(queryLast7DayOrderGte2).execAsync(),
        models.user.count(queryLast7DayOrderGte3).execAsync(),

        models.order.aggregateAsync( pipeline),
        models.order.aggregateAsync( pipelineLast7Day)
    ];

    Promise.all(promiseList).spread(function(resultTotalUserCount, resultUserLast7dayCount, resultTotalPurchasedUserCount, resultPurchased2MoreTimeUserCount, resultPurchased3MoreTimeUserCount, resultOrderList, resultOrderListLast7Day){

        var twoMoreTimeUserListWithOrder = [];

        result.totalUserCount = resultTotalUserCount;
        result.totalUserLast7dayCount = resultUserLast7dayCount;

        //result.totalPurchasedUserCount = resultTotalPurchasedUserCount;

        //result.purchased2MoreTimeUserCount = resultPurchased2MoreTimeUserCount;
        //result.purchased3MoreTimeUserCount = resultPurchased3MoreTimeUserCount;


        resultOrderListLast7Day.forEach(function(user){
            if (user.orderList.length >= 1){
                purchasedUserIdList.oneMoreTime.push(user._id);
            }
        });

        resultOrderList.forEach(function(user){

            if (user.orderList.length >= 2){
                purchasedUserIdList.twoMoreTime.push(user._id);
                twoMoreTimeUserListWithOrder.push(user);
            }
            if (user.orderList.length >= 3){
                purchasedUserIdList.threeMoreTime.push(user._id);
            }
        });


        twoMoreTimeUserListWithOrder.forEach(function(user){
            console.log(user._id);
            var first,second;

            var orderLength = user.orderList.length;

            for(var i=0; i<orderLength ; i++) {
                first = user.orderList[i];

                if (i < orderLength - 1 ){
                    second = user.orderList[i+1];

                    first.secondOrderInterval = moment(second.createdAt).diff(moment(first.createdAt), 'hours');

                    console.log(first.secondOrderInterval);
                    if (typeof user.totalTime === 'undefined'){
                        user.totalTime = 0;
                        user.totalOrderNumber = 0;
                    }

                    user.totalTime = user.totalTime + first.secondOrderInterval;
                    user.totalOrderNumber = user.totalOrderNumber + 1;

                }

            }

        });



        result.totalPurchasedUserCount = purchasedUserIdList.oneMoreTime.length;
        result.purchased2MoreTimeUserCount = purchasedUserIdList.twoMoreTime.length;
        result.purchased3MoreTimeUserCount = purchasedUserIdList.threeMoreTime.length;


        result.twoMoreTimeUserListWithOrder = twoMoreTimeUserListWithOrder;


        for(var j=0; j<twoMoreTimeUserListWithOrder.length ; j++){

            result.totalTime = result.totalTime + twoMoreTimeUserListWithOrder[j].totalTime;
            result.totalOrderNumber = result.totalOrderNumber + twoMoreTimeUserListWithOrder[j].totalOrderNumber;

        }

        result.avgTime = result.totalTime / result.totalOrderNumber;

        res.send(result)
    })
    .catch(next);



};




exports.userLoyalUserPurchaseFrequency = function(req, res, next) {

    // 购买便当两次和两次以上的用户 已支付 已完成订单, 每次订单时间间隔平均值

    var result = {
        totalTime : 0,
        totalOrderNumber : 0,
        avgTime : 0
    };

    var userIdList = [];
    var userList =[];
    var userDataHash = {};


    var queryUser = {};
    var queryOrder = {};


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');

        //query = { createdAt:{"$gte": new Date(req.query.createdAt), "$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        queryUser = { createdAt:{"$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 3} };

    }else{
        queryUser = { createdAt:{"$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 3} };
    }

    var last7Day = today.clone().subtract(7, 'days');




    var orderStatus = [];
    orderStatus.push(models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished);

    models.user.find(queryUser).execAsync()
    .then(function(resultUserList){
        userIdList = resultUserList.map(function(user){
            return user._id.toString()
        });
        //console.log(userIdList);

        if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
            //query = { createdAt:{"$gte": new Date(req.query.createdAt), "$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };

            queryOrder = { createdAt:{"$lt": today }, user:{$in:userIdList}, isChildOrder:false, cookingType:"ready to eat", status:{$in:orderStatus}};
        }else{
            queryOrder = {user:{$in:userIdList}, isChildOrder:false, cookingType:"ready to eat", status:{$in:orderStatus} };
        }


        return models.order.find(queryOrder).sort({user:1, createdAt:1}).execAsync();
    }).then(function(resultOrderList){



        if (resultOrderList.length > 0){

            var first,second, nextUserId;

            for(var i=0; i<resultOrderList.length ; i++){
                first = resultOrderList[i];
                if (i < resultOrderList.length - 1 ){
                    nextUserId = resultOrderList[i+1].user.toString();


                    if (resultOrderList[i].user.toString() === nextUserId){
                        second = resultOrderList[i+1];
                        first.secondOrderCreateDate = second.createdAt;
                        first.secondOrderInterval = moment(second.createdAt).diff(moment(first.createdAt), 'hours');

                        console.log(first.secondOrderInterval);
                        if ( typeof userDataHash[resultOrderList[i].user.toString()] === 'undefined'){
                            userDataHash[resultOrderList[i].user.toString()] = {
                                totalTime : 0,
                                totalOrderNumber : 1,
                                orderList : []
                            };
                        }else{
                            userDataHash[resultOrderList[i].user.toString()].totalTime = userDataHash[resultOrderList[i].user.toString()].totalTime + first.secondOrderInterval;
                            userDataHash[resultOrderList[i].user.toString()].totalOrderNumber = userDataHash[resultOrderList[i].user.toString()].totalOrderNumber + 1;
                            //userDataHash[resultOrderList[i].user.toString()].orderList.push(first)
                        }

                    }else{
                        console.log(nextUserId);
                    }


                }


                //console.log( first._id, first.user, first.address.contactPerson,  first.createdAt, first.secondOrderCreateDate, first.secondOrderInterval)

            }
        }


        if (userIdList.length > 0){
            for(var j=0; j<userIdList.length ; j++){

                if (typeof userDataHash[userIdList[j]] != 'undefined'){
                    userList.push({
                        _id : userIdList[j],
                        totalTime : userDataHash[userIdList[j]].totalTime,
                        totalOrderNumber : userDataHash[userIdList[j]].totalOrderNumber,
                        avgTime : userDataHash[userIdList[j]].totalTime / userDataHash[userIdList[j]].totalOrderNumber
                    });

                    result.totalTime = result.totalTime + userDataHash[userIdList[j]].totalTime;
                    result.totalOrderNumber = result.totalOrderNumber + userDataHash[userIdList[j]].totalOrderNumber
                }

            }

            result.avgTime = result.totalTime / result.totalOrderNumber
        }

        res.send(result)
    }).catch(next);






};















exports.userGetFirstOrderDaily = function(req, res, next) {

    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var orderStatus = [];
    orderStatus.push(models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished);

    var cookingType = [];
    cookingType.push( models.dish.constantCookingType().eat);


    var pipeline = [];

    // Grouping pipeline
    pipeline.push(
        {
            "$match" : {
                "isChildOrder" : false,
                "cookingType"  : {$in : cookingType},
                "status"       : {$in : orderStatus}
            }
        },

        { $sort: { user: 1, createdAt: 1 } },

        { "$group": {
            "_id": "$user",

            "firstOrderDate": { $first: "$createdAt" },
            "firstOrderId": { $first: "$_id" },
            "firstOrderNumber": { $first: "$orderNumber" },
            "firstOrderTotalPrice": { $first: "$totalPrice" },
            "firstOrderContactPerson": { $first: "$address.contactPerson" },
            "firstOrderContactMobile": { $first: "$address.mobile" },
            "orderList": { "$push": { "_id": "$_id", "user": "$user",  "orderNumber": "$orderNumber", "createdAt": "$createdAt", "contactPerson": "$address.contactPerson", "contactMobile": "$address.mobile", "totalPrice": "$totalPrice"  } }
        }},

        { "$sort": { "firstOrderDate" : 1 } },



        { $project :{
            _id : 1,
            firstOrderDate : 1,
            firstOrderId : 1,
            firstOrderNumber: 1,
            "firstOrderTotalPrice": 1,
            "firstOrderContactPerson": 1,
            "firstOrderContactMobile": 1,
            orderList : 1,

            year: { $year: "$firstOrderDate" },
            month: { $month: "$firstOrderDate" },
            day: { $dayOfMonth: "$firstOrderDate" },
            hour: { $hour: "$firstOrderDate" },
            minutes: { $minute: "$firstOrderDate" },
            dayOfYear: { $dayOfYear: "$firstOrderDate" },
            dayOfWeek: { $dayOfWeek: "$firstOrderDate" },
            week: { $week: "$firstOrderDate" },

            "hour" : {  "$hour" : "$firstOrderDate" },
            "minute" : {"$minute" : "$firstOrderDate"},
            "second" : { "$second" : "$firstOrderDate"},
            "millisecond" : {"$millisecond" : "$firstOrderDate"}
        }},


        { $project :{
            _id : 1,
            firstOrderDate : 1,
            firstOrderId : 1,
            firstOrderNumber: 1,
            "firstOrderTotalPrice": 1,
            "firstOrderContactPerson": 1,
            "firstOrderContactMobile": 1,
            orderList : 1,

            year: 1,
            month: 1,
            day: 1,
            hour: 1,
            minutes: 1,
            dayOfYear: 1,
            dayOfWeek: 1,
            week: 1,

            "hour" : 1,
            "minute" : 1,
            "second" : 1,
            "millisecond" : 1,

            date : {"$subtract" : [ "$firstOrderDate",
                {"$add" : [ "$millisecond",
                    {"$multiply" : ["$second", 1000]},
                    {"$multiply" : ["$minute",60,1000]},
                    {"$multiply" : ["$hour", 60, 60,1000]}
                ]}
            ]}
        }},


        { "$group": {
            "_id":  "$date",
            "userQuantity": { "$sum": 1 },
            "userList": { "$push": { "_id": "$firstOrderId", "orderCreatedAt": "$firstOrderDate", "user": "$_id", "orderNumber": "$firstOrderNumber",  "orderContactPerson": "$firstOrderContactPerson", "orderContactMobile": "$firstOrderContactMobile", "totalPrice": "$firstOrderTotalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "date" : "$_id",
            "userQuantity": 1,
            "userList": 1

        }},

        { "$sort": { "date" : 1} },
        { "$limit": 1000 }
    );


    //if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
    //
    //    pipeline[0].$match.createdAt  = {"$lt": today.toDate() };
    //
    //}

    models.order.aggregateAsync( pipeline).then(function(resultOrderList){

        res.send(resultOrderList)
    }).catch(next);

};

