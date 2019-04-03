exports.fetchWhitePages = {
    name:                   'fetchWhitePages',
    description:            'fetchWhitePages',
    inputs: {
        propertyId:{
            required:true
        },
        user:{
            required:true
        }
    },
    run: function(api, data, next) {

        api.scrubber.fetchWhitePages(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.results = results;
                next();
            }
        });
    }
};


exports.phoneScrubResult = {
    name:                   'phoneScrubResult',
    description:            'phoneScrubResult',
    autosession:false,
    inputs: {
        propertyId:{
            required:true
        },
        source:{
            required:true
        },
        phones:{
            required:true
        }
    },

    run: function(api, data, next) {

        api.migrations.updateScrubbedPhone(data.params, function (err, prop) {
            if(err)
            {
                next(err);
            } else {
                console.log(prop.phones);
                next();
            }
        });
    }
};


exports.valueScrubResult = {
    name:                   'valueScrubResult',
    description:            'valueScrubResult',
    autosession:false,
    inputs: {
        propertyId:{
            required:true
        },
        value:{
            required:true
        },
        zpid:{
            required:true
        }
    },

    run: function(api, data, next) {

        api.migrations.updateScrubbedValue(data.params, function (err, prop) {
            if(err)
            {
                next(err);
            } else {
                console.log(prop.mortgageValue);
                next();
            }
        });
    }
};

exports.runScrubBatch = {
    name:                   'runScrubBatch',
    description:            'runScrubBatch',
    autosession:false,
    inputs: {
        skip:{
            required:true
        },
        limit:{
            required:true
        },
        server:{}
    },
    run: function(api, data, next) {
        api.scrubber.runBatch(data.params, function (err, status) {
            if(err)
            {
                next(err);
            } else {
                next(null, status);
            }
        });
    }
};

exports.scrubDestinyBatch = {
    name:                   'scrubDestinyBatch',
    description:            'scrubDestinyBatch',
    autosession:false,
    inputs: {
        skip:{
            required:true
        },
        limit:{
            required:true
        },
        server:{}
    },
    run: function(api, data, next) {
        api.scrubber.standAlone.api.runBatch(data.params, function (err, status) {
            if(err)
            {
                next(err);
            } else {
                next(null, status);
            }
        });
    }
};

exports.getZillowDataValue = {
    name:                   'getZillowDataValue',
    description:            'getZillowDataValue',
    autosession:false,
    run: function(api, data, next) {
        api.migrations.getZillowDataValue(function (err, status) {
            if(err)
            {
                next(err);
            } else {
                next(null, status);
            }
        });
    }
};


exports.scrubberTest = {
    name:                   'scrubberTest',
    description:            'scrubberTest',
    autosession:false,
    run: function(api, data, next) {
        api.scrubber.test(function (err, result) {
            next(err, result);
        });
    }
};
