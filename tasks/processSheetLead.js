exports.task = {
  name:          'processSheetLead',
  description:   'processSheetLead',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.migrations.importSheetLead(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });
  }
};
