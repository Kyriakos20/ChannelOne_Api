exports.task = {
  name:          'processZillowData',
  description:   'processZillowData',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
      var moment = require('moment');

      var item = params.record;
      var d = moment(item.mortgage.date).format('YYYY-MM');
      
      api.models.ZillowData.findOne({zip:item.address.zip})
          .exec(function (err, zillow) {
              if(err)
              {
                  return next();
              }
              var curr = zillow.data[d];
              var today = zillow.data["2016-08"];
              var multiplier = Number(today)/Number(curr);
              var prev = 0;
              if(item.mortgage.previousValue)
              {
                  prev = item.mortgage.previousValue;
              }
              var val = Number(prev) * multiplier;
              if(prev == 0)
              {
                  val = today;
              }
              var eq = parseInt(val - prev);
              var eqPerc = (multiplier*100).toFixed(2);

              api.models.Property.findById(item._id, function (err, property) {

                  var p = {
                      source:'Zillow Calculation',
                      date:Date.now(),
                      value:parseInt(val),
                      link:'http://www.zillow.com/homes/'+api.helpers.fixAddressForZillow(property)+"_rb/"
                  };

                  property.mortgageValue = p;
                  property.mortgageValues.push(p);
                  property.currentEquity = eq;
                  property.currentEquityPercent = eqPerc;
                  property.save(function (err) {
                      if(err)
                      {
                          next(err);
                      }  else {
                          next(null, true);
                      }
                  });
              });
          });
  }
};
