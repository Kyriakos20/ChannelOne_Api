const _ = require('lodash');
const xml2js = require('xml2js');
const request = require('request');

exports.task = {
  name:          'processNWEZillowApi',
  description:   'processNWEZillowApi',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
      const parser = new xml2js.Parser();
      const url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id='+params.server.key+'&address='+encodeURI(params.property.address.street1)+'&citystatezip='+encodeURI(params.property.address.city+', '+params.property.address.state+' '+params.property.address.zip);
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
              const mv = {
                  source:'Zillow',
                  date:new Date(),
                  value:zestimate,
                  link:params.property.mortgageValue.link,
                  zpid:params.property.mortgageValue.zpid
              };
              const eq = parseInt(zestimate - params.property.mortgage.previousValue);
              const perc = (zestimate / params.property.mortgage.previousValue * 100).toFixed(2);
              api.models.Property.findByIdAndUpdate(params.property._id, {
                  mortgageValue:mv,
                  currentEquity:eq,
                  currentEquityPercent:perc
              }, function (err, resp) {
                  if(err) return next(err);
                  api.log('sAVED: ', 'crit', params.property._id);
                  next(null, true);
              });
          })
      })
  }
};
