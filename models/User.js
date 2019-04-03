var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

formatPhone = function (number) {
    var n = number.replace(/\D/g,"");
    return n.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};


var userSchema = new mongoose.Schema({
    oldId:{type:Number},
    email:{
        type:String,
        required:true
    },
    name:{
        first:{
          type:String
        },
        last:{
            type:String
        }
    },
    role:{
        type:String,
        required:true,
        enum: ['Web Admin','Admin','Sales Manager','Team Manager','Loan Officer','Assistant']
    },
    password:{
        type:String,
        required:true
    },
    phones:{
        mobile:{type:String},
        desk:{type:String}
    },
    callCenterStatus:{
        type:String,
        enum: ['Unavailable', 'Available']
    },
    office: {
        type: String,
        enum: ['White Marsh 1', 'York 1'],
        default: 'White Marsh 1'
    }
},{
    timestamps:true
});

userSchema.virtual('encrypt_pwd').set(function(pwd){

    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(pwd, salt);
});

userSchema.virtual('format_desk').set(function(p){
    this.phones.desk = formatPhone(p);
});
userSchema.virtual('format_mobile').set(function(p){
    this.phones.mobile = formatPhone(p);
});

module.exports = mongoose.model('User', userSchema);