var mongoose = require('mongoose');

var scrubresultSchema = new mongoose.Schema({
    createdAt:{type:Date,default:Date.now()},
    propertyId:{type:String},
    type:{
        type:String,
        enum:['Value','Phone']
    },
    source:{
        type:String,
        enum:['Zillow','WhitePages','YellowPages','Pipl','ZillowAPI']
    },
    data:{
        type:mongoose.Schema.Types.Mixed
    },
    key: {
        type:String
    },
    server:{
        type:String
    }
});

module.exports = mongoose.model('ScrubResult', scrubresultSchema);