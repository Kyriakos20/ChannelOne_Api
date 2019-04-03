var mongoose = require('mongoose');

var userFilterSchema = new mongoose.Schema({
    createdAt:{type:Date,default:Date.now()},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name: {
        type:String,
        required: true
    },
    params:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    }
});

module.exports = mongoose.model('UserFilter', userFilterSchema);