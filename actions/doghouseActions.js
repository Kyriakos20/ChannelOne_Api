exports.doghouseAged = {
    name: 'doghouseAged',
    description: 'doghouseAged',
    autosession:false,
    run: function(api, data, next){
        api.doghouse.getAged(function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.properties = results;
                next(null);
            }
        });
    }
};

exports.resetDoghouse = {
    name: 'resetDoghouse',
    description: 'resetDoghouse',
    autosession:false,
    run: function(api, data, next){
        api.doghouse.reset(function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.success = results;
                next(null);
            }
        });
    }
};