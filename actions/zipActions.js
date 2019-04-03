exports.simpleCounties = {
    name: 'simpleCounties',
    description: 'simpleCounties',
    autosession:false,

    run: function(api, data, next){
        api.zips.simpleCounties(function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.counties = results;
                next();
            }
        });
    }
};
