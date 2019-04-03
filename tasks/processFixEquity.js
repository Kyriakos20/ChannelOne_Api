exports.task = {
    name: 'processFixEquity',
    description: 'processFixEquity',
    frequency: 0,
    queue: 'default',
    plugins: [],
    pluginOptions: {},

    run: function (api, params, next) {
        var p = params.property;
        api.models.Property.findById(property._id, function (e, property) {
            if(e) return next(e);
            var eq = parseInt(property.mortgageValue.value - property.mortgage.previousValue);
            var perc = (property.mortgageValue.value / property.mortgage.previousValue * 100).toFixed(2);
            property.currentEquity = eq;
            property.currentEquityPercent = perc;
            property.save(function (e, saved) {
                if(e) return next(e);
                api.log('SAVED PERCENT: ', 'crit', perc);
                next(null, true);
            })
        })
        // console.log(item._id);
        // console.log(item.mortgage.previousValue);
        // console.log(item.mortgageValue.value);
        // console.log(item.currentEquity);

    }
};
