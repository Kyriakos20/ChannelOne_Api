exports.task = {
  name:          'processOldLeadNote',
  description:   'processOldLeadNote',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){

    api.migrations.singleLeadNote(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });

  }
};
