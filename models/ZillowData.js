var mongoose = require('mongoose');

var zillowdataSchema = new mongoose.Schema({
    createdAt:{type:Date,default:Date.now()},
    zip:{type:String},
    data:{
        type:mongoose.Schema.Types.Mixed
    }
});

module.exports = mongoose.model('ZillowData', zillowdataSchema);