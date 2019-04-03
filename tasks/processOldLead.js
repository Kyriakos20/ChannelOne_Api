exports.task = {
  name:          'processOldLead',
  description:   'processOldLead',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){

    api.migrations.singleLead(params.record, function(err, prop) {
      if(err){
        next(err);
      } else {
        next(null,prop);
      }
    });


  }
};
