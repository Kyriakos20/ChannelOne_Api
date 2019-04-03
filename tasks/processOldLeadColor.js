exports.task = {
  name:          'processOldLeadColor',
  description:   'processOldLeadColor',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){

    api.migrations.singleLeadColor(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });

  }
};
