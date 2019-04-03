'use strict'

const request = require('request');
const Promise = require('bluebird');

exports.task = {
  name:          'processZillowScraper',
  description:   'processZillowScraper',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
      const url = params.property.mortgageValue.link;
      if(!url) next(new Error('no LINK'));
      const proxy = 'http://' + params.server.toString() + ':3001';

      request.post({
          url: proxy,
          body: { url: url },
          json: true

      }, function (err, resp, body) {
          if (err) {
              api.log('LOG ', 'crit', err);
              return next(new Error('Some Error'));
          }
          const json = body;
          api.log('BODY ', 'info', json);
          if(!json.val) {
              return next(new Error('NO VAL'));
          }
          let mv = {};
          mv.source = 'Zillow';
          mv.date = new Date();
          mv.value = Number(json.val.replace(/\D/g, ""));
          mv.link = params.property.mortgageValue.link,
          mv.zpid = params.property.mortgageValue.zpid
          Promise.delay(3000)
              .then(() => {
                  return api.models.Property.findByIdAndUpdate(params.property._id, {
                      mortgageValue: mv
                  })
              })
              .then(r => {
                  api.log('SAVED ', 'crit', mv);
                  next(null, true); 
              })
              .catch(e => next(e))
      });
  }
};
