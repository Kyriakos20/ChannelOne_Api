var mongoose = require('mongoose');


var teamSchema = new mongoose.Schema({
    name:{
        type:String
    },
    manager:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    members:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
});

module.exports = mongoose.model('Team', teamSchema);