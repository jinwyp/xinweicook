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
    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        matchList.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        matchList.cookingType = req.query.cookingType
    }

    if (typeof req.query.clientFrom !== 'undefined' && req.query.clientFrom !== '') {
        matchList.clientFrom = req.query.clientFrom
    }

    if (typeof req.query.status !== 'undefined' && req.query.status !== '') {
        matchList.status = req.query.status
    }

    pipeline.push(
        { "$match":matchList}
    );


    // Grouping pipeline
    pipeline.push (
        { "$group": {
            "_id": '$address.address',
            "orderQuantity": { "$sum": 1 },
            "orderList": { "$push": { "_id": "$_id", "orderNumber": "$orderNumber", "totalPrice": "$totalPrice" } },
            "orderTotalDishesPrice": { "$sum": "$dishesPrice" },
            "orderTotalFreightPrice": { "$sum": "$freight" },
            "orderTotalPrice": { "$sum": "$totalPrice" },
            "orderAveragePrice": { "$avg": "$totalPrice" }
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










exports.dishStatisticByStock = function(req, res, next) {

    var pipeline = [];



    var matchList = {};
    if (typeof req.query.createdAt !== 'undefined' && req.query.createdAt !== '') {
        matchList.createdAt = { $gte: new Date(req.query.createdAt)}
    }

    if (typeof req.query.cookingType !== 'undefined' && req.query.cookingType !== '') {
        matchList.cookingType = req.query.cookingType
    }

    if (typeof req.query.sideDishType !== 'undefined' && req.query.sideDishType !== '') {
        matchList.sideDishType = req.query.sideDishType
    }

    if (typeof req.query.isPublished !== 'undefined' && req.query.isPublished !== '') {
        matchList.isPublished = req.query.isPublished
    }


    //pipeline.push(
    //    { "$match":matchList}
    //);

    console.log (matchList);


    // Grouping pipeline
    pipeline.push (
        { "$match":{
            "isPlus" : false
        }},

        { "$group": {
            "_id": '$dish',
            "dishSaleQuantity": { "$sum": "$quantity" },
            "dishList": { "$push": { "_id": "$dish", "dish": "$dish", "quantity": "$quantity", "user": "$user"  } }
        }}
    );

    // Sorting pipeline
    pipeline.push (
        { "$sort": { "dishSaleQuantity": 1 } }
    );

    // Optionally limit results
    pipeline.push (
        { "$limit": 1000 }
    );



    var dishList =[];
    var dishHashList ={};

    models.dish.find(matchList).lean().then(function(resultDish){
        if (resultDish && resultDish.length > 0) {
            //dishIdList = resultDish.map(function(dish){
            //    return dish._id.toString()
            //});

            //console.log (pipeline);
            models.inventory.aggregateAsync( pipeline).then(function(resultDishInventroy){

                resultDishInventroy.forEach(function(dishInventory){
                    dishHashList[dishInventory._id.toString()] = dishInventory
                });


                resultDish.forEach(function(dishOne){
                    if (dishHashList[dishOne._id.toString()]){
                        dishOne.sales = dishHashList[dishOne._id.toString()].dishSaleQuantity;
                        dishOne.inventory = dishHashList[dishOne._id.toString()]
                    }else {
                        dishOne.sales = 0;
                        dishOne.inventory = false
                    }

                });


                res.status(200).json(resultDish)
            }).catch(next)

        }else{
            res.status(200).json([])
        }

    }).catch(next);





};


