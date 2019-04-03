var mongoose = require('mongoose');

function removeCounty(c) {
    var newc = c;
    if(c.indexOf(' County')>=0)
    {
        console.log('here');
        newc = c.replace(' County','').trim();
    }
    return newc;
}

var zipSchema = new mongoose.Schema({
    zip: {type:Number},
    type: {type:String},
    primary_city: {type:String},
    acceptable_cities: {type:String},
    unacceptable_cities: {type:String},
    state: {type:String},
    county: {type:String},
    timezone: {type:String},
    area_codes: {type:String},
    latitude: {type:Number},
    longitude: {type:Number},
    world_region: {type:String},
    country: {type:String},
    decommissioned: {type:String},
    estimated_population: {type:String},
    notes: {type:String}
});

module.exports = mongoose.model('Zip', zipSchema);