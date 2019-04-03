module.exports = {
    initialize: function (api, next) {
        api.calls = {
            deleteMissed: function (params, next) {

                api.models.EvolveCall.update({
                    _id:params.call._id
                }, {
                    $set:{
                        missedStatus:'Deleted'
                    }
                })
                    .exec(function (err, results) {
                        if(err)
                        {
                            return next(err);
                        } else {
                            return next(null, results);
                        }
                    })
            },
            missed: function (params, next) {
                api.models.EvolveCall.find({
                    "user": params.user._id,
                    "direction": "Inbound",
                    "answerTime": { $not: { $exists: true } },
                    "clientNumber": { $exists: true },
                    "missedStatus": { $exists: false }
                })
                    .sort({"startTime": -1})
                    .exec(function (err, results) {
                        if(err)
                        {
                            return next(err);
                        } else {
                            return next(null, results);
                        }
                    })

            },
            totals:function (params, next) {
                var moment = require('moment');
                var _ = require('lodash');
                api.models.EvolveCall.aggregate(

                    // Pipeline
                    [
                        // Stage 1
                        {

                            $match: {
                                startTime: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() },
                                createdAt: { $gte: moment().startOf('day').subtract(4, 'hours').toDate(), $lte: moment().endOf('day').subtract(4, 'hours').toDate() }
                            }
                        },

                        // Stage 2
                        {
                            $project: {
                                callTime:{
                                    $let: {
                                        vars: {
                                            callTime: {
                                                $cond: {
                                                    if: {$and:["$answerTime", "$endTime"]},
                                                    then: {$subtract: ["$endTime", "$answerTime"]},
                                                    else: 0
                                                }
                                            }
                                        },
                                        in: "$$callTime"
                                    }
                                },
                                outbound: {
                                    $let: {
                                        vars: {
                                            outbound: {
                                                $cond: {
                                                    if: {$eq:["$direction",'Outbound']}, then:1, else: 0
                                                }
                                            }
                                        },
                                        in: "$$outbound"
                                    }
                                },
                                inbound: {
                                    $let: {
                                        vars: {
                                            inbound: {
                                                $cond: {
                                                    if: {$eq:["$direction",'Inbound']}, then:1, else: 0
                                                }
                                            }
                                        },
                                        in: "$$inbound"
                                    }
                                },

                                outConvo: {
                                    $let: {
                                        vars: {
                                            outConvo: {
                                                $cond: {
                                                    if: { $and: [{$eq:["$direction",'Outbound']}, {$gt: [{$subtract: ["$endTime", "$answerTime"]}, 50000]}]}, then:1, else: 0
                                                }
                                            }
                                        },
                                        in: "$$outConvo"
                                    }

                                },


                                user: "$user"
                            }
                        },

                        // Stage 3
                        {
                            $group: {
                                _id:"$user",
                                total:{ $sum:1 },
                                callTime:{$sum:"$callTime"},
                                outbound:{$sum:"$outbound"},
                                inbound:{$sum:"$inbound"},
                                outConvo:{$sum:"$outConvo"}
                            }
                        },

                        // Stage 4
                        {
                            $sort: {
                                "total":-1
                            }
                        }


                    ]

                    // Created with 3T MongoChef, the GUI for MongoDB - http://3t.io/mongochef

                )

                    .exec(function (err, results) {
                    if(err)
                    {
                        next(err);
                        return;
                    }
                    api.models.User.populate(results, {path:'_id'}, function (err, populated) {
                        if(err)
                        {
                            next(err);
                            return;
                        }
                        populated = _.filter(populated, function (o) {
                            return (['Web Admin', 'Admin'].indexOf(o._id.role) < 0);
                        });
                        next(null, populated);
                    });
                });

            }
        };
        next();
    }
};