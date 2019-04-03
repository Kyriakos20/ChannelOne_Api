module.exports = {
    initialize:function (api, next) {
        api.centers = {
            totals:function (params, next) {
                var moment = require('moment');
                var _ = require('lodash');
                api.models.EvolveCenter.aggregate(

                    // Pipeline
                    [
                        // Stage 1
                        {
                            $match: {
                                stateTime: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() },
                                createdAt: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() }
                            }
                        },

                        // Stage 2
                        {
                            $group: {
                                _id: "$user",
                                lastState: {$last: "$state"},
                                lastTotalTime: {$last: "$totalTime"},
                                lastTime: {$last: "$stateTime"}
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
                            populated = _.sortBy(populated, function (o) {
                                return o._id.name.last;
                            });

                            next(null, populated);
                        });
                    });
            }
        };
        next();
    }
};