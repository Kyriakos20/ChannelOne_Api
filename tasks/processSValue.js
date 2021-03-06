exports.task = {
    name:          'processSValue',
    description:   'processSValue',
    frequency:     0,
    queue:         'default',
    plugins:       [],
    pluginOptions: {},

    run: function(api, params, next){

        api.models.Property.findOne({
            "address.street1":params.record.street,
            "address.zip": params.record.zip
        }).exec(function(err, result){
            if(err) return next(err);
            if(result) {
                result.sValue = true;
                result.save(function(err){
                    if(err) return next(err);
                    return next();
                });
            } else {
                next();
            }
        });


        //api.log('in the task', 'error');
        //next();
    }
};