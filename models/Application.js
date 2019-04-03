var mongoose = require('mongoose');

var applicationSchema = new mongoose.Schema({
    property:{type:mongoose.Schema.Types.ObjectId,ref:'Property'},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    createdAt:{type:Date,default:Date.now()},
    source:{type:String},
    address:{
        street1:{type:String},
        street2:{type:String},
        city:{type:String},
        county:{type:String},
        state:{type:String},
        zip:{type:String}
    },
    borrower:{
        name:{
            last:{type:String},
            first:{type:String},
            middle:{type:String},
            suffix:{type:String}
        },
        dateOfBirth:{type:Date},
        ssn:{type:String},
        married:{
            type:String,
            enum:['Yes','No']
        },
        incomes:[{
            amount:{type:String},
            source:{type:String}
        }],
        assets:[{
            amount:{type:String},
            source:{type:String}
        }]
    },
    coborrower:{
        name:{
            last:{type:String},
            first:{type:String},
            middle:{type:String},
            suffix:{type:String}
        },
        dateOfBirth:{type:Date},
        ssn:{type:String},
        incomes:[{
            amount:{type:String},
            source:{type:String}
        }],
        assets:[{
            amount:{type:String},
            source:{type:String}
        }]
    },
    phones:[{
        number:{
            type:String
        },
        description:{
            type:String
        }

    }],
    emails:[{
        address:{
            type:String
        },
        description:{
            type:String
        }
    }],
    timeInHome:{type:String},
    othersOnTitle:{
        type:String,
        enum:['Yes','No']
    },
    titleMembers:[{
        name:{type:String}
    }],
    credit:{
        score:{type:String},
        rating:{
            type:String,
            enum:['Poor','Fair','Good','Great']
        },
        lates:{
            type:String,
            enum:['Yes','No']
        },
        insuranceLates:{type:String},
        taxLates:{type:String}
    },
    loan:{
        bank:{type:String},
        year:{type:String},
        balance:{type:String},
        date:{type:Date},
        originalPrincipleLimit:{type:String},
        growth:{type:String},
        type:{
            type:String,
            enum:['Fixed','Adjustable']
        },
        rate:{type:String},
        lineOfCredit:{
            available:{
                type:String,
                enum:['Yes','No']
            },
            amount:{type:String},
            number:{type:String}
        },
        takingPayment:{
            available:{
                type:String,
                enum:['Yes','No']
            },
            amountPerMonth:{type:String}
        },
    },
    home:{
        oldValue:{type:String},
        clientEstimate:{type:String},
        zestimate:{type:String},
        bedrooms:{type:String},
        bathrooms:{type:String},
        stories:{type:String},
        squareFeet:{type:String},
        type:{type:String},
        yearBuilt:{type:String},
        acres:{type:String},
        hoa:{
            have:{
                type:String,
                enum:['Yes','No']
            },
            name:{type:String},
            amountPerYear:{type:String}
        },
        upgrades:{
            description:{type:String},
            hardwoodFloors:{type:String},
            bathroom:{type:String},
            kitchen:{type:String}
        },
        needFixing:{type:String},
        customerRating:{type:String}
    },
    needMoneyFor:{
        description:{type:String},
        howMuch:{type:String}
    },
    liensOrJudgements:{type:String},
    notes:{type:String},
    appFollowUp:{type:Date}

}, {
    timestamps:true
});

module.exports = mongoose.model('Application', applicationSchema);