exports.task = {
  name:          'processDestinyLead',
  description:   'processDestinyLead',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){

    api.models.DestinyLead(params.record).save((e, i) => {
        if(e) return next(e);
        api.log('SAVED: ', 'crit', params.record);
        next(null, true);
    })
  }
};
