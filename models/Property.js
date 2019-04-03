var mongoose = require('mongoose');
var autoinc = require('mongoose-auto-increment');
autoinc.initialize(mongoose.connection);

var status_list = ['Lead','Paper App','Work Up','Ready to Pitch','Booked','Docs Out',
    'Docs In','Counselling In','Case Num Orderded','Appraisal Ordered','Appraisal In',
    'Submitted to Processing','Sent to Lender', 'Stipped','Clear to Close','Closed', 'TUD', 'WTD'];
var td_reason_list = ['Did not like offer', 'Did not need the money', 'Did not want the hassle', 'Lost contact','Invalid phone', 'Not enough money',
    'Balance too high','Borrower died','Bad credit','Home damage','Low income','Value is low','Closed recently', 'Sat too long'];
var indexTypes = ["CMT/TCM","T-Bill","MTA/MAT","CODI","COFI","COSI","LIBOR","CD","Prime"];
var rateTypes = ['Fixed','Adjustable','Hybrid'];
var source_list = ['Self/Referral', 'Personal Mailer', 'Dialer', 'Corporate Mailer', 'Cold Call', 'Other', 'None Selected'];

var propertySchema = new mongoose.Schema({
    deletedAt:{type:Date},
    oldId:{type:Number},
    sValue:{type: Boolean},
    source:{
        category:{
            type:String,
            enum:['Internal','List','User']
        },
        description:{type:String},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
    },
    address:{
        street1:{type:String},
        street2:{type:String},
        city:{type:String},
        county:{type:String},
        state:{type:String},
        zip:{type:String}
    },
    canMail:{
        type:String,
        enum:['Yes','No'],
        default:'Yes'
    },
    canCall:{
        type:String,
        enum:['Yes','No'],
        default:'Yes'
    },
    doNots:[{
        date:{type:Date,default:Date.now()},
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        contactType:{
            type:String,
            enum:['canCall','canMail']
        },
        value:{
            type:String,
            enum:['Yes','No']
        }
    }],
    owner:{
        primary:{
            name:{
                first:{type:String},
                middle:{type:String},
                last:{type:String},
                suffix:{type:String}
            },
            email:{type:String}
        },
        secondary:{
            name:{
                first:{type:String},
                middle:{type:String},
                last:{type:String},
                suffix:{type:String}
            }
        }
    },
    owners:[{
        name:{
            first:{type:String},
            middle:{type:String},
            last:{type:String},
            suffix:{type:String}
        }
    }],
    phones:[{
        number:{type:String},
        createdAt:{type:Date,default:Date.now()},
        status:{
            type:String,
            enum:['Good','Bad']
        },
        updated:{type:Date},
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        source:{
            type:String,
            enum:['Internal','PPL','WhitePages','YellowPages', 'Pipl', 'InfoUSA', 'DataFinder', 'WhitePagesPro', 'SearchBug','ABC']
        },
        phoneType: {
            type:String,
            enum: ['Mobile','Landline'],
            default: 'Landline'
        }
    }],
    mortgage:{
        createdAt:{type:Date,default:Date.now()},
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        date:{type:Date},
        amount:{type:Number},
        rate:{type:Number},
        rateType:{
            type:String,
            enum:rateTypes
        },
        previousValue:{type:Number},
        lender:{type:String},
        assessmentYear:{type:String},
        assessedValue:{type:String},
        indexType:{
            type:String,
            enum: indexTypes
        },
        indexNum:{type:Number},
        margin:{type:Number},
        mip:{type:Number},
        upb:{type:Number},
        principalLimit:{type:Number},
        draw:{type:Number},
        yeartwomoney:{type:Number},
        lesa:{type:Boolean},
        casenum:{type: String}
    },
    mortgages:[{
        createdAt:{type:Date,default:Date.now()},
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        date:{type:Date},
        amount:{type:Number},
        rate:{type:Number},
        rateType:{
            type:String,
            enum: rateTypes
        },
        previousValue:{type:Number},
        lender:{type:String},
        assessmentYear:{type:String},
        assessedValue:{type:String},
        indexType:{
            type:String,
            enum: indexTypes
        },
        indexNum:{type:Number},
        margin:{type:Number},
        mip:{type:Number},
        upb:{type:Number},
        principalLimit:{type:Number},
        draw:{type:Number},
        yeartwomoney:{type:Number},
        lesa:{type:Boolean},
        casenum:{type: String}
    }],
    mortgageValue:{
        source:{
            type:String,
            enum:['Zillow','Zillow Calculation','User']
        },
        date:{type:Date,default:Date.now()},
        value:{type:Number},
        link:{type:String},
        zpid:{type:String},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String}
    },
    mortgageValues:[{
        source:{
            type:String,
            enum:['Zillow', 'Zillow Calculation']
        },
        date:{type:Date,default:Date.now()},
        value:{type:Number},
        link:{type:String},
        zpid:{type:String}
    }],
    currentEquity:{type:Number},
    currentEquityPercent:{type:Number},
    currentAssessedPercent:{type:Number},
    comments:[{
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        date:{type:Date,default:Date.now()},
        body:{type:String}
    }],
    colors:[{
        name:{
            type:String,
            enum:['info','warning','danger','success','none']
        },
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        date:{type:Date,default:Date.now()}
    }],
    bucket:{
        type:String,
        enum:['Leads','Completed Apps','Working','Processing','Closed','Manager Review'],
        default:'Leads'
    },
    pipelineOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    status:{
        type:String,
        enum:status_list,
        default:'Lead'
    },
    statuses:[{
        name:{
            type:String,
            enum:status_list
        },
        source:{
            type:String,
            enum:source_list,
            default:'None Selected',
            required: true
        },
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        date:{type:Date,default:Date.now()}
    }],
    turnDowns:[{
        type:{
            type:String,
            enum:['WTD','TUD']
        },
        reason:{
            type:String,
            enum:td_reason_list
        },
        date:{type:Date,default:Date.now()},
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
    }],
    applications:[{
        app:{type:mongoose.Schema.Types.ObjectId,ref:'Application'},
        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String},
        date:{type:Date,default:Date.now()}
    }],
    closings: [{

        user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        userName:{type:String}
    }],
    searchbug: {
        id: {
            type: String
        }
    },
    isFirstTime: {
        type: Boolean,
        default: false
    }
}, {
    timestamps:true
});

propertySchema.plugin(autoinc.plugin, {
    model: 'Property',
    field: 'oldId',
    startAt: 1100000
});

module.exports = mongoose.model('Property', propertySchema);