exports.createUser = {
    name: 'createUser',
    description: 'createUser',
    autosession:false,

    inputs: {
        email:{
            required:true
        },
        password:{
            required:true
        },
        role:{
            required:true
        }
    },

    run: function(api, data, next){
        api.users.create(data.params.email, data.params.password, data.params.role, function(err, resp){
            if(resp)
            {
                data.response.user = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.newUser = {
    name: 'newUser',
    description: 'newUser',

    inputs: {
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.users.new(data.params, function(err, resp){
            if(resp)
            {
                data.response.user = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.editUser = {
    name: 'editUser',
    description: 'editUser',

    inputs: {
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.users.edit(data.params, function(err, resp){
            if(resp)
            {
                data.response.user = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.updateUser = {
    name: 'updateUser',
    description: 'updateUser',

    inputs: {
        id:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.users.update(data.params.id, data.params.user, function(err, resp){
            if(resp)
            {
                data.response.user = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.saveFilter = {
    name: 'saveFilter',
    description: 'saveFilter',

    inputs: {
        filter:{
            required:true
        },
        filterName:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.users.saveFilter(data.params, function(err, resp){
            if(resp)
            {
                data.response.filter = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.removeFilter = {
    name: 'removeFilter',
    description: 'removeFilter',

    inputs: {
        filter:{
            required:true
        }
    },

    run: function(api, data, next){
        api.users.removeFilter(data.params, function(err, resp){
            if(resp)
            {
                data.response.status = true;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};


exports.migrateFilters = {
    name: 'migrateFilters',
    description: 'migrateFilters',
    autosession:false,
    run: function(api, data, next){
        api.users.migrateFilters(function(err, resp){
            if(resp)
            {
                data.response.resp = true;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};


exports.getFilters = {
    name: 'getFilters',
    description: 'getFilters',
    inputs: {
        user:{
            required:true
        }
    },
    run: function(api, data, next){
        api.users.getFilters(data.params, function(err, resp){
            if(resp)
            {
                data.response.filters = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.allUsers = {
    name: 'allUsers',
    description: 'allUsers',
    autosession:false,

    run: function(api, data, next){
        api.users.all(function(err, resp){
            if(resp)
            {
                data.response.users = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.test = {
    name: 'test',
    description: 'test',

    run: function(api, data, next){

        data.response.hello = 'HELLO';
        next();
    }
};

exports.simpleUsers = {
    name: 'simpleUsers',
    description: 'simpleUsers',
    autosession:false,

    run: function(api, data, next){
        api.users.simpleUsers(function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.users = results;
                next();
            }
        });
    }
};