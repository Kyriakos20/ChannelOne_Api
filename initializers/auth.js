module.exports = {
    initialize:function(api, next){
        api.auth = {
            login:function(email, password, next){

                api.models.User.findOne({
                    email:email
                }).exec(function (err, u) {
                    if(err)
                    {
                        next(err);
                    } else if (!u) {
                        next(new Error('No user'));
                    } else {
                        var bc = require('bcrypt');
                        bc.compare(password, u.password, function(err, res) {
                            if (!res) {
                                next(new Error('Invalid Password'));
                            } else {
                                api.models.Team.find({
                                    manager:u._id
                                }).exec(function (err, t) {
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        var teamMembers = [];
                                        for(var i = 0; i<t.length; i++)
                                        {
                                            console.log(t[i].members.length);
                                            if(t[i].members.length > 0)
                                            {
                                                teamMembers = teamMembers.concat(t[i].members);
                                            }
                                        }
                                        next(null, {user:u,teamMembers:teamMembers});
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