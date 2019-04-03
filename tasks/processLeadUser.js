exports.task = {
  name:          'processLeadUser',
  description:   'processLeadUser',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.migrations.singleLeadUser(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });
  }
};
