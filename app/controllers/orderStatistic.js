/**
 * Created by jinwyp on 8/6/15.
 */




exports.orderStatisticByAddress = function(req, res, next) {

    var pipeline = [];

    var pipelineExample = [

        { "$match":{
            "createdAt": { $gte: req.query.createdAt }
        }},

        { "$group": {
            "_id": '$address.address',
            "orderQuantity": { "$sum": 1 },
            "orderTotalDishesPrice": { "$sum": "$dishesPrice" },
            "orderTotalFreightPrice": { "$sum": "$freight" },
            "orderTotalPrice": { "$sum": "$totalPrice" }
        }},


        // Sorting pipeline
        { "$sort": { "orderTotalPrice": -1 } },


        // Optionally limit results
        { "$limit": 100 }

    ];

    var matchList = {};
    if (typeof req.query.createdAt !== 'undefined') {
        matchList.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined') {
        matchList.cookingType = req.query.cookingType
    }

    if (typeof req.query.clientFrom !== 'undefined') {
        matchList.clientFrom = req.query.clientFrom
    }

    pipeline.push(
        { "$match":matchList}
    );


    // Grouping pipeline
    pipeline.push (
        { "$group": {
            "_id": '$address.address',
            "orderQuantity": { "$sum": 1 },
            "orderTotalDishesPrice": { "$sum": "$dishesPrice" },
            "orderTotalFreightPrice": { "$sum": "$freight" },
            "orderTotalPrice": { "$sum": "$totalPrice" }
        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "orderTotalPrice": -1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 100 }
    );

    //console.log (pipeline);
    models.order.aggregateAsync( pipeline).then(function(resultOrder){
        res.status(200).json(resultOrder)
    }).catch(next)


};




