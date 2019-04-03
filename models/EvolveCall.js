var mongoose = require('mongoose');

var evolveCallSchema = new mongoose.Schema({
    createdAt:{type:Date,default:Date.now()},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userPhone: {
        type:String
    },
    trackingId:{
        type:String,
        unique: true
    },
    clientName:{
        name:{type:String}
    },
    clientNumber:{
        name:{type:String}
    },
    startTime:{
        type:Date
    },
    answerTime:{
        type:Date
    },
    endTime:{
        type:Date
    },
    direction:{
        type:String,
        enum:['Inbound','Outbound']
    },
    missedStatus: {
        type:String
    }
});

module.exports = mongoose.model('EvolveCall', evolveCallSchema);