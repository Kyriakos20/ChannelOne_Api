module.exports = {
    initialize:function(api, next){
        api.teams = {
            all:function (next) {
                api.models.Team.find()
                    .sort('name')
                    .populate('manager')
                    .populate('members')
                    .exec(function (err, u) {
                        if(err) {
                            next(err);
                        } else {
                            next(null, u);
                        }
                    });
            },
            new:function(params, next){
                var u = new api.models.Team({
                    name:params.team.name,
                    members:params.team.members,
                    manager:params.team.manager
                });
                u.save(function(err,us){
                    if(err)
                    {
                        next(new Error('Error Saving Team'));
                    } else{
                            api.models.Team.findOne({_id:us._id})
                            .populate('manager')
                            .populate('members')
                            .exec(function (err, u) {
                                if(err) {
                                    next(err);
                                } else {
                                    next(null, u);
                                }
                            });
                    }
                });
            },
            edit:function(params, next){

                api.models.Team.findById(params.team._id, function(err, u){
                    if(err)
                    {
                        next(new Error('Error Updating Team'));
                    } else {
                        u.name = params.team.name;
                        u.manager = params.team.manager;
                        u.members = params.team.members;
                        u.save(function (err, us) {
                            if(err)
                            {
                                next(err);
                            } else {
                                api.models.Team.findOne({_id:us._id})
                                .populate('manager')
                                .populate('members')
                                .exec(function (err, u) {
                                    if(err) {
                                        next(err);
                                    } else {
                                        next(null, u);
                                    }
                                });
                            }
                        });

                    }
                });
            }
    };
        next();
    }
};