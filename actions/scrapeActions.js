exports.scrapeAll = {
    name:                   'scrapeAll',
    description:            'scrapeAll',
    autosession:false,
    inputs: {
        skip:{
            required:true
        },
        limit:{
            required:true
        }
    },
    run: function(api, data, next) {
        api.scraper.all(data.params, function (err, status) {
            if(err)
            {
                next(err);
            } else {
                next(null, status);
            }
        });
    }
};
