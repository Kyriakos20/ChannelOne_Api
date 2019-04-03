exports.propertyBreakdown = {
    name: 'propertyBreakdown',
    description: 'propertyBreakdown',

    run: function(api, data, next){
        api.reports.propertyBreakdown(function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.states = results;
                next();
            }
        });
    }
};
