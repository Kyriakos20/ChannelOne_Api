module.exports = {
    initialize: function (api, next) {
        api.reports = {
            propertyBreakdown: function (next) {
                api.models.Property.aggregate(

                    // Pipeline
                    [
                        // Stage 1
                        {
                            $match: {
                                "mortgage.date":{$exists:true}
                            }
                        },

                        // Stage 2
                        {
                            $project: {
                                "_id":0,
                                "state":"$address.state",
                                "date":{"$year":"$mortgage.date"},
                                "value":{"$ifNull":["$mortgageValue.value",0]}
                            }
                        },

                        // Stage 3
                        {
                            $group: {
                                "_id": {
                                    "state":"$state",
                                    "year":"$date"
                                },
                                "total":{"$sum":1},
                                "hasValue":{"$sum":{
                                    "$cond": [{"$gt":["$value", 0]},1,0]

                                }}
                            }
                        },

                        // Stage 4
                        {
                            $sort: {
                                "_id.year":1
                            }
                        },

                        // Stage 5
                        {
                            $group: {
                                _id:"$_id.state",
                                years: {$push: {
                                    year: "$_id.year",
                                    totalYear: {"$sum":"$total"},
                                    hasValueYear:{"$sum":"$hasValue"}
                                }},
                                totalState:{"$sum":"$total"},
                                hasValueState:{"$sum":"$hasValue"}
                            }
                        },

                        // Stage 6
                        {
                            $project: {
                                "_id":0,
                                "state":"$_id",
                                "totalState":"$totalState",
                                "hasValueState":"$hasValueState",
                                "years":"$years"
                            }
                        },

                        // Stage 7
                        {
                            $sort: {
                                state:1
                            }
                        }

                    ]

                    // Created with 3T MongoChef, the GUI for MongoDB - http://3t.io/mongochef

                ).exec(function (err, results) {
                   if(err)
                   {
                       next(err);
                   } else {
                       next(null, results);
                   }
                });
            }
        };
        next();
    }
};



