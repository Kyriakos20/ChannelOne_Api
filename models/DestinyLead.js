var mongoose = require('mongoose');

var destinyLeadSchema = new mongoose.Schema({
    first: String,
    middle: String,
    last: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    mortgageOpenDate: String,
    loanAmount: String,
    ltv: String,
    zestimate: Number,
    zpid: String
},{
    timestamps:true
});

module.exports = mongoose.model('DestinyLead', destinyLeadSchema);