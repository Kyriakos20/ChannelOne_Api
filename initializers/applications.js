module.exports = {
    initialize:function(api, next){
        api.applications = {
            save:function (params, next) {
                if(params.app._id)
                {
                    api.models.Application.findByIdAndUpdate(params.app._id, params.app, function (err, a) {
                        if(err)
                        {
                            next(err);
                        } else {
                            next(null, {
                                property:null,
                                application:a
                            });
                        }
                    });
                } else {
                    var app = api.models.Application(params.app);
                    app.property = params.property;
                    app.user = params.user;
                    app.save(function (err, a) {
                        if(err)
                        {
                            next(err);
                        } else {
                            api.models.Property.findById(params.property, function(err, property){
                                var pa = {
                                    user:params.user,
                                    date:Date.now(),
                                    userName:params.user.name.first+' '+params.user.name.last,
                                    app:a
                                }
                                property.applications.push(pa);
                                property.save(function (err, res) {
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        next(null, {
                                            property:res,
                                            application:a
                                        });
                                    }
                                });
                            });
                        }
                    });
                }


            },
            load:function (params, next) {
                var id = null;
                if(typeof(params.app.app) == "string")
                {
                    id  = params.app.app;
                } else {
                    id = params.app.app._id;
                }
                api.models.Application.findById(id, function(err, app){
                   if(err)
                   {
                       next(err);
                   } else {
                       next(null, app);
                   }
                });


            },
            print:function (id, next) {
                api.models.Application.findOne({_id:id}).populate('property').populate('user').exec(function(err, app){
                    if(err)
                    {
                        next(err);
                    } else {
                        next(null, app);
                    }
                });


            }
        };
        next();
    }
};