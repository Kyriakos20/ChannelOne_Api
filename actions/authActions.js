exports.login = {
    name: 'login',
    description: 'login',
    autosession:false,

    inputs: {
        email:{
            required:true
        },
        password:{
            required:true
        }
    },

    run: function(api, data, next){
        api.auth.login(data.params.email, data.params.password, function(error, u){
            if(error)
            {
                next(error);
                return;
            }
            data.response.user = u.user;
            data.response.teamMembers = u.teamMembers;

            if(u.user){
                api.autosession.create(u.user._id, {}, function(error, tokendata){
                    data.response.token = tokendata.token;
                    data.response.user = u.user;
                    next(null);
                });
            } else {
                next(error);
            }

        });
    }
};