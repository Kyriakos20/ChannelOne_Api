module.exports = {
    initialize:function(api, next){
        api.properties = {
            saveNew: function (params, next) {
                var property = params.property;
                var user = params.user;
                var z = property.address.zip;
                api.models.Property.find({
                    "address.street1": property.address.street1,
                    "address.zip": z
                }, function (err, props) {
                    if(err) {return next(err);}
                    if(props.length > 0)
                    {
                        return next(new Error('Address Exist'));
                    }
                    var moment = require('moment');

                    var d;
                    if(property.mortgageDate)
                    {
                        d = moment(property.mortgageDate, 'M/D/YYYY');
                    } else {
                        d = moment('11/15/2016','M/D/YYYY');
                    }
                    var prev = 0;
                    if(property.previousValue)
                    {
                        prev = parseInt(property.previousValue);
                    }
                    var est = 0;
                    if(property.estimatedValue)
                    {
                        est = parseInt(property.estimatedValue);
                    }
                    var zest = {
                        value: est,
                        userId: user._id,
                        userName: user.name.first+ ' ' +user.name.last
                    };

                    var m = {
                        createdAt: Date.now(),
                        date:d,
                        amount:parseInt((property.mortgageAmount)?property.mortgageAmount:0),
                        rate:0,
                        rateType:'Fixed',
                        previousValue:prev
                    };
                    var eq = 0;
                    if(zest.value > 0 && m.previousValue > 0) {
                        eq = parseInt(zest.value - m.previousValue);
                    }
                    var perc = 0;
                    if(zest.value > 0 && m.previousValue > 0) {
                        perc = (zest.value/m.previousValue*100).toFixed(2);
                    }

                    var s = {
                        category: 'User',
                        description: user.name.first+ ' ' +user.name.last,
                        userId: user._id
                    };
                    var phones = [];
                    phones.push({
                        number:api.helpers.formatPhone(property.phone1),
                        status:'Good',
                        user:user._id,
                        userName:user.name.first+ ' ' +user.name.last,
                        source:'Internal'
                    });

                    if(property.phone2)
                    {
                        phones.unshift({
                            number:api.helpers.formatPhone(property.phone2),
                            status:'Good',
                            user:user._id,
                            userName:user.name.first+ ' ' +user.name.last,
                            source:'Internal'
                        });
                    }
                    if(!property.owner.secondary)
                    {
                        property.owner.secondary = {name:{}};
                    }
                    var p = {
                        owner:{
                            primary:{
                                name:property.owner.primary.name,
                                email:property.email
                            },
                            secondary:{
                                name:property.owner.secondary.name
                            },
                        },
                        address:property.address,
                        mortgage:m,
                        source: s,
                        status: 'Lead',
                        bucket: 'Leads',
                        pipelineOwner:null,
                        currentEquity:eq,
                        currentEquityPercent:perc,
                        mortgageValue:zest,
                        phones:phones,
                        isFirstTime: property.isFirstTime
                    };

                    api.models.Property(p).save(function (err, prop) {
                        if(err)
                        {
                            return next(err);
                        }
                        api.models.Lead({
                            property: prop._id,
                            user: user._id
                        }).save();
                        next(null, prop);
                    });

                });
            },
            getOne: function (id, next) {
                api.models.Property.findById(id, function (err, prop) {
                    if(err) {return next(err);}
                    next(null, prop);
                });
            },
            basicStats:function (params, next) {

                var match = {bucket:{$ne:'Leads'}};

                if(params.id)
                {
                    match = {bucket:{$ne:'Leads'}, pipelineOwner:api.mongo.mongoose.Types.ObjectId(params.id)}
                }

                //console.log(match);

                api.models.Property.aggregate(
                    {
                        $match: match
                    },
                    {
                        $group: {
                            _id:{
                                bucket:"$bucket"
                            },
                            count:{
                                $sum:1
                            }
                        }
                    },
                    {
                        $sort: {
                            "_id.bucket":1
                        }
                    }
                ).exec(function (err, results) {
                    if(err) { next(err); return; }
                    next(null, results);
                });
            },
            turnDown:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        property.turnDowns.push(params.turnDown);
                        property.pipelineOwner = null;
                        if(params.turnDown.reason == 'Sat too long')
                        {
                            property.status = 'Lead';
                        } else {
                            property.status = params.turnDown.type;
                        }
                        property.bucket = 'Leads';
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                if(params.turnDown.reason == 'Sat too long')
                                {
                                    next(null, true);
                                } else {
                                    api.leads.processAssignment(p,params.turnDown.user,false,function (err, results) {
                                        if(err)
                                        {
                                            next(err);
                                        } else {
                                            next(null, true);
                                        }
                                    });
                                }

                            }
                        });

                    }

                });
            },
            recycle: function (params, next) {
                api.models.Property.findById(params.id, function(err, property){
                    if(err) {next(err);} else{
                        property.turnDowns.push({
                            type:'TUD',
                            reason:'Sat too long',
                            user:params.user,
                            userName: params.user.name.first+' '+params.user.name.last
                        });
                        property.pipelineOwner = null;
                        property.status = 'Lead';
                        property.bucket = 'Leads';
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                              next(null, p);
                            }
                        });

                    }

                });
            },
            changeDNC:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        property.canCall = params.status;
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                var donot = {
                                    user:params.user,
                                    userName:params.user.name.first+' '+params.user.name.last,
                                    contactType:'canCall',
                                    value:params.status,
                                    date:Date.now()
                                };
                                p.doNots.push(donot);
                                p.save();
                                next(null, p);
                            }
                        });

                    }

                });
            },
            changeDNM:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        property.canMail = params.status;
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                var donot = {
                                    user:params.user,
                                    userName:params.user.name.first+' '+params.user.name.last,
                                    contactType:'canMail',
                                    value:params.status,
                                    date:Date.now()
                                };
                                p.doNots.push(donot);
                                p.save();
                                next(null, p);
                            }
                        });

                    }

                });
            },
            getBucketForStatus:function (status) {
                if(status == 'Lead')
                {
                    return 'Leads';
                } else if(status == 'Closed')
                {
                    return 'Closed'
                } else if(['Paper App','Work Up','Ready to Pitch'].indexOf(status) >= 0)
                {
                    return 'Completed Apps';
                } else if(['Booked','Docs Out',
                        'Docs In','Counselling In','Case Num Orderded','Appraisal Ordered','Appraisal In'].indexOf(status)>=0)
                {
                    return 'Working';
                } else if (['Submitted to Processing','Sent to Lender', 'Stipped','Clear to Close'].indexOf(status) >= 0)
                {
                    return 'Processing';
                } else {
                    return 'Leads';
                }
            },
            changeStatus:function (params, next) {
                var that = this;
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        property.status = params.status;
                        property.bucket = that.getBucketForStatus(params.status);
                        var st = {
                            user:params.user,
                            userName:params.user.name.first+' '+params.user.name.last,
                            name:params.status,
                            date:Date.now()
                        };
                        
                        if(property.bucket == 'Leads')
                        {
                            property.pipelineOwner = null;
                        }

                        property.statuses.push(st);
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                p.populate('pipelineOwner', function (err, prop) {
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        next(null, prop);
                                    }
                                });
                            }
                        });

                    }

                });
            },
            changeStatusClosed:function (params, next) {
                var that = this;
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        property.status = 'Closed';
                        property.bucket = 'Closed';
                        var st = {
                            user:params.user,
                            userName:params.user.name.first+' '+params.user.name.last,
                            name:'Closed',
                            date:Date.now()
                        };

                        var mortgage = Object.assign({}, params.closed.mortgage);
                        var old = Object.assign({}, property.mortgage);
                        Object.assign(property.mortgage, mortgage);
                        property.mortgages.push(old);
                        property.statuses.push(st);
                        var eq = parseInt(property.mortgageValue.value - property.mortgage.previousValue);
                        var perc = (property.mortgageValue.value/property.mortgage.previousValue*100).toFixed(2);
                        property.currentEquity = eq;
                        property.currentEquityPercent = perc;

                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                p.populate('pipelineOwner', function (err, prop) {
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        next(null, prop);
                                    }
                                });
                            }
                        });

                    }

                });
            },
            changeOwner:function (params, next) {
                var that = this;
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        property.status = 'Paper App';
                        property.bucket = 'Completed Apps';
                        var st = {
                            user:params.user,
                            userName:params.user.name.first+' '+params.user.name.last,
                            name:'Paper App',
                            date:Date.now()
                        };

                        property.pipelineOwner = params.owner;

                        property.statuses.push(st);
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                p.populate('pipelineOwner', function(err, prop){
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        next(null, prop);
                                    }
                                });
                            }
                        });

                    }

                });
            },
            changeColor:function (params, next) {
                var that = this;
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        var st = {
                            user:params.user,
                            userName:params.user.name.first+' '+params.user.name.last,
                            name:params.color,
                            date:Date.now()
                        };
                        property.colors.push(st);
                        property.save(function (err,p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                p.populate('pipelineOwner', function(err, prop){
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        next(null, prop);
                                    }
                                });
                            }
                        });

                    }

                });
            },
            changePhoneStatus:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        var phone = property.phones.id(params.phone._id);
                        phone.updated = Date.now();
                        phone.userName = params.user.name.first+' '+params.user.name.last;
                        phone.user = params.user;
                        phone.status = params.status;
                        property.save(function (err) {
                            if(err)
                            {
                                next(err);
                            } else {
                                next(null, true);
                            }
                        });

                    }

                });
            },
            addPhone:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        phone = {};
                        phone.number = api.helpers.formatPhone(params.phone);
                        phone.updated = Date.now();
                        phone.userName = params.user.name.first+' '+params.user.name.last;
                        phone.user = params.user;
                        phone.status = 'Good';
                        phone.source = 'Internal';
                        property.phones.push(phone);
                        property.save(function (err, p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                next(null, p);
                            }
                        });

                    }

                });
            },
            addWPPhone:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        phone = {};
                        phone.number = api.helpers.formatPhone(params.phone.phone_number);
                        phone.updated = Date.now();
                        phone.userName = params.user.name.first+' '+params.user.name.last;
                        phone.user = params.user;
                        phone.status = 'Good';
                        phone.source = 'WhitePagesPro';
                        property.phones.push(phone);
                        property.save(function (err, p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                next(null, p);
                            }
                        });

                    }

                });
            },
            addComment:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        comment = {};
                        comment.body = params.comment;
                        comment.userName = params.user.name.first+' '+params.user.name.last;
                        comment.user = params.user;
                        comment.date = Date.now();
                        property.comments.push(comment);
                        property.save(function (err, p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                next(null, p);
                            }
                        });

                    }

                });
            },
            deleteComment:function (params, next) {
                api.models.Property.findById(params.property, function(err, property){
                    if(err) {next(err);} else{
                        var c = property.comments.id(params.comment._id);
                        c.remove();
                        property.save(function (err, p) {
                            if(err)
                            {
                                next(err);
                            } else {
                                next(null, p);
                            }
                        });

                    }

                });
            },
            export:function (items, next) {
                items = items.leads;
                //console.log('COUNT '+items.length );

                var csvWriter = require('csv-write-stream');
                var moment = require('moment');
                var fs = require('fs');
                var writer = csvWriter({
                    headers: [
                        'ID','Owner Last','Owner First','Address 1','Address 2','City','State','County','Zip','Mortgage Amount',
                        'Fixed/Adjustable','Closed Date','Previous Value','Estimated Value','Equity','Equity Percent',
                        'Can Call','Can Mail','Phone'
                    ],
                    sendHeaders: true
                });
                var d = moment().format('M-D-YY_H_m_A')+'_'+moment().format('x');
                var p = 'public/exports/channelone_export_'+d+'.csv';
                var file = fs.createWriteStream(p);
                writer.pipe(file);

                file.on('finish', function(){
                    next(null, p);
                });

                for(var i = 0;i<items.length;i++)
                {
                    var item = items[i];
                    writer.write([
                        item.oldId,
                        item.owner.primary.name.last,
                        item.owner.primary.name.first,
                        item.address.street1,
                        item.address.street2,
                        item.address.city,
                        item.address.state,
                        item.address.county,
                        item.address.zip,
                        item.mortgage.amount,
                        item.mortgage.loanType,
                        moment(item.mortgage.date).format('MM/DD/YY'),
                        item.mortgage.previousValue,
                        item.mortgageValue.value,
                        item.currentEquity,
                        item.currentEquityPercent,
                        item.canCall,
                        item.canMail,
                        item.phones.length?item.phones[0].number:''
                    ]);
                }
                writer.end();


            },
            searchAll:function (filter, next) {

                var query = {};

                if(filter.oldId)
                {
                    query["oldId"]= filter.oldId;
                }
                if(filter.last)
                {
                    query["owner.primary.name.last"]= new RegExp('^'+filter.last+'.*', 'i');

                }
                if(filter.zip)
                {
                    query["address.zip"]= filter.zip;
                }

                if(filter.first)
                {
                    query["owner.primary.name.first"]= new RegExp('^'+filter.first+'.*', 'i');
                }

                if(filter.street)
                {
                    query["address.street1"]= new RegExp('.*'+filter.street+'.*', 'i');
                }

                if(filter.state)
                {
                    query["address.state"]= filter.state;
                }

                if(filter.phone)
                {
                    query["phones.number"]= api.helpers.formatPhone(filter.phone);
                }

                api.models.Property.find(query)
                    .sort('-owner.primary.name.last')
                    .limit(500)
                    .populate('pipelineOwner')
                    .exec(function(err, results) {
                        if(err)
                        {
                            next(err);
                        } else {
                            next(null, results);
                        }
                    });
                   
            },






            all: function (filters, getUsers, next) {
                var moment = require('moment');
                var Promise = require('bluebird');
                var response = {
                    leads:[],
                    meta:{}
                };

                var sortString = filters.sortOn;
                if(!filters.sortOn)
                {
                    sortString = '_id';
                } else if(filters.sortDir == 'desc')
                {
                    sortString = '-'+sortString;

                }

                var sortObj = {};
                var sortDir = 1;
                if(filters.sortDir == 'desc') {
                    sortDir = -1;
                }
                if(filters.sortOn) {
                    sortObj[filters.sortOn] = sortDir;
                } else {
                    sortObj['_id'] = sortDir;
                }

                var skip = null;
                if(filters.perPage)
                {
                    skip = (filters.page -1) * filters.perPage;
                }

                var query = {};
                if(filters.oldId)
                {
                    query["oldId"]= filters.oldId;
                }

                if(filters.closeBy)
                {
                    query["statuses"] = {$elemMatch:{name:'Closed', user:{$in:[filters.closedBy]}}};
                }

                if(filters.zip)
                {
                    query["address.zip"]= filters.zip;
                }

                if(filters.lastName)
                {
                    query["owner.primary.name.last"]= new RegExp('^'+filters.lastName+'.*', 'i');

                }

                if(filters.firstName)
                {
                    query["owner.primary.name.first"]= new RegExp('^'+filters.firstName+'.*', 'i');
                }

                if(filters.street)
                {
                    query["address.street1"]= new RegExp('.*'+filters.street+'.*', 'i');
                }

                if(filters.city)
                {
                    query["address.city"]= new RegExp('^'+filters.city+'.*', 'i');
                }

                if(filters.onlyPhones && filters.onlyPhones == 'Yes')
                {
                    query["phones"] = { $exists: true, $not: { $size: 0 }};
                }

                if(filters.firstTime && filters.firstTime == 'First')
                {
                    query["isFirstTime"] = true;
                } else if (filters.firstTime && filters.firstTime == 'Hecm') {
                    query["isFirstTime"] = false;
                }

                if(filters.phone)
                {
                    query["phones.number"]= new RegExp('.*'+filters.phone+'.*', 'i');
                }

                if(filters.loanType && filters.loanType != 'Both')
                {
                    query["mortgage.rateType"]= filters.loanType;
                }

                if(filters.mtgAmount && (filters.mtgAmount.min > 0 || filters.mtgAmount.max < 1000000))
                {
                    query["mortgage.amount"] = {$gte:filters.mtgAmount.min,$lte:filters.mtgAmount.max};
                }

                if(filters.prevValue && (filters.prevValue.min > 0 || filters.prevValue.max < 1000000))
                {
                    query["mortgage.previousValue"] = {$gte:filters.prevValue.min,$lte:filters.prevValue.max};
                }

                if(filters.zestimate && (filters.zestimate.min > 0 || filters.zestimate.max < 1000000))
                {
                    query["mortgageValue.value"] = {$gte:filters.zestimate.min,$lte:filters.zestimate.max};
                }

                if(filters.equity && (filters.equity.min > 0 || filters.equity.max < 1000000))
                {
                    query["currentEquity"] = {$gte:filters.equity.min,$lte:filters.equity.max};
                }

                if(filters.equityPercent && (filters.equityPercent.min > 0 || filters.equityPercent.max < 1000))
                {
                    query["currentEquityPercent"] = {$gte:filters.equityPercent.min,$lte:filters.equityPercent.max};
                }

                if(filters.closingDate && (filters.closingDate.start != '1/1/1975' || filters.closingDate.end != moment().format('M/D/YYYY')))
                {
                    query["mortgage.date"] = {$gte:moment(filters.closingDate.start, 'M/D/YYYY').toDate(),$lte:moment(filters.closingDate.end, 'M/D/YYYY').toDate()};
                }

                if(filters.pipelineStatuses && filters.pipelineStatuses.length)
                {
                    if(filters.pipelineStatuses.length == 1)
                    {
                        query.status = filters.pipelineStatuses[0];
                    } else {
                        query.status = {$in:filters.pipelineStatuses};
                    }
                }

                if(filters.doNot && filters.doNot != 'none')
                {
                    if(filters.doNot == 'onlydnc')
                    {
                        query.canCall = 'No';
                    }
                    if(filters.doNot == 'onlydnm')
                    {
                        query.canMail = 'No';
                    }
                    if(filters.doNot == 'notdnc')
                    {
                        query.canCall = 'Yes';
                    }
                    if(filters.doNot == 'notdnm')
                    {
                        query.canMail = 'Yes';
                    }
                } else {
                    query.canMail = {$ne:'No'};
                    query.canCall = {$ne:'No'};
                }

                var qOrs = [];
                if(filters.states)
                {
                    var ors = [];
                    for(var i = 0; i<filters.states.length; i++)
                    {
                        var st = filters.states[i];
                        if(!filters.counties)
                        {
                            filters.counties = {};
                        }
                        var cn = filters.counties[st];

                        if(cn && cn.length)
                        {
                            ors.push({$and:[
                                {"address.state":st},
                                {"address.county":{$in:api.helpers.fixCountyArray(cn)}}
                            ]});

                        } else {
                            ors.push({"address.state":st});
                        }
                    }
                    if(ors.length)
                    {
                        qOrs.push({$or:ors});
                    }
                }

                if(qOrs.length)
                {
                    query.$and = qOrs;
                }
                var agg = false;
                if(filters.user) {
                    if(filters.pipelineStatuses && filters.pipelineStatuses.length && filters.pipelineStatuses.indexOf('Lead') >= 0) {
                        agg = true;
                        query.$or = [
                            {pipelineOwner:{$exists:false}},
                            {pipelineOwner:{$type:10}}
                        ];
                    } else {
                        query.pipelineOwner = filters.user;
                    }
                }

                if(agg) {
                    //api.log('q: ', 'crit', query);
                    var stages = [

                        // Stage 1
                        {
                            $match: {
                                user: api.mongo.mongoose.Types.ObjectId(filters.user._id)
                            }
                        },
                        // Stage 2
                        {
                            $lookup: {
                                "from" : "properties",
                                "localField" : "property",
                                "foreignField" : "_id",
                                "as" : "prop"
                            }
                        },
                        // Stage 3
                        {
                            $unwind: {
                                path : "$prop"
                            }
                        },
                        // Stage 4
                        {
                            $replaceRoot: {
                                newRoot: "$prop"
                            }
                        },
                        // Stage 5
                        {
                            $match: query
                        }
                    ];

                    var stages2 = stages.slice(0);

                    stages2.push({
                        $count:'count'
                    });

                    stages.push({
                        $sort: sortObj
                    });
                    if(skip) {
                        stages.push({
                            $skip: skip
                        });
                    }
                    if(filters.perPage) {
                        stages.push({
                            $limit: filters.perPage
                        });
                    }

                    Promise.all([
                        api.models.Lead.aggregate(stages2).exec(),
                        api.models.Lead.aggregate(stages).exec()
                    ]).spread(function (cnt, res) {
                        var response = {};
                        response.leads = res;
                        response.meta = {
                            perPage:filters.perPage,
                            page:filters.page,
                            total:(cnt && cnt.length)?cnt[0].count:0
                        };
                        next(null, response);
                    }).catch(function (err) {
                        next(err);
                    })
                } else {
                    var finder = api.models.Property.find(query)
                        .sort(sortString)
                        .limit(filters.perPage)
                        .skip(skip);

                    if(getUsers)
                    {
                        finder.populate('pipelineOwner');
                    }
                    Promise.all([
                        api.models.Property.count(query).exec(),
                        finder.exec()
                    ]).spread(function (cnt, res) {
                        var response = {};
                        response.leads = res;
                        response.meta = {
                            perPage:filters.perPage,
                            page:filters.page,
                            total:cnt
                        };
                        next(null, response);
                    }).catch(function (err) {
                        next(err);
                    })
                }
            },





            old:function (filters, ids, getUsers, next) {



                var moment = require('moment');

                var response = {
                    leads:[],
                    meta:{}
                };

                var sortString = filters.sortOn;
                if(!filters.sortOn)
                {
                    sortString = '_id';
                } else if(filters.sortDir == 'desc')
                {
                    sortString = '-'+sortString;
                }

                var skip = null;
                if(filters.perPage)
                {
                    skip = (filters.page -1) * filters.perPage;
                }

                var query = {};

                if(filters.oldId)
                {
                    query["oldId"]= filters.oldId;
                }

                if(filters.closeBy)
                {
                    query["statuses"] = {$elemMatch:{name:'Closed', user:{$in:[filters.closedBy]}}};
                }

                if(filters.zip)
                {
                    query["address.zip"]= filters.zip;
                }

                if(filters.lastName)
                {
                    query["owner.primary.name.last"]= new RegExp('^'+filters.lastName+'.*', 'i');

                }
                if(filters.firstName)
                {
                    query["owner.primary.name.first"]= new RegExp('^'+filters.firstName+'.*', 'i');
                }

                if(filters.street)
                {
                    query["address.street1"]= new RegExp('.*'+filters.street+'.*', 'i');
                }

                if(filters.city)
                {
                    query["address.city"]= new RegExp('^'+filters.city+'.*', 'i');
                }

                var qOrs = [];
                if(filters.states)
                {
                    var ors = [];
                    for(var i = 0; i<filters.states.length; i++)
                    {
                        var st = filters.states[i];
                        if(!filters.counties)
                        {
                            filters.counties = {};
                        }
                        var cn = filters.counties[st];

                        if(cn && cn.length)
                        {
                            ors.push({$and:[
                                {"address.state":st},
                                {"address.county":{$in:api.helpers.fixCountyArray(cn)}}
                            ]});

                        } else {
                            ors.push({"address.state":st});
                        }
                    }
                    if(ors.length)
                    {
                        qOrs.push({$or:ors});
                    }
                }
                if(filters.onlyPhones && filters.onlyPhones == 'Yes')
                {
                    query["phones"] = { $exists: true, $not: { $size: 0 }};
                }
                if(filters.phone)
                {
                    query["phones.number"]= new RegExp('.*'+filters.phone+'.*', 'i');
                }


                
                if(filters.loanType && filters.loanType != 'Both')
                {
                    query["mortgage.rateType"]= filters.loanType;
                }

                if(filters.mtgAmount && (filters.mtgAmount.min > 0 || filters.mtgAmount.max < 1000000))
                {
                    query["mortgage.amount"] = {$gte:filters.mtgAmount.min,$lte:filters.mtgAmount.max};
                }

                if(filters.prevValue && (filters.prevValue.min > 0 || filters.prevValue.max < 1000000))
                {
                    query["mortgage.previousValue"] = {$gte:filters.prevValue.min,$lte:filters.prevValue.max};
                }

                if(filters.zestimate && (filters.zestimate.min > 0 || filters.zestimate.max < 1000000))
                {
                    query["mortgageValue.value"] = {$gte:filters.zestimate.min,$lte:filters.zestimate.max};
                }

                if(filters.equity && (filters.equity.min > 0 || filters.equity.max < 1000000))
                {
                    query["currentEquity"] = {$gte:filters.equity.min,$lte:filters.equity.max};
                }

                if(filters.equityPercent && (filters.equityPercent.min > 0 || filters.equityPercent.max < 1000))
                {
                    query["currentEquityPercent"] = {$gte:filters.equityPercent.min,$lte:filters.equityPercent.max};
                }

                if(filters.closingDate && (filters.closingDate.start != '1/1/1975' || filters.closingDate.end != moment().format('M/D/YYYY')))
                {
                    query["mortgage.date"] = {$gte:moment(filters.closingDate.start, 'M/D/YYYY').toDate(),$lte:moment(filters.closingDate.end, 'M/D/YYYY').toDate()};
                }

                if(filters.pipelineStatuses && filters.pipelineStatuses.length)
                {
                    if(filters.pipelineStatuses.length == 1)
                    {
                        query.status = filters.pipelineStatuses[0];
                    } else {
                        query.status = {$in:filters.pipelineStatuses};
                    }
                }

                if(filters.doNot && filters.doNot != 'none')
                {
                    if(filters.doNot == 'onlydnc')
                    {
                        query.canCall = 'No';
                    }
                    if(filters.doNot == 'onlydnm')
                    {
                        query.canMail = 'No';
                    }
                    if(filters.doNot == 'notdnc')
                    {
                        query.canCall = 'Yes';
                    }
                    if(filters.doNot == 'notdnm')
                    {
                        query.canMail = 'Yes';
                    }
                } else {
                    query.canMail = {$ne:'No'};
                    query.canCall = {$ne:'No'};
                }

                if(filters.user)
                {
                    var idArray = [];
                    for(var i = 0; i < ids.length;i++)
                    {
                        idArray.push(ids[i].property);
                    }
                    qOrs.push({$or:[
                        {pipelineOwner:filters.user._id},
                        {$and:[
                            {_id:{$in:idArray}},
                            {
                                $or:[
                                    {pipelineOwner:{$exists:false}},
                                    {pipelineOwner:{$type:10}}
                                ]

                            }
                        ]}
                    ]});
                }
                
                if(qOrs.length)
                {
                    query.$and = qOrs;
                }

                api.models.Property.count(query, function(err, c) {

                    var finder = api.models.Property.find(query)
                        .sort(sortString)
                        .limit(filters.perPage)
                        .skip(skip);

                    if(getUsers)
                    {
                        finder.populate('pipelineOwner');
                    }

                    finder.exec(function(err, results) {
                            if(err)
                            {
                                next(err);
                            } else {
                                response.leads = results;
                                response.meta = {
                                    perPage:filters.perPage,
                                    page:filters.page,
                                    total:c
                                };
                                next(null, response);
                            }
                        });
                });
            },

            updateValue:function (record, next) {
                var id = record.propertyId.replace("ObjectId(","").replace(")","");

                api.models.Property.findById(id, function(err, property){
                    if(err) {next(err);} else{
                        var p = {
                            source:'Zillow',
                            date:Date.now(),
                            value:parseInt(record.value),
                            link:'http://www.zillow.com/homedetails/'+parseInt(record.zpid)+'_zpid/',
                            zpid:parseInt(record.zpid)
                        };
                        property.mortgageValue = p;
                        property.mortgageValues.push(p);
                        property.save(function (err, saved) {
                            next(err,saved);
                        });
                    }

                });
            },
            updateValueFromZillow: function (id, zpid, zestimate, next) {
                var id = id.replace("ObjectId(","").replace(")","");
                api.models.Property.findById(id, function(err, property){
                    if(err) {next(err);} else{
                        var p = {
                            source:'Zillow',
                            date:Date.now(),
                            value:parseInt(zestimate),
                            link:'http://www.zillow.com/homedetails/'+parseInt(zpid)+'_zpid/',
                            zpid:parseInt(zpid)
                        };
                        property.mortgageValue = p;
                        property.mortgageValues.push(p);
                        var eq = parseInt(property.mortgageValue.value - property.mortgage.previousValue);
                        var perc = (property.mortgageValue.value/property.mortgage.previousValue*100).toFixed(2);
                        property.currentEquity = eq;
                        property.currentEquityPercent = perc;
                        property.save(function (err) {
                            if(err)
                            {
                                next(err);
                            }  else {
                                next(null, true);
                            }
                        });
                    }

                });
            },

            updateValueFromYellow: function (id, nums, next) {
                var _ = require('lodash');
                var id = id.replace("ObjectId(","").replace(")","");
                api.models.Property.findById(id, function(err, property){
                    if(err) {
                        next(err);
                    } else{
                        var phones = nums;//nums.split(",");
                        var propPhones = property.phones;
                        phones = _.uniq(phones);
                        var propPhoneArray = [];
                        propPhones.map(function (o) {
                            propPhoneArray.push(o.number);
                        });
                        _.pullAll(phones, propPhoneArray);
                        if(phones.length <= 0)
                        {
                            next(null, true);
                            return;
                        }
                        phones.map(function (p) {
                            property.phones.push({
                                number      : p,
                                status      : 'Good',
                                createdAt   : Date.now(),
                                source      : 'WhitePages'
                            });
                        });
                        property.save(function (err) {
                            if(err)
                            {
                                next(err);
                            }  else {
                                next(null, true);
                            }
                        });
                    }

                });
            }
        };
        next();
    }
};