exports.task = {
  name:          'processScrubbedValue',
  description:   'processScrubbedValue',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.properties.updateValue(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null, true);
      }
    });
  }
};
