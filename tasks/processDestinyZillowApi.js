const _ = require('lodash');
const xml2js = require('xml2js');
const request = require('request');

exports.task = {
  name:          'processDestinyZillowApi',
  description:   'processDestinyZillowApi',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
      const parser = new xml2js.Parser();
      const url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id='+params.server.key+'&address='+encodeURI(params.property.address)+'&citystatezip='+encodeURI(params.property.city+', '+params.property.state+' '+params.property.zip);
      request.post({
          url: 'http://'+params.server.url+'/zillow_api_search.php',
          form: {url: url}
      }, function (err, resp, body) {
          if (err || resp.statusCode != 200) {
              next(null,'Invalid Request Response');
              return;
          }
          parser.parseString(body, function (err, result) {
              if (err) {
                  next(null, 'Parser Error');
                  return;
              }
              if(!result)
              {
                  next(null, 'No Result');
                  return;
              }
              const resultSet = result["SearchResults:searchresults"];
              if (resultSet.message[0]["limit-warning"] || resultSet.message[0].code[0] != 0 || resultSet.response[0].results[0].result.length != 1) {
                  next(null,resultSet.message[0]);
                  return;
              }
              const r = resultSet.response[0].results[0].result[0];
              const zpid = r.zpid[0];
              const zestimate = Number(r.zestimate[0].amount[0]["_"]);
              if(!zestimate) {
                  next(null,'No Zestimate');
                  return;
              }
              api.models.DestinyLead.findByIdAndUpdate(params.property._id, {
                  zestimate: zestimate,
                  zpid: zpid
              }, function (err, resp) {
                  if(err) return next(err);
                  api.log('sAVED: ', 'crit', params.property._id);
                  next(null, true);
              });
          })
      })
  }
};
