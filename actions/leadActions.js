exports.assignLeads = {
    name: 'assignLeads',
    description: 'assignLeads',
    autosession:true,
    inputs: {
        selected:{},
        assignData:{
            required:true
        },
        filters:{
            required:true
        }
    },

    run: function(api, data, next){
        api.leads.assign(data.params, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.status = results;
                next();
            }
        });
    }
};



exports.claim = {
    name: 'claim',
    description: 'claim',

    inputs: {
        property:{
            required:true
        },
        user:{
            required:true
        },
        source:{
            required:false
        }
    },

    run: function(api, data, next){
        api.leads.claim(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.property = results;
                next();
            }
        });
    }
};

exports.claimLead = {
    name: 'claimLead',
    description: 'claimLead',

    inputs: {
        property:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.leads.claimLead(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.property = results;
                next();
            }
        });
    }
};

exports.checkHasLead = {
    name: 'checkHasLead',
    description: 'checkHasLead',

    inputs: {
        property_id:{
            required:true
        },
        user_id:{
            required:true
        }
    },

    run: function(api, data, next){
        api.leads.checkHasLead(data.params, function (err, result) {
            if(err)
            {
                next(err);
            } else {
                data.response.has = result;
                next();
            }
        });
    }
};