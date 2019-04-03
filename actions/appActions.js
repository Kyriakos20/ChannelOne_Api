exports.saveApp = {
    name: 'saveApp',
    description: 'saveApp',
    inputs: {
        property:{
            required:true
        },
        user:{
            required:true
        },
        app:{
            required:true
        }
    },

    run: function(api, data, next){
        api.applications.save(data.params, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.app = results.application;
                data.response.property = results.property;
                next();
            }
        });
    }
};

exports.loadApp = {
    name: 'loadApp',
    description: 'loadApp',
    inputs: {
        app:{
            required:true
        }
    },

    run: function(api, data, next){
        api.applications.load(data.params, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.app = results;
                next();
            }
        });
    }
};


exports.printApp = {
    name: 'printApp',
    description: 'printApp',
    autosession:false,
    inputs: {
        id:{
            required:true
        }
    },

    run: function(api, data, next){

        api.applications.print(data.params.id, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.app = results;
                next();
            }
        });
        
    }
};