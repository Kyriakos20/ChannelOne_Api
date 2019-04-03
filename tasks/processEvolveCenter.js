exports.task = {
  name:          'processEvolveCenter',
  description:   'processEvolveCenter',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.evolve.processCenter(params.xml, function(err, response) {
      if(err){
        next(err);
      } else {
        next(null, true);
      }
    });
  }
};
