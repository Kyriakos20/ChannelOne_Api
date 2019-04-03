module.exports = {
    initialize: function (api, next) {
        api.doghouse = {
            getAged:function (next) {
                api.models.Property.aggregate(

                    // Pipeline
                    [
                        // Stage 1
                        {
                            $match: {
                                statuses:{$not:{$size:0}},
                                status:{$in:['Paper App','Work Up','Ready to Pitch','Booked','Docs Out', 'Docs In']}
                            }
                        },

                        // Stage 2
                        {
                            $project: {
                                "lastStatus": {$slice:["$statuses",-1]},
                                "status": 1,
                                "_id":1,
                                "address":1,
                                "owner":1
                            }
                        },

                        // Stage 3
                        {
                            $unwind: "$lastStatus"
                        },

                        // Stage 4
                        {
                            $project: {
                                address:"$address",
                                owner:"$owner",
                                lastStatusName: "$lastStatus.name",
                                lastStatusDate: "$lastStatus.date",
                                lastStatusUser: "$lastStatus.user",
                                lastStatusUserName: "$lastStatus.userName",
                                status: "$status",
                                days: {$divide: [{$subtract:[new Date(), "$lastStatus.date"]},86400000]}
                            }
                        },

                        // Stage 5
                        {
                            $redact: {
                                $cond: {
                                    if: {$eq:["$lastStatusName","$status"]},
                                    then: "$$KEEP",
                                    else: "$$PRUNE"
                                }
                            }
                        },

                        // Stage 6
                        {
                            $sort: {
                                "days":-1
                            }
                        },

                        {
                            $limit: 250
                        }

                    ]

                    // Created with 3T MongoChef, the GUI for MongoDB - http://3t.io/mongochef

                ).exec(function (err, results) {
                    if(err) { next(err); return; }
                    next(null, results);
                });
            },
            reset: function (next) {
                var _ = require('lodash');
                var stream = api.models.Property.find({
                    statuses:{$not:{$size:0}},
                    //canCall:'Yes',
                    bucket:{$in:['Completed Apps', 'Working']}
                }).stream();

                stream.on('data', function (item) {
                    var lastStatus = _.last(item.statuses);
                    var days = Math.floor((new Date() - lastStatus.date)/86400000);
                    if(days >= 25)
                    {
                        item.pipelineOwner = null;
                        item.bucket = "Leads";
                        item.status = "Lead";
                        item.statuses.push({
                            name: "Lead",
                            userName: "SYSTEM DOGHOUSE"
                        });
                        item.save();
                    }
                });
                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'!!!! Batch Complete !!!!');
                });

            }
        };

        next();
    }
};