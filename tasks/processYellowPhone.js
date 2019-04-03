exports.task = {
  name:          'processYellowPhone',
  description:   'processYellowPhone',
  frequency:     0,
  queue:         'yellowphone',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.scrubber.getYellowPhone(params, function (err, results) {
        if(!err && results)
        {
            next(null, results);
        } else {
            next(err);
        }
    });
  }
};
