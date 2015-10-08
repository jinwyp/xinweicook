/**
 * Created by jinwyp on 9/17/15.
 */





exports.userNewComerRate = function(req, res, next) {

    var result = {
        totalUserCount : 0,
        totalUserLast7dayCount : 0,
        totalPurchasedUserCount : 0,

        purchased1TimeUserCount : 0,
        purchased2TimeUserCount : 0,
        purchased2MoreTimeUserCount : 0,
        purchased3MoreTimeUserCount : 0
    };


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var last7Day = today.clone().subtract(7, 'days');
    var last15Day = today.clone().subtract(15, 'days');



    var queryAll = {};
    var queryLast7Day = {};
    var queryLast7DayOrderGte1 = {};
    var queryLast7DayOrderGte2 = {};
    var queryLast7DayOrderGte3 = {};
    var queryLast7DayOrder1 = {};
    var queryLast7DayOrder2 = {};



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
        queryLast7DayOrderGte1 = { createdAt:{ "$lt": last7Day }, sharedInvitationSendCodeTotalCount:{"$gte": 1} };

        queryLast7DayOrder1 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$eq": 1} };
        queryLast7DayOrder2 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$eq": 2} };

        queryLast7DayOrderGte2 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        queryLast7DayOrderGte3 = { createdAt:{"$lt": today}, sharedInvitationSendCodeTotalCount:{"$gte": 3} };

    }else{
        queryAll = {};
        queryLast7Day = { createdAt:{"$lt": last7Day } };
        queryLast7DayOrderGte1 = { createdAt:{"$lt": last7Day }, sharedInvitationSendCodeTotalCount:{"$gte": 1} };

        queryLast7DayOrder1 = {  sharedInvitationSendCodeTotalCount:{"$eq": 1} };
        queryLast7DayOrder2 = {  sharedInvitationSendCodeTotalCount:{"$eq": 2} };

        queryLast7DayOrderGte2 = {  sharedInvitationSendCodeTotalCount:{"$gte": 2} };
        queryLast7DayOrderGte3 = {  sharedInvitationSendCodeTotalCount:{"$gte": 3} };

    }


    var promiseList = [
        models.user.count(queryAll).execAsync(),
        models.user.count(queryLast7Day).execAsync(),

        models.user.count(queryLast7DayOrderGte1).execAsync(),

        models.user.count(queryLast7DayOrder1).execAsync(),
        models.user.count(queryLast7DayOrder2).execAsync(),

        models.user.count(queryLast7DayOrderGte2).execAsync(),
        models.user.count(queryLast7DayOrderGte3).execAsync()
    ];

    Promise.all(promiseList).spread(function(resultTotalUserCount, resultUserLast7dayCount, resultTotalPurchasedUserCount, resultPurchased1TimeUserCount, resultPurchased2TimeUserCount, resultPurchased2MoreTimeUserCount, resultPurchased3MoreTimeUserCount){

        result.totalUserCount = resultTotalUserCount;
        result.totalUserLast7dayCount = resultUserLast7dayCount;
        result.totalPurchasedUserCount = resultTotalPurchasedUserCount;

        result.purchased1TimeUserCount = resultPurchased1TimeUserCount;
        result.purchased2TimeUserCount = resultPurchased2TimeUserCount;
        result.purchased2MoreTimeUserCount = resultPurchased2MoreTimeUserCount;
        result.purchased3MoreTimeUserCount = resultPurchased3MoreTimeUserCount;

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


    var today = moment().startOf('day');

    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        today = moment(req.query.createdAt).startOf('day');
    }

    var last7Day = today.clone().subtract(7, 'days');
    var last15Day = today.clone().subtract(15, 'days');


    var query = {};
    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        //query = { createdAt:{"$gte": new Date(req.query.createdAt), "$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };

        query = { createdAt:{"$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
    }else{
        query = { createdAt:{"$lt": today }, sharedInvitationSendCodeTotalCount:{"$gte": 2} };
    }



    var orderStatus = [];
    orderStatus.push(models.order.constantStatus().finished, models.order.constantStatus().paid);

    models.user.find(query).execAsync()
    .then(function(resultUserList){
        userIdList = resultUserList.map(function(user){
            return user._id.toString()
        });
        //console.log(userIdList);

        return models.order.find({user:{$in:userIdList}, isChildOrder:false, cookingType:"ready to eat", status:{$in:orderStatus} }).sort({user:1, createdAt:1}).execAsync();
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