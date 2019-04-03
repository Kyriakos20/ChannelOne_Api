exports.task = {
  name:          'processLeadOwner',
  description:   'processLeadOwner',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.migrations.singleLeadOwner(params.record, function(err, success) {
      if(err){
        next(err);
      } else {
        next(null,success);
      }
    });
  }
};
