var moment = require('moment');
exports.task = {
  name:          'processFakeVal',
  description:   'processFakeVal',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    var old = params.record;
    api.models.Property.findById(old._id, function (err, prop) {
        if(err) return next(err);
        var months = moment().diff(moment(prop.mortgageValue.date), 'months', true);
        var increase = ((Math.random() * 12) + 5)/12/100*months*prop.mortgageValue.value;
        var newVal = parseInt(prop.mortgageValue.value + increase);
        var daysAgo = parseInt(Math.random() * 120 + 30);
        var zDate = moment().subtract(daysAgo, 'days').toDate();
        // api.log('newVal: ', 'crit', newVal);
        // api.log('zDate: ', 'crit', zDate);
        prop.mortgageValues.push(old.mortgageValue);
        prop.mortgageValue.date = zDate;
        prop.mortgageValue.value = newVal;
        prop.currentEquity = newVal - parseInt(prop.mortgage.previousValue);
        prop.currentEquityPercent = (newVal/parseInt(prop.mortgage.previousValue))*100;
        prop.save(function (err, saved) {
          api.log('SAVED: ', 'crit', saved.oldId);
            if(err) return next(err);
            next(null);
        })
    });
  }
};
