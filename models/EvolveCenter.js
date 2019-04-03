var mongoose = require('mongoose');

var evolveCenterSchema = new mongoose.Schema({
    createdAt:{type:Date,default:Date.now()},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userPhone: {
        type:String
    },
    stateTime:{
        type:Date
    },
    totalTime:{
        type:Number
    },
    state: {
        type:String
    }
});

module.exports = mongoose.model('EvolveCenter', evolveCenterSchema);