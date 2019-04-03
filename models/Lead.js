var mongoose = require('mongoose');

var leadSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    property:{type:mongoose.Schema.Types.ObjectId,ref:'Property'}
});

module.exports = mongoose.model('Lead', leadSchema);