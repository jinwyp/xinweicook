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


    var timeNow = moment();
    var today = moment().startOf('day');
    var last7Day = today.clone().subtract(7, 'days');
    var last15Day = today.clone().subtract(15, 'days');



    var promiseList = [
        models.user.count().execAsync(),
        models.user.count({ createdAt:{"$lt": timeNow } }).execAsync(),

        models.user.count({ createdAt:{"$lt": timeNow }, sharedInvitationSendCodeTotalCount:{"$gte": 1} }).execAsync(),
        models.user.count({ createdAt:{"$lt": timeNow }, sharedInvitationSendCodeTotalCount:{"$eq": 1} }).execAsync(),
        models.user.count({ createdAt:{"$lt": timeNow }, sharedInvitationSendCodeTotalCount:{"$eq": 2} }).execAsync(),

        models.user.count({ createdAt:{"$lt": timeNow }, sharedInvitationSendCodeTotalCount:{"$gte": 2} }).execAsync(),
        models.user.count({ createdAt:{"$lt": timeNow }, sharedInvitationSendCodeTotalCount:{"$gte": 3} }).execAsync()
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
    });




};

