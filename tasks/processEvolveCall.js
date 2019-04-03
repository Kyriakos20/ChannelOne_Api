exports.task = {
  name:          'processEvolveCall',
  description:   'processEvolveCall',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.evolve.processCall(params.xml, function(err, response) {
      if(err){
        next(err);
      } else {
        next(null, true);
      }
    });
  }
};
