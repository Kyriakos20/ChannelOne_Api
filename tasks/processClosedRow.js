exports.task = {
  name:          'processClosedRow',
  description:   'processClosedRow',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.migrations.saveClosedRow(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });
  }
};
