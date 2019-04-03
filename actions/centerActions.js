exports.getCenterTotals = {
    name: 'getCenterTotals',
    description: 'getCenterTotals',
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
        api.centers.totals(data.params, function(error, results) {
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
