exports.task = {
  name:          'processPhone',
  description:   'processPhone',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.migrations.importPhone(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });
  }
};
