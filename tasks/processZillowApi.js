exports.task = {
  name:          'processZillowApi',
  description:   'processZillowApi',
  frequency:     0,
  queue:         'zillowapi',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.scrubber.getZillowApi(params, function (err, results) {
        if(!err && results)
        {
            next(null, results);
        } else {
            next(err);
        }
    });
  }
};
