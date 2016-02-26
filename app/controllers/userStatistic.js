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
        purchased4MoreTimeUserCount : 0,
        purchased5MoreTimeUserCount : 0,
        purchased6MoreTimeUserCount : 0,
        purchased7MoreTimeUserCount : 0,

        shareTotal : {
            purchased1MoreTimeUserCount : 0,
            purchased2MoreTimeUserCount : 0,
            purchased3MoreTimeUserCount : 0,
            purchased4MoreTimeUserCount : 0,
            purchased5MoreTimeUserCount : 0,
            purchased6MoreTimeUserCount : 0,
            purchased7MoreTimeUserCount : 0
        },


        twoMoreTotalTime : 0,
        twoMoreTotalOrderNumber : 0,
        twoMoreAvgTime : 0,
        twoMoreTimeUserListWithOrder : []
    };

    var purchasedUserIdList = {
        oneMoreTime : [],
        twoMoreTime : [],
        threeMoreTime : [],
        fourMoreTime : [],
        fiveMoreTime : [],
        sixMoreTime : [],
        sevenMoreTime : []
    };


    var today = moment().startOf('day');
    //console.log(today.format("YYYY-MM-DD hh:mm:ss"));

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var last7Day = today.clone().subtract(7, 'days');

    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];

    var cookingType = [models.dish.constantCookingType().eat];



    var queryAll = {};
    var queryLast7Day = {};
    var queryLast7DayOrderGte1 = {};
    var queryLast7DayOrderGte2 = {};
    var queryLast7DayOrderGte3 = {};
    var queryLast7DayOrderGte4 = {};
    var queryLast7DayOrderGte5 = {};
    var queryLast7DayOrderGte6 = {};
    var queryLast7DayOrderGte7 = {};



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
        queryLast7DayOrderGte4 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 5} };
        queryLast7DayOrderGte5 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 6} };
        queryLast7DayOrderGte6 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 7} };
        queryLast7DayOrderGte7 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 8} };

    }else{
        queryAll = {};
        queryLast7Day = { createdAt:{"$lt": last7Day } };

        queryLast7DayOrderGte1 = { createdAt:{"$lt": last7Day }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        queryLast7DayOrderGte2 = {  sharedInvitationSendCodeTotalCount:{"$gte": 3} };
        queryLast7DayOrderGte3 = {  sharedInvitationSendCodeTotalCount:{"$gte": 4} };
        queryLast7DayOrderGte4 = {  sharedInvitationSendCodeTotalCount:{"$gte": 5} };
        queryLast7DayOrderGte5 = {  sharedInvitationSendCodeTotalCount:{"$gte": 6} };
        queryLast7DayOrderGte6 = {  sharedInvitationSendCodeTotalCount:{"$gte": 7} };
        queryLast7DayOrderGte7 = {  sharedInvitationSendCodeTotalCount:{"$gte": 8} };

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
        models.user.count(queryLast7DayOrderGte4).execAsync(),
        models.user.count(queryLast7DayOrderGte5).execAsync(),
        models.user.count(queryLast7DayOrderGte6).execAsync(),
        models.user.count(queryLast7DayOrderGte7).execAsync(),

        models.order.aggregateAsync( pipeline),
        models.order.aggregateAsync( pipelineLast7Day)
    ];

    Promise.all(promiseList).spread(function(resultTotalUserCount, resultUserLast7dayCount, resultTotalPurchasedUserCount, resultPurchased2MoreTimeUserCount, resultPurchased3MoreTimeUserCount, resultPurchased4MoreTimeUserCount, resultPurchased5MoreTimeUserCount, resultPurchased6MoreTimeUserCount, resultPurchased7MoreTimeUserCount, resultOrderList, resultOrderListLast7Day){

        var twoMoreTimeUserListWithOrder = [];

        result.totalUserCount = resultTotalUserCount;
        result.totalUserLast7dayCount = resultUserLast7dayCount;

        result.shareTotal.purchased1MoreTimeUserCount = resultTotalPurchasedUserCount;

        result.shareTotal.purchased2MoreTimeUserCount = resultPurchased2MoreTimeUserCount;
        result.shareTotal.purchased3MoreTimeUserCount = resultPurchased3MoreTimeUserCount;
        result.shareTotal.purchased4MoreTimeUserCount = resultPurchased4MoreTimeUserCount;
        result.shareTotal.purchased5MoreTimeUserCount = resultPurchased5MoreTimeUserCount;
        result.shareTotal.purchased6MoreTimeUserCount = resultPurchased6MoreTimeUserCount;
        result.shareTotal.purchased7MoreTimeUserCount = resultPurchased7MoreTimeUserCount;

        //console.log("2user:", resultPurchased2MoreTimeUserCount, resultPurchased3MoreTimeUserCount, resultPurchased4MoreTimeUserCount);

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
            if (user.orderList.length >= 4){
                purchasedUserIdList.fourMoreTime.push(user._id);
            }
            if (user.orderList.length >= 5){
                purchasedUserIdList.fiveMoreTime.push(user._id);
            }
            if (user.orderList.length >= 6){
                purchasedUserIdList.sixMoreTime.push(user._id);
            }
            if (user.orderList.length >= 7){
                purchasedUserIdList.sevenMoreTime.push(user._id);
            }

        });


        result.totalPurchasedUserCount = purchasedUserIdList.oneMoreTime.length;
        result.purchased2MoreTimeUserCount = purchasedUserIdList.twoMoreTime.length;
        result.purchased3MoreTimeUserCount = purchasedUserIdList.threeMoreTime.length;
        result.purchased4MoreTimeUserCount = purchasedUserIdList.fourMoreTime.length;
        result.purchased5MoreTimeUserCount = purchasedUserIdList.fiveMoreTime.length;
        result.purchased6MoreTimeUserCount = purchasedUserIdList.sixMoreTime.length;
        result.purchased7MoreTimeUserCount = purchasedUserIdList.sevenMoreTime.length;


        result.twoMoreTimeUserListWithOrder = twoMoreTimeUserListWithOrder;


        twoMoreTimeUserListWithOrder.forEach(function(user){

            var first,second;

            var orderLength = user.orderList.length;

            for(var i=0; i<orderLength ; i++) {
                first = user.orderList[i];

                if (i < orderLength - 1 ){
                    second = user.orderList[i+1];

                    first.secondOrderInterval = moment(second.createdAt).diff(moment(first.createdAt), 'hours');

                    //console.log(first.secondOrderInterval);
                    if (typeof user.twoMoreTotalTime === 'undefined'){
                        user.twoMoreTotalTime = 0;
                        user.twoMoreTotalOrderNumber = 0;
                    }

                    user.twoMoreTotalTime = user.twoMoreTotalTime + first.secondOrderInterval;
                    user.twoMoreTotalOrderNumber = user.twoMoreTotalOrderNumber + 1;

                }

            }

        });




        for(var j=0; j<twoMoreTimeUserListWithOrder.length ; j++){

            result.twoMoreTotalTime = result.twoMoreTotalTime + twoMoreTimeUserListWithOrder[j].twoMoreTotalTime;
            result.twoMoreTotalOrderNumber = result.twoMoreTotalOrderNumber + twoMoreTimeUserListWithOrder[j].twoMoreTotalOrderNumber;

        }

        result.twoMoreAvgTime = result.twoMoreTotalTime / result.twoMoreTotalOrderNumber;

        res.send(result);
    })
    .catch(next);



};




exports.userLoyalUserPurchaseFrequency = function(req, res, next) {

    // 购买便当两次和两次以上的用户 已支付 已完成订单, 每次订单时间间隔平均值



    var userIdList = [];
    var userList =[];
    var userDataHash = {};


    var queryUser = {};
    var queryOrder = {};


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    //query = { createdAt:{"$gte": new Date(req.query.createdAt), "$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
    queryUser = { createdAt:{"$lt": today.toDate() }, sharedInvitationSendCodeTotalCount:{"$gte": 3} };

    var last7Day = today.clone().subtract(7, 'days');


    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];
    queryOrder = {
        isChildOrder:false,
        cookingType:"ready to eat",
        status:{$in:orderStatus}
    };

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        queryOrder.warehouse = ObjectId(req.query.warehouse.toString())
    }


    models.user.find(queryUser).execAsync().then(function(resultUserList){
        userIdList = resultUserList.map(function(user){
            return user._id.toString();
        });

        queryOrder.user = {$in:userIdList};


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

                        //console.log(first.secondOrderInterval);
                        if ( typeof userDataHash[resultOrderList[i].user.toString()] === 'undefined'){
                            userDataHash[resultOrderList[i].user.toString()] = {
                                totalIntervalTime : 0,
                                totalIntervalCount : 0,
                                orderList : []
                            };
                        }

                        userDataHash[resultOrderList[i].user.toString()].totalIntervalTime = userDataHash[resultOrderList[i].user.toString()].totalIntervalTime + first.secondOrderInterval;
                        userDataHash[resultOrderList[i].user.toString()].totalIntervalCount = userDataHash[resultOrderList[i].user.toString()].totalIntervalCount + 1;
                        //userDataHash[resultOrderList[i].user.toString()].orderList.push(first)

                    }else{
                        //console.log(nextUserId);
                    }


                }


                //console.log( first._id, first.user, first.address.contactPerson,  first.createdAt, first.secondOrderCreateDate, first.secondOrderInterval)

            }
        }

        var result = {
            orderTotalIntervalTime : 0,
            orderTotalIntervalCount: 0,
            orderAvgTime : 0,

            userTotalIntervalTime : 0,
            userCount : 0,
            userAvgTime : 0
        };

        if (userIdList.length > 0){
            for(var j=0; j<userIdList.length ; j++){

                if (typeof userDataHash[userIdList[j]] != 'undefined'){
                    userList.push({
                        _id : userIdList[j],
                        totalIntervalTime : userDataHash[userIdList[j]].totalIntervalTime,
                        totalIntervalCount : userDataHash[userIdList[j]].totalIntervalCount,
                        avgTime : userDataHash[userIdList[j]].totalIntervalTime / userDataHash[userIdList[j]].totalIntervalCount
                    });

                    result.userTotalIntervalTime = result.userTotalIntervalTime + userDataHash[userIdList[j]].totalIntervalTime / userDataHash[userIdList[j]].totalIntervalCount;

                    result.orderTotalIntervalTime = result.orderTotalIntervalTime + userDataHash[userIdList[j]].totalIntervalTime;
                    result.orderTotalIntervalCount = result.orderTotalIntervalCount + userDataHash[userIdList[j]].totalIntervalCount;

                }

            }

            result.userCount = userIdList.length;

            result.userAvgTime = result.userTotalIntervalTime / userIdList.length;
            result.orderAvgTime = result.orderTotalIntervalTime / result.orderTotalIntervalCount;
        }

        res.send(result);
    }).catch(next);



};







exports.userOrderFrequency = function(req, res, next) {

    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];

    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }


    var matchList = {
        isChildOrder : false,
        status       : {$in : orderStatus},
        createdAt    :  {"$lt" : today.toDate()}
    };


    if (typeof req.query.statisticsClientFrom !== 'undefined' && req.query.statisticsClientFrom !== '') {
        matchList.clientFrom  = req.query.statisticsClientFrom;
    }

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }



    var pipelineEat = [];

    var project = {
        _id : 1,
        createdAt : 1,
        user : 1,
        orderNumber: 1,
        isSplitOrder : 1,
        isChildOrder : 1,
        childOrderList : 1,
        cookingType : 1,

        clientFrom : 1,
        payment : 1,
        paymentUsedCash : 1,
        isPaymentPaid : 1,

        deliveryDateTime : 1,


        promotionCode : 1,
        promotionDiscount : 1,
        coupon : 1,
        couponDiscount : 1,
        accountUsedDiscount : 1,

        dishesPrice : 1,
        freight : 1,
        totalPrice : 1,

        packageType : 1,


        year: { $year: {$add:["$createdAt",28800000]}  },
        month: { $month: {$add:["$createdAt",28800000]}  },
        day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
        hour: { $hour: {$add:["$createdAt",28800000]}  },
        minute: { $minute: {$add:["$createdAt",28800000]}  },
        "second" : { "$second" : {$add:["$createdAt",28800000]} },
        "millisecond" : {"$millisecond" : {$add:["$createdAt",28800000]} },
        dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
        dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
        week: { $week: {$add:["$createdAt",28800000]}  }
    };



    pipelineEat.push(
        { "$match":matchList},
        { $project :project},

        { "$sort": { "user" : 1, "createdAt": 1 } },

        { "$group": {
            "_id": { user : "$user", cookingType:"$cookingType"},

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },
            "saleAvgTotalPrice": { "$avg": "$totalPrice" },
            "saleDishesPrice": { "$sum": "$dishesPrice" },
            "saleAvgDishesPrice": { "$avg": "$dishesPrice" },
            "saleFreight": { "$sum": "$freight" },
            "saleAvgFreight": { "$avg": "$freight" },

            "salePromotionDiscount": { "$sum": "$promotionDiscount" },
            "saleAvgPromotionDiscount": { "$avg": "$promotionDiscount" },

            "saleCouponDiscount": { "$sum": "$couponDiscount" },
            "saleAvgCouponDiscount": { "$avg": "$couponDiscount" },

            "saleAccountUsedDiscount": { "$sum": "$accountUsedDiscount" },
            "saleAvgAccountUsedDiscount": { "$avg": "$accountUsedDiscount" },

            "cookTypeList": { "$addToSet":  "$cookingType" },
            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "cookingType":"$cookingType", "totalPrice": "$totalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "user" : "$_id.user",
            "cookingType" : "$_id.cookingType",

            "saleQuantity": 1,
            "saleTotalPrice": 1,
            "saleAvgTotalPrice": 1,
            "saleDishesPrice": 1,
            "saleAvgDishesPrice": 1,
            "saleFreight": 1,
            "saleAvgFreight": 1,

            "salePromotionDiscount": 1,
            "saleAvgPromotionDiscount": 1,

            "saleCouponDiscount": 1,
            "saleAvgCouponDiscount": 1,

            "saleAccountUsedDiscount": 1,
            "saleAvgAccountUsedDiscount": 1,

            "cookTypeList": 1,
            "orderList": 1

        }},

        { "$sort": { "user" : 1, "cookingType": 1 } },
        { "$limit": 5000 }
    );



    models.order.aggregateAsync( pipelineEat).then(function(resultOrder){

        var result = {
            eatOrderUser : 0,
            eatOrder : 0,
            eatOrderAvg : 0,
            eatOrderMax : 0,
            cookOrderUser : 0,
            cookOrder : 0,
            cookOrderAvg : 0,
            cookOrderMax : 0,


            eatUserOrderTotalAvgTime : 0,
            eatUserWith2Order : 0,
            eatUserOrderAvgInterval : 0,

            cookUserOrderTotalAvgTime : 0,
            cookUserWith2Order : 0,
            cookUserOrderAvgInterval : 0,


            eatAllTotalIntervalTime : 0,
            eatAllTotalIntervalCount : 0,
            eatAllTotalAvgInterval : 0,

            cookAllTotalIntervalTime : 0,
            cookAllTotalIntervalCount : 0,
            cookAllTotalAvgInterval : 0
        };


        resultOrder.forEach(function(user){
            var totalUserOrderTime = 0;
            var totalUserIntervalCount = 0;

            if (user.orderList.length > 1){
                user.orderList.reduce(function(previousOrder, currentOrder, currentOrderIndex){
                    //console.log(previousOrder.createdAt, currentOrder.createdAt, moment(currentOrder.createdAt).diff(moment(previousOrder.createdAt), 'hours'), totalUserOrderTime, user.cookingType, user.user);

                    if (user.cookingType === models.dish.constantCookingType().eat){
                        if (moment(currentOrder.createdAt).week() === moment(previousOrder.createdAt).week() ){
                            totalUserOrderTime = totalUserOrderTime + moment(currentOrder.createdAt).diff(moment(previousOrder.createdAt), 'hours');
                            totalUserIntervalCount = totalUserIntervalCount + 1;
                        }
                    }else{
                        totalUserOrderTime = totalUserOrderTime + moment(currentOrder.createdAt).diff(moment(previousOrder.createdAt), 'hours');
                        totalUserIntervalCount = totalUserIntervalCount + 1;
                    }

                    return currentOrder
                });

                user.totalUserOrderTime = totalUserOrderTime;
                user.totalUserIntervalCount = totalUserIntervalCount;

                if (totalUserIntervalCount === 0){
                    console.log("----:", user.user, user.cookingType, user.orderList.length)
                    user.avgIntervalTime = 0;
                }else{
                    user.avgIntervalTime = user.totalUserOrderTime / user.totalUserIntervalCount;
                }

                if (user.cookingType === models.dish.constantCookingType().eat){
                    result.eatUserOrderTotalAvgTime = result.eatUserOrderTotalAvgTime +  user.avgIntervalTime;
                    result.eatUserWith2Order = result.eatUserWith2Order + 1;

                    result.eatAllTotalIntervalTime = result.eatAllTotalIntervalTime +  user.totalUserOrderTime;
                    result.eatAllTotalIntervalCount = result.eatAllTotalIntervalCount + user.totalUserIntervalCount;
                }else{
                    result.cookUserOrderTotalAvgTime = result.cookUserOrderTotalAvgTime +  user.avgIntervalTime;
                    result.cookUserWith2Order = result.cookUserWith2Order + 1;

                    result.cookAllTotalIntervalTime = result.cookAllTotalIntervalTime +  user.totalUserOrderTime;
                    result.cookAllTotalIntervalCount = result.cookAllTotalIntervalCount + user.totalUserIntervalCount;
                }

            }



            if (user.cookingType === models.dish.constantCookingType().eat){
                result.eatOrder = result.eatOrder +  user.saleQuantity;
                result.eatOrderUser = result.eatOrderUser + 1;

                if (user.saleQuantity >= result.eatOrderMax){
                    result.eatOrderMax = user.saleQuantity
                }
            }

            if (user.cookingType === models.dish.constantCookingType().cook){
                result.cookOrder = result.cookOrder +  user.saleQuantity;
                result.cookOrderUser = result.cookOrderUser + 1;

                if (user.saleQuantity >= result.cookOrderMax){
                    result.cookOrderMax = user.saleQuantity
                }
            }


        });

        result.eatOrderAvg = result.eatOrder / result.eatOrderUser;
        result.cookOrderAvg = result.cookOrder / result.cookOrderUser;

        result.eatUserOrderAvgInterval = result.eatUserOrderTotalAvgTime / result.eatUserWith2Order;
        result.cookUserOrderAvgInterval = result.cookUserOrderTotalAvgTime / result.cookUserWith2Order;

        result.eatAllTotalAvgInterval = result.eatAllTotalIntervalTime / result.eatAllTotalIntervalCount;
        result.cookAllTotalAvgInterval = result.cookAllTotalIntervalTime / result.cookAllTotalIntervalCount;

        res.status(200).json(result);
    }).catch(next);


};




















exports.userGetFirstEatOrderDaily = function(req, res, next) {

    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];

    var cookingType = [models.dish.constantCookingType().eat];


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }


    var matchList = {
        "isChildOrder" : false,
        "cookingType"  : {$in : cookingType},
        "status"       : {$in : orderStatus},
        "createdAt"    : {"$lt" : today.toDate()}
    };


    if (typeof req.query.statisticsClientFrom !== 'undefined' && req.query.statisticsClientFrom !== '') {
        matchList.clientFrom  = req.query.statisticsClientFrom;
    }

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


    var pipelineUserFirstOrder = [];
    var pipeline = [];

    // Grouping pipeline
    pipelineUserFirstOrder.push(
        { "$match":matchList},

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

            year: { $year: {$add:["$firstOrderDate",28800000]} },
            month: { $month: {$add:["$firstOrderDate",28800000]} },
            day: { $dayOfMonth: {$add:["$firstOrderDate",28800000]} },
            hour: { $hour: {$add:["$firstOrderDate",28800000]} },
            "minute" : {"$minute" : {$add:["$firstOrderDate",28800000]}},
            "second" : { "$second" : {$add:["$firstOrderDate",28800000]}},
            "millisecond" : {"$millisecond" : {$add:["$firstOrderDate",28800000]}},
            dayOfYear: { $dayOfYear: {$add:["$firstOrderDate",28800000]} },
            dayOfWeek: { $dayOfWeek: {$add:["$firstOrderDate",28800000]} },
            week: { $week: {$add:["$firstOrderDate",28800000]} }

        }},


        //{ $project :{
        //    _id : 1,
        //    firstOrderDate : 1,
        //    firstOrderId : 1,
        //    firstOrderNumber: 1,
        //    "firstOrderTotalPrice": 1,
        //    "firstOrderContactPerson": 1,
        //    "firstOrderContactMobile": 1,
        //    orderList : 1,
        //
        //    year: 1,
        //    month: 1,
        //    day: 1,
        //    hour: 1,
        //    "minute" : 1,
        //    "second" : 1,
        //    "millisecond" : 1,
        //    dayOfYear: 1,
        //    dayOfWeek: 1,
        //    week: 1,
        //
        //    date : {"$subtract" : [ {$add:["$firstOrderDate",28800000]},
        //        {"$add" : [ "$millisecond",
        //            {"$multiply" : ["$second", 1000]},
        //            {"$multiply" : ["$minute",60,1000]},
        //            {"$multiply" : ["$hour", 60, 60,1000]}
        //        ]}
        //    ]}
        //}},


        { "$group": {
            "_id": { day : "$day", month : "$month", year : "$year"},
            //"_id":  "$date",

            "userQuantity": { "$sum": 1 },
            "userList": { "$push": { "_id": "$firstOrderId", "orderCreatedAt": "$firstOrderDate", "user": "$_id", "orderNumber": "$firstOrderNumber",  "orderContactPerson": "$firstOrderContactPerson", "orderContactMobile": "$firstOrderContactMobile", "totalPrice": "$firstOrderTotalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "day" : "$_id.day",
            "month" : "$_id.month",
            "year" : "$_id.year",
            "date" :  { $concat: [ {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}, "-", {$substr: ["$_id.day", 0, 2]}] },

            //"date" :  { $concat: [  {$substr: ["$_id", 0, 10]}] },
            "userQuantity": 1,
            "userList": 1

        }},

        { "$sort": { "date" : 1} },
        { "$limit": 20000 }
    );



    pipeline.push(
        { "$match":matchList},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: {$add:["$createdAt",28800000]}  },
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minute: { $minute: {$add:["$createdAt",28800000]}  },
            "second" : { "$second" : {$add:["$createdAt",28800000]} },
            "millisecond" : {"$millisecond" : {$add:["$createdAt",28800000]} },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }

        }},

        { "$group": {
            "_id": { day : "$day", month : "$month", year : "$year", user : "$user"},

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },

            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "userId" : "$_id.user",
            "day" : "$_id.day",
            "month" : "$_id.month",
            "year" : "$_id.year",
            "date" :  { $concat: [ {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}, "-", {$substr: ["$_id.day", 0, 2]}] },

            "saleQuantity": 1,
            "saleTotalPrice": 1,

            "orderList": 1

        }},

        { "$group": {
            "_id": { day : "$day", month : "$month", year : "$year"},

            "userDailyCount": { "$sum": 1 },
            "userDailyList": { "$push": {  "userId": "$userId", "saleQuantity": "$saleQuantity", "saleTotalPrice": "$saleTotalPrice"   } }
        }},

        { $project :{
            _id : 0,
            "day" : "$_id.day",
            "month" : "$_id.month",
            "year" : "$_id.year",
            "date" :  { $concat: [ {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}, "-", {$substr: ["$_id.day", 0, 2]}] },

            "userDailyCount": 1,
            "userDailyList": 1

        }},


        { "$sort": { "year" : 1, "month": 1, "day": 1  } },
        { "$limit": 20000 }


    );

    var promiseList = [
        models.order.aggregateAsync( pipelineUserFirstOrder),
        models.order.aggregateAsync( pipeline)
    ];


    Promise.all(promiseList).spread(function(resultUserFirstOrder, resultOrder){

        var tempObj = {};
        resultUserFirstOrder.map(function(user){
            tempObj[user.date] = user
        });


        resultOrder.forEach(function(user){
            user.userFisrtOrderQuantity = 0;
            user.userFisrtOrderPercent = 0;
            user.userFisrtOrderList = [];

            if (typeof tempObj[user.date] !== 'undefined'){
                user.userFisrtOrderQuantity = tempObj[user.date].userQuantity;
                user.userFisrtOrderPercent = (tempObj[user.date].userQuantity / user.userDailyCount * 100).toFixed(0);
                user.userFisrtOrderList = tempObj[user.date].userList;
            }
        });
        res.send(resultOrder);

    }).catch(next);



};




















exports.userGetOrderWeekly = function(req, res, next) {

    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }


    var matchList = {
        "isChildOrder" : false,
        "status"       : {$in : orderStatus},
        "createdAt"    : {"$lt" : today.toDate()}
    };

    if (typeof req.query.statisticsClientFrom !== 'undefined' && req.query.statisticsClientFrom !== '') {
        matchList.clientFrom  = req.query.statisticsClientFrom;
    }

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


    var pipeline = [];


    // Grouping pipeline
    pipeline.push(
        { "$match":matchList},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: {$add:["$createdAt",28800000]}  },
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minute: { $minute: {$add:["$createdAt",28800000]}  },
            "second" : { "$second" : {$add:["$createdAt",28800000]} },
            "millisecond" : {"$millisecond" : {$add:["$createdAt",28800000]} },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }

        }},

        { "$sort": { "createdAt" : 1 } },

        { "$group": {
            "_id": { week : "$week", year : "$year", user : "$user"},

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },


            "cookTypeList": { "$addToSet":  "$cookingType" },
            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } },

            "firstDate" : { $first: "$createdAt" }
        }},


        { $project :{
            _id : 0,
            "userId" : "$_id.user",
            "week" : "$_id.week",
            "year" : "$_id.year",
            "date" :  { $concat: [  {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.week", 0, 2]}] },
            "date2" :  { $concat: [  {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.week", 0, 2]}, " (", {$substr: ["$firstDate", 5, 5]}, ")"] },

            "saleQuantity": 1,
            "saleTotalPrice": 1,


            "cookTypeList": 1,
            "orderList": 1,

            "firstDate": 1

        }},

        { "$sort": { "year" : 1, "week": 1 } },
        { "$limit": 20000 }


    );

    models.order.aggregateAsync( pipeline).then(function(resultOrderList){

        var weekList = [];
        var result = [];

        if (resultOrderList.length > 0){
            resultOrderList.map(function(user){

                if (weekList.indexOf(user.date) === -1 ){
                    weekList.push(user.date);
                }
            });

            weekList.forEach(function(week){
                var weekResult = {
                    date : week,
                    date2 : week,
                    typeAll : 0,
                    typeAllUsers : [],
                    typeEat : 0,
                    typeEatUsers : [],
                    typeCook : 0,
                    typeCookUsers : []
                };


                resultOrderList.map(function(user){

                    if (weekResult.date === user.date){
                        weekResult.date2 = user.date2;

                        if (user.cookTypeList.length > 1){
                            weekResult.typeAll = weekResult.typeAll + 1;
                            weekResult.typeAllUsers.push(user);
                        }else if (user.cookTypeList.indexOf('ready to eat') > -1){
                            weekResult.typeEat = weekResult.typeEat + 1;
                            weekResult.typeEatUsers.push(user);
                        }else{
                            weekResult.typeCook = weekResult.typeCook + 1;
                            weekResult.typeCookUsers.push(user);
                        }


                    }
                });

                result.push(weekResult);

            });



        }
        res.send(result);
    }).catch(next);
};





exports.userGetOrderMonthly = function(req, res, next) {

    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var matchList = {
        "isChildOrder" : false,
        "status"       : {$in : orderStatus},
        "createdAt"    : {"$lt" : today.toDate()}
    };

    if (typeof req.query.statisticsClientFrom !== 'undefined' && req.query.statisticsClientFrom !== '') {
        matchList.clientFrom  = req.query.statisticsClientFrom;
    }

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


    var pipeline = [];

    // Grouping pipeline
    pipeline.push(
        { "$match":matchList},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: {$add:["$createdAt",28800000]}  },
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minute: { $minute: {$add:["$createdAt",28800000]}  },
            "second" : { "$second" : {$add:["$createdAt",28800000]} },
            "millisecond" : {"$millisecond" : {$add:["$createdAt",28800000]} },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }

        }},

        { "$group": {
            "_id": { month : "$month", year : "$year", user : "$user"},

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },


            "cookTypeList": { "$addToSet":  "$cookingType" },
            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "userId" : "$_id.user",
            "month" : "$_id.month",
            "year" : "$_id.year",
            "date" :  { $concat: [  {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}] },

            "saleQuantity": 1,
            "saleTotalPrice": 1,


            "cookTypeList": 1,
            "orderList": 1

        }},

        { "$sort": { "year" : 1, "month": 1 } },
        { "$limit": 20000 }


    );

    models.order.aggregateAsync( pipeline).then(function(resultOrderList){

        var monthList = [];
        var result = [];

        if (resultOrderList.length > 0){
            resultOrderList.map(function(user){
                if (monthList.indexOf(user.date) === -1 ){
                    monthList.push(user.date);
                }
            });

            monthList.forEach(function(month){
                var monthResult = {
                    date : month,
                    typeAll : 0,
                    typeAllUsers : [],
                    typeEat : 0,
                    typeEatUsers : [],
                    typeCook : 0,
                    typeCookUsers : []
                };


                resultOrderList.map(function(user){

                    if (monthResult.date === user.date){

                        if (user.cookTypeList.length > 1){
                            monthResult.typeAll = monthResult.typeAll + 1;
                            monthResult.typeAllUsers.push(user);
                        }else if (user.cookTypeList.indexOf('ready to eat') > -1){
                            monthResult.typeEat = monthResult.typeEat + 1;
                            monthResult.typeEatUsers.push(user);
                        }else{
                            monthResult.typeCook = monthResult.typeCook + 1;
                            monthResult.typeCookUsers.push(user);
                        }


                    }
                });

                result.push(monthResult);

            });



        }
        res.send(result);
    }).catch(next);
};





exports.userGetOrderYearly = function(req, res, next) {

    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var matchList = {
        "isChildOrder" : false,
        "status"       : {$in : orderStatus},
        "createdAt"    : {"$lt" : today.toDate()}
    };

    if (typeof req.query.statisticsClientFrom !== 'undefined' && req.query.statisticsClientFrom !== '') {
        matchList.clientFrom  = req.query.statisticsClientFrom;
    }

    if (typeof req.query.warehouse !== 'undefined' && req.query.warehouse !== '') {
        matchList.warehouse = ObjectId(req.query.warehouse.toString())
    }


    var pipeline = [];

    // Grouping pipeline
    pipeline.push(
        { "$match":matchList},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: {$add:["$createdAt",28800000]}  },
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minute: { $minute: {$add:["$createdAt",28800000]}  },
            "second" : { "$second" : {$add:["$createdAt",28800000]} },
            "millisecond" : {"$millisecond" : {$add:["$createdAt",28800000]} },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }

        }},

        { "$group": {
            "_id": { user : "$user"},

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },


            "cookTypeList": { "$addToSet":  "$cookingType" },
            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "userId" : "$_id.user",

            "saleQuantity": 1,
            "saleTotalPrice": 1,


            "cookTypeList": 1,
            "orderList": 1

        }},

        { "$limit": 20000 }


    );

    models.order.aggregateAsync( pipeline).then(function(resultOrderList){
        var result = {

            typeAll : 0,
            typeAllUsers : [],
            typeEat : 0,
            typeEatUsers : [],
            typeCook : 0,
            typeCookUsers : []
        };

        if (resultOrderList.length > 0){

            resultOrderList.map(function(user){

                if (user.cookTypeList.length > 1){
                    result.typeAll = result.typeAll + 1;
                    result.typeAllUsers.push(user);
                }else if (user.cookTypeList.indexOf('ready to eat') > -1){
                    result.typeEat = result.typeEat + 1;
                    result.typeEatUsers.push(user);
                }else{
                    result.typeCook = result.typeCook + 1;
                    result.typeCookUsers.push(user);
                }

            });

        }
        res.send(result);
    }).catch(next);
};

























exports.couponByNameRate = function(req, res, next) {


    var pipeline = [];

    // Grouping pipeline
    pipeline.push(
        {
            "$match" : {
                "couponType" : models.coupon.constantCouponType().coupon
            }
        },

        { $sort: { createdAt: 1 } },

        { "$group": {
            "_id": {name : "$name.zh", isUsed : "$isUsed"},
            "quantity": { "$sum": 1 },
            "couponList": { "$push": { "_id": "$_id", "user": "$user",  "name": "$name", "createdAt": "$createdAt", "couponType": "$couponType", "price": "$price", "isUsedCount": "$isUsedCount", "isUsed": "$isUsed"  } }
        }},

        { $project :{
            _id : 0,
            "name" : "$_id.name",
            "isUsed" : "$_id.isUsed",

            "quantity": 1,
            "couponList": 1

        }},

        { "$sort": { "name" : 1} },
        { "$limit": 100000 }
    );

    models.coupon.aggregateAsync( pipeline).then(function(resultCouponList){

        var totalQuantity = 0;

        if (resultCouponList.length > 0){
            totalQuantity = resultCouponList.reduce(function(previous, order) {
                return previous + order.quantity;
            }, 0);
        }

        resultCouponList[0].totalQuantity = totalQuantity;

        resultCouponList.forEach(function(order){
            order.quantityPercent = order.quantity / totalQuantity;
        });

        res.send(resultCouponList);
    }).catch(next);
};





exports.userAccountDetailsStatistic = function(req, res, next) {

    var pipelineCharged = [];
    var pipelinePurchased = [];

    chargeTypeList = [];
    chargeTypeList.push(models.accountdetail.constantChargeType().alipaydirect);
    chargeTypeList.push(models.accountdetail.constantChargeType().weixinpay);
    chargeTypeList.push(models.accountdetail.constantChargeType().chargecode);

    // Grouping pipeline
    pipelineCharged.push(
        {
            "$match" : {
                "chargeType" : {$in:chargeTypeList}
            }
        },

        { $sort: { createdAt: 1 } },

        { "$group": {
            "_id": {isPaid : "$isPaid", "isPlus" : "$isPlus"},
            "totalAmount": { "$sum": "$amount" },
            "totalAmountXinwei": { "$sum": "$amountXinwei" },
            "accountDetailList": { "$push": { "_id": "$_id", "user": "$user",  "order": "$order", "coupon": "$coupon",  "createdAt": "$createdAt", "chargeType": "$chargeType", "isPlus": "$isPlus", "amount": "$amount", "amountXinwei": "$amountXinwei", "isPaid": "$isPaid", "nameZh": "$name.zh"  } }
        }},

        { $project :{
            _id : 0,
            "isPaid" : "$_id.isPaid",
            "isPlus" : "$_id.isPlus",

            "totalAmount": 1,
            "totalAmountXinwei": 1,
            "accountDetailList": 1

        }},

        { "$sort": { "isPaid" : 1} },
        { "$limit": 100000 }
    );

    // Grouping pipeline
    pipelinePurchased.push(
        {
            "$match" : {
                "isPlus" : false
            }
        },

        { $sort: { createdAt: 1 } },

        { "$group": {
            "_id": {isPaid : "$isPaid", "isPlus" : "$isPlus"},
            "totalAmount": { "$sum": "$amount" },
            "totalAmountXinwei": { "$sum": "$amountXinwei" },
            "accountDetailList": { "$push": { "_id": "$_id", "user": "$user",  "order": "$order", "coupon": "$coupon",  "createdAt": "$createdAt", "chargeType": "$chargeType", "isPlus": "$isPlus", "amount": "$amount", "amountXinwei": "$amountXinwei", "isPaid": "$isPaid", "nameZh": "$name.zh"  } }
        }},

        { $project :{
            _id : 0,
            "isPaid" : "$_id.isPaid",
            "isPlus" : "$_id.isPlus",

            "totalAmount": 1,
            "totalAmountXinwei": 1,
            "accountDetailList": 1

        }},

        { "$sort": { "isPlus" : 1} },
        { "$limit": 100000 }
    );



    var promiseList = [
        models.accountdetail.aggregateAsync( pipelineCharged),
        models.accountdetail.aggregateAsync( pipelinePurchased)
    ];


    Promise.all(promiseList).spread(function(resultCharged, resultPurchased){
        var result = {
            isCharged   : resultCharged,
            isPurchased : resultPurchased
        };
        res.send(result);

    }).catch(next);


};










exports.userList = function(req, res, next) {

    var today = moment().startOf('day');
    var last4month = today.clone().subtract(4, 'months');


    query = {
        "createdAt": { "$gte": last4month.toDate() },
        sharedInvitationSendCodeTotalCount: 1
    };

    models.user.find(query).sort("-createdAt").limit (20000).execAsync().then(function(resultUserList){

        res.send(resultUserList);

    })
    .catch(next);

};



exports.userList2 = function(req, res, next) {

    var today = moment().startOf('month');
    var last2month = today.clone().subtract(1, 'months');

    query = {
        "createdAt": { "$gte": last2month.toDate() },
        sharedInvitationSendCodeTotalCount: { "$gte": 2 }
    };


    var orderStatus = [models.order.constantStatus().paid, models.order.constantStatus().shipped, models.order.constantStatus().finished];
    var cookingType = [models.dish.constantCookingType().eat];

    var matchList = {
        "isChildOrder" : false,
        "status"       : {$in : orderStatus},
        //"cookingType"  : {$in : cookingType},
        "createdAt"    : {"$gte" : last2month.toDate()}
    };


    var pipeline = [];

    // Grouping pipeline
    pipeline.push(
        { "$match":matchList},


        { $project :{
            _id : 1,
            createdAt : 1,
            user : 1,
            orderNumber: 1,
            isSplitOrder : 1,
            isChildOrder : 1,
            childOrderList : 1,
            cookingType : 1,

            clientFrom : 1,
            payment : 1,
            paymentUsedCash : 1,
            isPaymentPaid : 1,

            deliveryDateTime : 1,


            promotionCode : 1,
            promotionDiscount : 1,
            coupon : 1,
            couponDiscount : 1,
            accountUsedDiscount : 1,

            dishesPrice : 1,
            freight : 1,
            totalPrice : 1,

            packageType : 1,


            year: { $year: {$add:["$createdAt",28800000]}  },
            month: { $month: {$add:["$createdAt",28800000]}  },
            day: { $dayOfMonth: {$add:["$createdAt",28800000]}  },
            hour: { $hour: {$add:["$createdAt",28800000]}  },
            minute: { $minute: {$add:["$createdAt",28800000]}  },
            "second" : { "$second" : {$add:["$createdAt",28800000]} },
            "millisecond" : {"$millisecond" : {$add:["$createdAt",28800000]} },
            dayOfYear: { $dayOfYear: {$add:["$createdAt",28800000]}  },
            dayOfWeek: { $dayOfWeek: {$add:["$createdAt",28800000]}  },
            week: { $week: {$add:["$createdAt",28800000]}  }

        }},

        { "$group": {
            "_id": { month : "$month", year : "$year", user : "$user"},

            "saleQuantity": { "$sum": 1 },
            "saleTotalPrice": { "$sum": "$totalPrice" },


            "cookTypeList": { "$addToSet":  "$cookingType" },
            "orderList": { "$push": { "_id": "$_id", "createdAt": "$createdAt", "user": "$user", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice"   } }
        }},


        { $project :{
            _id : 0,
            "userId" : "$_id.user",
            "month" : "$_id.month",
            "year" : "$_id.year",
            "date" :  { $concat: [  {$substr: ["$_id.year", 0, 4]}, "-", {$substr: ["$_id.month", 0, 2]}] },

            "saleQuantity": 1,
            "saleTotalPrice": 1,


            "cookTypeList": 1,
            "orderList": 1

        }},

        { "$sort": { "year" : 1, "month": 1 } },
        { "$limit": 20000 }


    );

    models.order.aggregateAsync( pipeline).then(function(resultOrderList){

        var monthList = [];
        var userListFirstMonth = [];
        var userListSecondMonth = [];
        var userList = [];

        if (resultOrderList.length > 0){
            resultOrderList.map(function(user){
                if (monthList.indexOf(user.date) === -1 ){
                    monthList.push(user.date);
                }

                if (monthList.length > 0){
                    if (monthList[0] === user.date){
                        userListFirstMonth.push(user.userId)
                    }
                }

                if (monthList.length > 1){
                    if (monthList[1] === user.date){
                        userListSecondMonth.push(user.userId)
                    }
                }
            });


            userListFirstMonth.forEach(function(user){
                if (userListSecondMonth.indexOf(user) === -1){
                    userList.push(user);
                }
            });

        }

        models.user.find({_id:{$in:userList}} ).sort("-createdAt").limit (20000).execAsync().then(function(resultUserList){

            res.send(resultUserList);

        })


    }).catch(next);


};

