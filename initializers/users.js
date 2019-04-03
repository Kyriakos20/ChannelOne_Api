module.exports = {
    initialize:function(api, next){
        api.users = {
            saveFilter:function (params, next) {
                var f = api.models.UserFilter({
                    user:params.user,
                    name:params.filterName,
                    params:params.filter
                });
                f.save(function (err, us) {
                    if(err)
                    {
                        next(err);
                    } else {
                        next(null, f);
                    }
                });
            },
            removeFilter:function (params, next) {
                api.models.UserFilter.remove({_id:params.filter._id}, function (err) {
                    if(err)
                    {
                        next(err);
                    } else {
                        next(null, true);
                    }
                });
                
            },
            getFilters:function (params, next) {
                api.models.UserFilter.find({
                    user:params.user._id
                }).sort({name:1}).exec(function (err, results) {
                    if(err)
                    {
                        next(err);
                    } else {
                        next(null, results);
                    }
                });
            },
            migrateFilters:function (next) {
                var stream = api.models.User.find({}).stream();


                stream.on('data', function (item) {
                    if(item.filters)
                    {
                        item.filters.map(function (filter) {
                            var nF = api.model.UserFilter({
                                user:item._id,
                                name:filter.name,
                                params:filter.filter
                            });
                            nf.save();
                        });
                    }
                });

                stream.on('error', function (err) {
                    next(err);
                });
                
                stream.on('close', function () {
                    next(null, true);
                });
                
            },
            create:function(email, password, role, next){
                var u = new api.models.User({
                    email:email,
                    role:role,
                    encrypt_pwd:password
                });
                u.save(function(err,us){
                    if(err)
                    {
                        next(new Error('Error Saving User'));
                    } else{
                        next(null,us);
                    }
                });
            },
            new:function(params, next){
                var u = new api.models.User({
                    email:params.user.email,
                    role:params.user.role,
                    name:params.user.name,
                    format_desk:params.user.phones.desk,
                    encrypt_pwd:params.user.password
                });
                u.save(function(err,us){
                    if(err)
                    {
                        next(new Error('Error Saving User'));
                    } else{
                        next(null,us);
                    }
                });
            },
            update:function(id, user, next){
                //user.format_desk = user.phones.desk;
                //delete user.phones.desk;
                api.models.User.findByIdAndUpdate(id, user, function(err, u){
                    if(err)
                    {
                        next(new Error('Error Updating User'));
                    } else {
                        next(null, u);
                    }
                });
            },
            edit:function(params, next){

                api.models.User.findById(params.user._id, function(err, u){
                    if(err)
                    {
                        next(new Error('Error Updating User'));
                    } else {
                        u.email = params.user.email;
                        u.name = params.user.name;
                        u.role = params.user.role;
                        u.format_desk = params.user.phones.desk;
                        if(params.user.password)
                        {
                            u.encrypt_pwd = params.user.password;
                        }
                        u.save(function (err, us) {
                           if(err)
                           {
                               next(err);
                           } else {
                               next(null, us);
                           }
                        });

                    }
                });
            },
            all:function (next) {
                api.models.User.find()
                    .sort('name.last')
                    .sort('email')
                    .exec(function (err, u) {
                        if(err) {
                            next(err);
                        } else {
                            next(null, u);
                        }
                    });
            },
            assignments:function (next) {
                api.models.User.find()
                    .sort('name.last')
                    .sort('email')
                    .exec(function (err, u) {
                        if(err) {
                            next(err);
                        } else {
                            next(null, u);
                        }
                    });
            },
            simpleUsers:function (next) {
                var that = this;
                that.processSimpleUsers(next);
                /*
                api.cache.load('simpleUsers', function (err, results) {
                    if(err || !results)
                    {
                        that.processSimpleUsers(next);
                    } else {
                        next(null, results)
                    }
                });
                */
            },
            processSimpleUsers:function (next) {
                api.models.User.find(
                    { "role": { $nin: ["Web Admin", "Admin", "Sales Manager"] } }, {"_id": 1, "name": 1, "role": 1, "email": 1}
                ).sort(
                    {"name.last": 1, "name.first": 1}
                ).exec(function(err, results) {
                    if(err)
                    {
                        next(err);
                    } else {
                        api.cache.save('simpleUsers', results, 3600000, function (err, n) {
                            next(err, results);
                        });
                    }
                });
            }
    };
        next();
    }
};