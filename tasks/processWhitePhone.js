exports.task = {
    name:          'processWhitePhone',
    description:   'processWhitePhone',
    frequency:     0,
    queue:         'yellowphone',
    plugins:       [],
    pluginOptions: {},

    run: function(api, params, next){
        api.scrubber.processWhitePages(params, function (err, results) {
            if(!err && results)
            {
                next(null, results);
            } else {
                next(err);
            }
        });
    }
};