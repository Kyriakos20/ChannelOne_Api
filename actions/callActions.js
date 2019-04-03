exports.getCallTotals2 = {
    name: 'getCallTotals2',
    description: 'getCallTotals2',
    /*
    inputs: {
        number:{
            required:true
        },
        user_id:{
            required:true
        }
    },
    */
    run: function(api, data, next){
        api.calls.totals(data.params, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.results = results;
                next(null);
            }
        });
    }
};


exports.getMissedCalls2 = {
    name: 'getMissedCalls2',
    description: 'getMissedCalls2',
     inputs: {
         user:{
            required:true
         }
     },
    run: function(api, data, next){
        api.calls.missed(data.params, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.results = results;
                next(null);
            }
        });
    }
};




exports.deleteMissedCall = {
    name: 'deleteMissedCall',
    description: 'deleteMissedCall',
    inputs: {
        call:{
            required:true
        }
    },
    run: function(api, data, next){
        api.calls.deleteMissed(data.params, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.results;
                next(null);
            }
        });
    }
};
