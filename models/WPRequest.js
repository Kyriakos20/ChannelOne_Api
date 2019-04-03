var mongoose = require('mongoose');

var wprSchema = new mongoose.Schema({
    property:{type:mongoose.Schema.Types.ObjectId,ref:'Property'},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    createdAt:{type:Date,default:Date.now()}
});

module.exports = mongoose.model('WPRequest', wprSchema);