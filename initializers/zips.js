module.exports = {
    initialize:function(api, next){
        api.zips = {
            simpleCounties:function (next) {
                var that = this;
                that.processSimpleCounties(next);
                /*
                api.cache.load('simpleCounties', function (err, results) {
                    if(err || !results)
                    {
                        that.processSimpleCounties(next);
                    } else {
                        next(null, results)
                    }
                });
                */
            },
            processSimpleCounties:function (next) {
                api.models.Zip.aggregate(
                    [
                        {
                            $match: { "state": { $in: ['AL','AR','AZ', 'CA', 'CO','CT', 'DC', 'DE', 'FL', 'GA','ID', 'IL', 'IN','KY', 'LA','MA', 'MD', 'ME','MI','MN', 'MT','NC','NE','NH', 'NJ','NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA','RI', 'SC','TN', 'TX', 'VA', 'WA','WI'] }, "county":{$ne:""} }

                            },
                        {
                            $group:
                            {
                                "_id":"$state","counties":{$addToSet:"$county"}
                            }
                        },
                        {
                            $unwind: {
                                path: '$counties',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $sort: {
                                'counties':1
                            }
                        },
                        {
                            $group: {
                                "_id":"$_id",
                                "counties":{$push:"$counties"}
                            }
                        }
                    ]
                ).exec(function(err, results) {
                    if(err)
                    {
                        next(err);
                    } else {
                        api.cache.save('simpleCounties', results, 3600000, function (err, n) {
                            next(err, results);
                        });
                    }
                });
            }
        };
        next();
    }
};