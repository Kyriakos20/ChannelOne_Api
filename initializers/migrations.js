module.exports = {
    initialize:function(api, next){
        api.migrations = {
            fixInfoUSAPhones: function (next) {
                var stream = api.models.Property.find({
                    "phones.number" : { $regex: "\\(" }
                }, {phones:1}).limit(1000).stream();

                stream.on('data',function(item) {
                    api.tasks.enqueue('processUSAPhoneFix',{property:item},'usaphonefix');
                });

                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'DONE');
                });
            },
            fixOldIds:function (next) {
                var start = 1059312;
                var stream = api.models.Property.find({
                    oldId:{$exists:false}
                }).stream();
                stream.on('data', function (item) {
                    start++;
                    item.oldId = start;
                    item.save();
                });
                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'fooey');
                });
            },
            createBlankLead:function (next) {
                var p = new api.models.Property;
                p.save(function (err, prop) {
                    next(err, prop)  ;
                });
            },
            fixCounties:function (next) {
                var that = this;
                /*
                var stream =  api.models.Property.find({
                    "address.county": /.*County$/i
                }).stream();
                stream.on('data',function(item) {
                    var cnt = item.address.county;
                    var newc = cnt.replace('County','').trim();
                    item.address.county = newc;
                    item.save();
                });
                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'fooey');
                });
                */

                api.models.Property.distinct('address.county', function (err, items) {
                    for(var i = 0; i<items.length;i++)
                    {
                        var item = items[i];
                        if(item && item.indexOf(' County') >= 0)
                        {

                            var newc = item.replace(' County','').trim();


                            that.processFixCounty(item, newc, i);



                        }
                    }
                    next(null, 'fooey');
                });

            },
            processFixCounty:function (o, n, i) {
                api.models.Property.update(
                    {
                        "address.county":o
                    },{
                        $set:{"address.county":n}
                    },{
                        multi:true
                    }, function (err, prop) {
                        console.log(o+' '+n+' '+i+' done');
                        return true;
                    }
                );
            },
            fillInValues:function (next) {
                var moment = require('moment');
                var d = moment('2016-04-13','YYYY-MM-DD');
                console.log(d);
                var i = 0;
                var stream =  api.models.Property.find({
                    "createdAt": { $gt: d }, "mortgageValue.value": { $exists: true }
                }).limit(1000).stream();
                stream.on('data',function(item) {
                    var eq = parseInt(item.mortgageValue.value - item.mortgage.previousValue);
                    var perc = (item.mortgageValue.value/item.mortgage.previousValue*100).toFixed(2);
                    item.currentEquity = eq;
                    item.currentEquityPercent = perc;
                    console.log(item);
                    //item.save();
                    next();


                });

                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'fooey');
                });
            },
            fixEquity:function (next) {
                var stream = api.models.Property.find({
                    "mortgageValue.date": {$gt: new Date(2017,7,30) },
                    "mortgageValue.value": { $exists: true },
                    "mortgage.previousValue": { $exists: true }
                }).stream();
                stream.on('data',function(item) {

                        // var eq = parseInt(item.mortgageValue.value - item.mortgage.previousValue);
                        // var perc = (item.mortgageValue.value/item.mortgage.previousValue*100).toFixed(2);
                        // item.currentEquity = eq;
                        // item.currentEquityPercent = perc;
                        // console.log(item._id);
                        // console.log(item.mortgage.previousValue);
                        // console.log(item.mortgageValue.value);
                        // console.log(item.currentEquity);
                        // //item.save();
                        // next();
                    api.tasks.enqueue('processFixEquity', {property: item}, 'default');

                });

                stream.on('error', function (err) {
                    api.log('ERROR !!!!!!!!!!!!!!!!!', 'crit');
                    next(err);
                });
                stream.on('close', function () {
                    api.log('FINISHED !!!!!!!!!!!!!!!!!', 'crit');
                    next(null, true);
                });
            },
            getZillowDataValue: function (next) {
                stream = api.models.Property.find({"source.description":"10-2016-120k"}).stream();
                stream.on('data', function (item) {
                    api.tasks.enqueue('processZillowData',{record:item},'default');
                });
                stream.on('error', function (err) {
                    console.log('error');
                    next(err);
                });
                stream.on('close', function () {
                    console.log('END');
                    next(null,'fooey');
                });
            },
            startFakeValues: function (next) {
              var stream = api.models.Property.find({
                  "mortgageValue.source":"Zillow",
                  "mortgageValue.date": {$lt: new Date(2017, 4, 1)},
                  "mortgageValue.value" : {$gt: 100000}
              })
                  .skip(9)
                  .limit(2)
                  .stream();

                stream.on('data',function(item) {
                    api.tasks.enqueue('processFakeVal',{record:item},'default');
                });

                stream.on('error', function (err) {
                    console.log('error');
                    next(err);
                });
                stream.on('close', function () {

                    next(null,'-----------DONE --------------------------');
                });
            },
            fakeAllValues:function (next) {

                var moment = require('moment');
                var d = moment('2016-04-13','YYYY-MM-DD');
                var i = 0;
                stream = api.models.Property.find().limit(500).skip(500).stream();
                stream.on('data',function(item) {
                    i++;
                    if(item.createdAt > d)
                    {

                        var perc = ((Math.random() * 18) - 4)/100;
                        if(perc < 0)
                        {
                            var pos = Math.random();
                            if(pos > .5)
                            {
                                perc *= -1;
                            }
                        }
                        var prev = item.mortgage.previousValue;

                        if(prev)
                        {

                            var newval = parseInt(prev);
                            newval += parseInt(perc*newval);
                            console.log('prev: '+prev);
                            console.log('perc: '+perc);
                            console.log('newval: '+newval);

                            var tosave = {
                                source:'Zillow',
                                value:newval,
                                date:Date.now()
                            };
                            console.log(tosave);

                            item.mortgageValues = [];
                            item.mortgageValues.push(tosave);
                            item.mortgageValue = tosave;
                            item.currentEquity = newval - parseInt(prev);
                            item.currentEquityPercent = (newval/parseInt(prev))*100;
                            console.log('Equity: '+item.currentEquity);
                            console.log('Equity Percent: '+item.currentEquityPercent);

                            item.save();

                        }


                    } else {
                        var currval = 0;
                        if(item.mortgageValue.value)
                        {
                            currval = parseInt(item.mortgageValue.value);
                        } else if(item.mortgage.previousValue) {
                            currval = parseInt(item.mortgage.previousValue);
                        }
                        if(currval > 0)
                        {
                            var perc = ((Math.random() * 18) - 4)/100;
                            if(perc < 0)
                            {
                                var pos = Math.random();
                                if(pos > .5)
                                {
                                    perc *= -1;
                                }
                            }
                            console.log('current value: '+currval);
                            console.log('percent: '+perc);
                            var newval = currval;
                            newval += parseInt(perc*currval);
                            console.log('new val: '+newval);
                            var tosave = {
                                source:'Zillow',
                                value:newval,
                                link:item.mortgageValue.link,
                                zpid:item.mortgageValue.zpid,
                                date:Date.now()
                            };
                            console.log(tosave);
                            var prev = parseInt(item.mortgage.previousValue);
                            console.log('prev: '+prev);
                            item.mortgageValues.push(tosave);
                            item.mortgageValue = tosave;
                            item.currentEquity = newval - parseInt(prev);
                            item.currentEquityPercent = (newval/parseInt(prev))*100;
                            console.log('Equity: '+item.currentEquity);
                            console.log('Equity Percent: '+item.currentEquityPercent);
                            item.save();
                        }
                    }
                    console.log('-----------'+i+'-------------');
                });

                stream.on('error', function (err) {
                    console.log('error');
                    next(err);
                });
                stream.on('close', function () {
                    console.log('END');
                    console.log(i);
                    next(null,'fooey');
                });
            },
            importDestinyLeads: function (next) {
                const sheet = '/vagrant/db/destiny/destinytest.csv';
                const fs = require('fs');
                const parse = require('csv-parse');
                const rs = fs.createReadStream(sheet);
                const parser = parse({delimiter:',',columns:true});
                parser.on('readable', () => {
                  while(record = parser.read()) {
                      api.tasks.enqueue('processDestinyLead', {record:record}, 'default');
                      //api.log('RECORD ', 'crit', record);
                  }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            importPhones:function (next) {
                var i = 0;
                var sheet = '/vagrant/db/csvs3/phonesB.csv';
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){

                        api.tasks.enqueue('processPhone',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            addTelePhones:function (next) {
                var sheet = '/vagrant/db/phones/phones_5_29.csv';
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        if(record.land) {
                            api.tasks.enqueue('processTelePhone',{record:record, mobile:false},'default');
                        }
                        if(record.cell) {
                            api.tasks.enqueue('processTelePhone',{record:record, mobile:true},'default');
                        }
                    }
                });
                parser.on('error', function(err){
                   return next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    return next(null,'done');
                });
                rs.pipe(parser);
            },
            fixSValues: function(next){
                api.tasks.enqueue('startSValues', {}, 'default');
                next(null, true);
            },
            readSValues: function(next) {
                var sheet = api.projectRoot + '/imports/' + 'zillowupdate.csv';
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter: ',', columns: true});
                var i = 0;
                parser.on('readable', function () {
                    while (record = parser.read()) {
                        api.tasks.enqueue('processSValue', {record: record}, 'default');
                        //i++;
                        //api.log('set this up', 'crit', i);
                    }
                });
                parser.on('error', function (err) {
                    next(err);
                });
                parser.on('finish', function () {
                    console.log('finish');
                    next();
                });
                rs.pipe(parser);
            },
                importZillowData: function (next) {
                var sheet = api.projectRoot + '/imports/' + 'Zip_Zhvi_AllHomes.csv';
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        var tosave = new api.models.ZillowData();
                        tosave.zip = record.RegionName;
                        tosave.data = record;
                        tosave.save();
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            fixTrusts:function (next) {
                var i = 0;
                var sheet = '/vagrant/db/csvs3/allstates1_test.csv';
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        i++;
                        if(!record['OWNER 1 LAST NAME'] && !record['OWNER 1 FIRST NAME'])
                        {
                            api.tasks.enqueue('processTrust',{record:record},'default');
                        }
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            fixTrust:function (record, next) {
                var that = this;
                api.models.Property.findOne({
                    "address.street1":record['PROPERTY ADDRESS'],
                    "address.zip":record['PROPERTY ZIP CODE'].toString(),
                    "address.state":record['PROPERTY STATE']
                }).exec(function (err, prop) {
                    prop.owner.primary.name.first = record['OWNER 1 LABEL NAME'];
                    prop.save();
                    next(null, prop);
                });
            },
            importPhone:function (record, next) {
                var that = this;
                api.models.Property.findOne({
                    oldId:record['lead_id']
                }).exec(function (err, prop) {
                    if(err)
                    {
                        next(err);
                    } else {
                        var ph = {
                            number:record['number'],
                            status:(record['good']==1?'Good':'Bad'),
                            createdAt:Date.now(),
                            source:'WhitePages'
                        };
                        prop.phones.push(ph);
                        prop.save();
                        next(null, true);
                    }
                });
            },
            updateScrubbedPhone:function (params, next) {
                api.models.Property.findById(params.propertyId, function (err, prop) {
                    if(err)
                    {
                        next(err);
                    } else {
                        var phones = params.phones.split(",");
                        var propPhones = prop.phones;
                        for(var i = 0; i<phones.length; i++)
                        {
                            var is_clear = true;
                           for(var q = 0; q<propPhones.length; q++)
                           {
                               if(phones[i] == propPhones[q].number)
                               {
                                   is_clear = false;
                               }
                           }
                           if(is_clear)
                           {
                               var ph = {
                                   number:phones[i],
                                   status:'Good',
                                   createdAt:Date.now(),
                                   source:'WhitePages'
                               };
                               prop.phones.push(ph);
                               prop.save();
                           }
                       }
                       next(null, prop);

                   }
                });
            },

            importLeadSheet:function (next) {
                var sheet = api.projectRoot + '/imports/' + 'test.csv';
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        api.tasks.enqueue('processSheetLead',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
                console.log('foo');
                next();
            },
            importSheetLead:function (record, next) {



                var that = this;
                var moment = require('moment');
                var z = record['PROPERTY ZIP/ZIP+4'].substring(0,5);
                var d;
                if(record['FIRST MORTGAGE DATE'])
                {
                    d = moment(record['FIRST MORTGAGE DATE'], 'M/D/YYYY');
                }
                var prev = 0;
                if(record['FIRST MORTGAGE AMOUNT'])
                {
                    prev = parseInt(parseInt(record['FIRST MORTGAGE AMOUNT'])/1.5);
                }
                var m = {
                    createdAt: Date.now(),
                    date:d,
                    assessmentYear:record['ASSESSMENT YEAR'],
                    amount:record['FIRST MORTGAGE AMOUNT'],
                    rate:record['FIRST MORTGAGE INTEREST RATE'],
                    rateType:record['FIRST MORTGAGE LOAN RATE TYPE'],
                    previousValue:prev,
                    lender:record['FIRST MORTGAGE LENDER NAME'],
                    assessedValue:record['TOTAL ASSESSED VALUE']
                }
                var s = {
                    category: 'List',
                    description: '3-2017-ME-IN'
                };

                var p = {
                    owner:{
                        primary:{
                          name:{
                                last:record['OWNER 1 LAST NAME'],
                                first:record['OWNER 1 FIRST NAME'],
                                middle:record['OWNER 1 MIDDLE NAME'],
                                suffix:record['OWNER 1 SUFFIX']
                          }
                        },
                        secondary:{
                            name:{
                                last:record['OWNER 2 LAST NAME'],
                                first:record['OWNER 2 FIRST NAME'],
                                middle:record['OWNER 2 MIDDLE NAME'],
                                suffix:record['OWNER 2 SUFFIX']
                            }
                        },
                    },
                    address:{
                        street1:record['PROPERTY ADDRESS'],
                        city:record['PROPERTY CITY'],
                        state:record['PROPERTY STATE'],
                        zip:z,
                        county:record['COUNTY']
                    },
                    mortgage:m,
                    source: s,
                    searchbug: { id: record['SEARCHBUG'] }
                };

                api.models.Property.findOne(
                    {
                        'address.street1':record['PROPERTY ADDRESS'],
                        'address.zip':z
                    },
                    function (err, prop) {
                        if(err)
                        {
                            next(err)
                        } else if(prop) {
                            prop.source = s;
                            prop.mortgages.push(m);
                            prop.mortgage = m;
                            prop.owner = p.owner;
                            prop.address = p.address;
                            prop.save(function (err, saved) {
                                if(err){next(err);} else {next(null);}
                            });

                        } else {
                            new api.models.Property(p).save(function (err, prop) {
                                if(err)
                                {
                                    next(err);
                                } else {
                                    next(null, p);
                                }
                            });
                        }
                    }
                );




            },
            users1:function(next){
                var complete = 0;
                var potential = 0;

                var fs = require('fs');
                var parse = require('csv-parse');

                rs = fs.createReadStream('/vagrant/db/csvs/users.csv');

                parser = parse({delimiter:';',columns:true});

                parser.on('readable', function(){
                    while(record = parser.read()){
                        potential++;
                        //console.log(potential);

                        var r = 'Loan Officer';

                        switch(record.role_id)
                        {
                            case 1:
                                r = 'Admin';
                                break;
                            case 2:
                                r = 'Sales Manager';
                                break;
                            case 3:
                                r= 'Team Manager';
                                break;
                            case 4:
                                r = 'Loan Officer';
                                break;
                            case 5:
                                r = 'Assistant';
                                break;
                            case 10:
                                r = 'Web Admin';
                                break;
                        }

                        var u = new api.models.User({
                            oldId:record.id,
                            email:record.email,
                            role:r,
                            name:{
                                first:record.first_name,
                                last:record.last_name
                            },
                            phones:{
                                desk:record.office_phone
                            },
                            encrypt_pwd:record.password
                        });
                        u.save(function(err){
                            complete++;
                            if(err)
                            {
                                next(new Error('Error Saving User'));
                            } else{
                                if(complete == potential)
                                {
                                    next(null, 'complete');
                                }
                            }
                        });




                    }
                });

                parser.on('error', function(err){
                    next(err);
                });

                parser.on('finish', function(){
                    console.log('finish');
                });

                rs.pipe(parser);

            },
            leads1:function(next){
                console.log('starting');
                var that = this;
                var complete = 0;
                var potential = 0;

                var fs = require('fs');
                var parse = require('csv-parse');
                var moment = require('moment');

                rs = fs.createReadStream('/vagrant/db/csvs2/leadsB.csv');

                parser = parse({delimiter:',',columns:true});
                
                parser.on('readable', function(){
                    while(record = parser.read()){

                            api.tasks.enqueue('processOldLead',{record:record},'default');
                    }
                });

                parser.on('error', function(err){
                    console.log(err);
                    next(err);
                });

                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });

                rs.pipe(parser);

            },
            singleLead:function(record, next){

                var that = this;

                var moment = require('moment');

                status = 'Lead';
                bucket = 'Leads';

                if(record.substatus_id && parseInt(record.substatus_id) > 1)
                {
                    // analyze substatus
                    switch(parseInt(record.substatus_id))
                    {
                        case 2:
                            status = 'Paper App';
                            bucket = 'Completed Apps';
                            break;
                        case 3:
                            status = 'Appraisal Ordered';
                            bucket = 'Working';
                            break;
                        case 4:
                            status = 'Booked';
                            bucket = 'Completed Apps';
                            break;
                        case 5:
                            status = 'Counseling In';
                            bucket = 'Completed Apps';
                            break;
                        case 6:
                            status = 'Docs In';
                            bucket = 'Completed Apps';
                            break;
                        case 7:
                            status = 'Docs Out';
                            bucket = 'Working';
                            break;
                        case 8:
                            status = 'Submitted to Processing';
                            bucket = 'Processing';
                            break;
                        case 9:
                            status = 'Clear to Close';
                            bucket = 'Processing';
                            break;
                        case 10:
                            status = 'Sent to Lender';
                            bucket = 'Processing';
                            break;
                        case 11:
                            status = 'Stipped';
                            bucket = 'Processing';
                            break;
                        case 12:
                            status = 'Lead';
                            bucket = 'Leads';
                            break;
                    }
                } else {
                    // analyze status

                    switch(parseInt(record.status_id))
                    {
                        case 2:
                            status = 'Paper App';
                            bucket = 'Completed Apps';
                            break;
                        case 3:
                            status = 'Submitted to Processing';
                            bucket = 'Processing';
                            break;
                        case 4:
                            status = 'Closed';
                            bucket = 'Closed';
                            break;
                    }
                }

                if(record.owner_id && bucket != "Leads")
                {
                    api.models.User.findOne({
                        'oldId':record.owner_id
                    }).exec(function(err, u) {
                        if(!err)
                        {
                            api.models.Property.findOne({
                                oldId:record.id
                            }).exec(function(err, property) {
                                if(err){next(err);}

                                else {
                                    property.status = status;
                                    property.bucket = bucket;
                                    property.pipelineOwner = u;
                                    property.save(function (err) {
                                        if(err)
                                        {
                                            next(err);
                                        } else {
                                            next(null, property._id);
                                        }
                                    });
                                }

                            });

                        } else {
                            next(err);
                        }
                    });

                } else {
                    next(null,record.id);
                }

            },
            leadsColors:function(next){
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                var moment = require('moment');
                rs = fs.createReadStream('/vagrant/db/csvs/leads_colors.csv');
                parser = parse({delimiter:';',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        if(record.color == 'none')
                        {
                            api.tasks.enqueue('processOldLeadColor',{record:record},'default');
                        }
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            singleLeadColor:function(record, next){

                /*
                var that = this;
                var moment = require('moment');
                api.models.Property.findOne({
                    oldId:record.lead_id
                }).exec(function(err, property) {
                    if(err){next(err);}
                    var owner = that.getOwner(record.user_id);
                    property.colors.push({
                        name:record.color,
                        user:owner,
                        date:api.helpers.convertUnixTimestamp(record.created)
                    });
                    property.save(function(err) {
                        if(err){next(err);} else {
                            next(null,property._id);
                        }
                    }); 
                });
                */
            },
            leadsNotes:function(next){
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                var moment = require('moment');
                rs = fs.createReadStream('/vagrant/db/csvs/leads_notes.csv');
                parser = parse({delimiter:';',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){

                            api.tasks.enqueue('processOldLeadNote',{record:record},'default');

                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            singleLeadNote:function(record, next){
                //api.log(record);
                /*
                var that = this;
                var moment = require('moment');
                api.models.Property.findOne({
                    oldId:record.lead_id
                }).exec(function(err, property) {
                    if(err){next(err);}
                    var owner = that.getOwner(record.user_id);
                    property.comments.push({
                        body:record.note,
                        user:owner,
                        date:api.helpers.convertUnixTimestamp(record.created)
                    });
                    property.save(function(err) {
                        if(err){next(err);} else {
                            next(null,property._id);
                        }
                    });
                });
                */
            },
            leadsUsers:function(next){
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream('/vagrant/db/csvs3/leads_usersC_test.csv');
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        //console.log(record);
                        api.tasks.enqueue('processLeadUser',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            singleLeadUser:function(record, next){

                var that = this;
                api.models.Property.findOne({
                    oldId:record.lead_id
                }).exec(function(err, property) {
                    if(err){next(err);}
                    else {
                        api.models.User.findOne({
                            'oldId':record.user_id
                        }).exec(function(err, u) {
                            if(!err)
                            {
                                api.models.Lead.findOne({
                                    user:u,
                                    property:property
                                }).exec(function (err, lead) {
                                    if(err)
                                    {
                                        console.log('error');
                                        next(err);
                                    } else {

                                        if(lead._id)
                                        {
                                             var lead = api.models.Lead({
                                             user:u,
                                             property:property
                                             });

                                             lead.save();

                                            next(null, lead);
                                        } else {
                                            console.log('NOT');
                                            next(null, 'saved');
                                        }
                                    }
                                });

                            } else {
                                throw err;
                            }
                        });
                    }
                });

            },
            leadsOwners:function(next){
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream('/vagrant/db/csvs3/leadsD.csv');
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        api.tasks.enqueue('processLeadOwner',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            singleLeadOwner:function(record, next){

                var that = this;
                api.models.Property.findOne({
                    oldId:record.id
                }).exec(function(err, property) {
                    if(err){next(err);}
                    else {

                        if(record.owner_id)
                        {

                            if([19,11].indexOf(parseInt(record.owner_id)) < 0) {

                                api.models.User.findOne({
                                    'oldId':record.owner_id
                                }).exec(function(err, u) {
                                    if(!err)
                                    {
                                        property.pipelineOwner = u;
                                        var status = null;
                                        var bucket = null;
                                        var sub = parseInt(record.substatus_id);
                                        var stat = parseInt(record.status_id);
                                        if(stat && stat > 1)
                                        {
                                            if(sub && sub > 1)
                                            {
                                                switch(sub)
                                                {
                                                    case 2:
                                                        status = 'Paper App';
                                                        bucket = 'Completed Apps';
                                                        break;
                                                    case 3:
                                                        status = 'Appraisal Ordered';
                                                        bucket = 'Working';
                                                        break;
                                                    case 4:
                                                        status = 'Booked';
                                                        bucket = 'Completed Apps';
                                                        break;
                                                    case 5:
                                                        status = 'Counseling In';
                                                        bucket = 'Completed Apps';
                                                        break;
                                                    case 6:
                                                        status = 'Docs In';
                                                        bucket = 'Completed Apps';
                                                        break;
                                                    case 7:
                                                        status = 'Docs Out';
                                                        bucket = 'Working';
                                                        break;
                                                    case 8:
                                                        status = 'Submitted to Processing';
                                                        bucket = 'Processing';
                                                        break;
                                                    case 9:
                                                        status = 'Clear to Close';
                                                        bucket = 'Processing';
                                                        break;
                                                    case 10:
                                                        status = 'Sent to Lender';
                                                        bucket = 'Processing';
                                                        break;
                                                    case 11:
                                                        status = 'Stipped';
                                                        bucket = 'Processing';
                                                        break;
                                                    case 12:
                                                        status = 'Lead';
                                                        bucket = 'Leads';
                                                        break;
                                                }
                                            } else {
                                                // analyze status
    
                                                switch(stat)
                                                {
                                                    case 2:
                                                        status = 'Paper App';
                                                        bucket = 'Completed Apps';
                                                        break;
                                                    case 3:
                                                        status = 'Submitted to Processing';
                                                        bucket = 'Processing';
                                                        break;
                                                    case 4:
                                                        status = 'Closed';
                                                        bucket = 'Closed';
                                                        break;
                                                }
                                            }
                                        }
                                        if(status)
                                        {
                                            console.log('changing statuses');
                                            console.log(bucket);
                                            console.log(status);
                                            property.status = status;
                                            property.bucket = bucket;
                                        }
                                        property.save();

                                        next(null, true);
                                    } else {
                                        next(err);
                                    }
                                });

                            }


                        } else {
                            next();
                        }


                    }
                });
            },
            zips:function(next){
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream('/vagrant/db/csvs/zip_code_database.csv');
                parser = parse({columns:true});
                var i = 0;
                parser.on('readable', function(){
                    while(record = parser.read()){
                        i++;
                        var zip = api.models.Zip(record);
                        zip.save(function(err) {
                           if(err)
                           {
                               throw err;
                           } else {
                               console.log(i);
                           }
                        });
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },
            fixOwners:function(next) {

                var stream =  api.models.Property.find().stream();
                stream.on('data',function(item) {
                    if(item.owners.length)
                    {
                        item.owner.primary = item.owners[0];
                        item.save();
                    }

                });
                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                   next(null,'fooey');
                });

            },
            fixMortgages:function(next) {

                var stream =  api.models.Property.find().stream();
                stream.on('data',function(item) {
                    if(item.mortgages.length)
                    {
                        item.mortgage = item.mortgages[0];
                    }
                    if(item.mortgageValues.length)
                    {
                        item.mortgageValue = item.mortgageValues[0];
                    }
                    item.save();

                });

                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'fooey');
                });

            },
            fixUsersLeads:function (next) {
                api.models.Lead.aggregate(
                    [
                        {
                            $group: {
                                "_id":"$user",
                                "properties":{$addToSet:"$property"}
                            }
                        }
                    ]
                );

            },
            crowleyPhones:function (next) {
                var moment = require('moment');
                api.models.Property.findById('56f847b5943b43b80645cb73', function (err, p) {
                    if(err){next(err);} else {
                        p.phones.push({
                            "number" : "302-429-1823",
                            "status" : "Good",
                            "source" : "Internal",
                            "createdAt" : moment("2015-12-01", "YYYY-MM-DD")
                        });
                        p.phones.push({
                            "number" : "302-428-1823",
                            "status" : "Bad",
                            "source" : "WhitePages",
                            "createdAt" : moment("2015-02-01","YYYY-MM-DD"),
                            "updated" : moment("2015-02-09","YYYY-MM-DD"),
                            "updatedBy" : "Tester Name"
                        });
                        p.phones.push({
                            "number" : "555-111-1212",
                            "status" : "Good",
                            "source" : "WhitePages",
                            "createdAt" : moment("2015-11-01","YYYY-MM-DD")
                        });
                        p.save();
                        next();
                    }
                })
            },
            zpidLink:function (next) {
                var stream = api.models.Property.find({ "mortgageValue.zpid": { $exists: true, $ne: "" } }).stream();
                stream.on('data', function (prop) {
                    prop.mortgageValue.link = 'http://www.zillow.com/homedetails/'+prop.mortgageValue.zpid+'_zpid/';
                    if(prop.mortgageValues.length)
                    {
                        prop.mortgageValues[0].link = 'http://www.zillow.com/homedetails/'+prop.mortgageValue.zpid+'_zpid/';
                    }
                    prop.save();
                });
                stream.on('error', function (err) {
                    next(err);
                })

                stream.on('close', function () {
                   next(null,true);
                })
            },
            getOwner:function(owner_id) {
                if(!owner_id)
                {
                    return null;
                } else {
                    api.models.User.findOne({
                        'oldId':owner_id
                    }).exec(function(err, u) {
                        if(!err)
                        {
                            return u;
                        } else {
                            throw err;
                        }
                    });
                }
                
            },

            moveScrubbedValues:function (next) {
                var i = 0;
                var sheet = '/vagrant/documents/transfer_test.csv';
                var that = this;
                var fs = require('fs');
                var parse = require('csv-parse');
                rs = fs.createReadStream(sheet);
                parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        api.tasks.enqueue('processScrubbedValue',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    console.log('finish');
                    next(null,'done');
                });
                rs.pipe(parser);
            },

            addLeadsToUserQueue: function (params, next) {
                if(params.properties.length <= 0)
                {
                    next();
                    return;
                }
                properties.map(function (p) {
                    api.models.Property.findOne({
                        oldId:p
                    }).exec(function (err, prop) {
                        if(err)
                        {
                            next(); return;
                        }
                        var l = new api.models.Lead();
                        l.user = params.user._id;
                        l.property = prop._id;
                        l.save(function (err, lead) {
                            if(err)
                            {
                                next();
                            } else {
                                next(null, lead);
                            }
                        })
                    });
                });
            },

            importClosedLoans: function (next) {
                var sheet = api.projectRoot + '/imports/' + 'closedtest.csv';
                var fs = require('fs');
                var parse = require('csv-parse');
                var rs = fs.createReadStream(sheet);
                var parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        api.tasks.enqueue('processClosedRow',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    api.log('finish', 'notice');
                    next(null,'done');
                });
                rs.pipe(parser);
            },

            saveClosedRow:function (record, next) {

                var moment = require('moment');

                var street = record['address'].split(' ');
                street.pop();
                street = (street.join(' ')).trim();
                var state = record['state'];
                var city = record['city'].toLowerCase();
                city = (city.charAt(0).toUpperCase() + city.slice(1)).trim();
                var zip = record['zip'].trim();
                var exp = street+'.*';
                var re = new RegExp(exp, "i");
                api.models.Property.findOne({
                    "address.street1": {$regex: re},
                    "address.zip": zip,
                    "address.city": city
                }, function (err, prop) {
                    if(err) return next(err);
                    if(!prop) return next(null, 'no found');
                    var closing = moment(record['closing'], 'M/D/YYYY').toDate();
                    var val = api.helpers.stripTextToNum(record['value']).toFixed(2);
                    var principal = api.helpers.stripTextToNum(record['principal']).toFixed(2);
                    var upb = api.helpers.stripTextToNum(record['upb']).toFixed(2);
                    var rate = api.helpers.stripTextToNum(record['rate']).toFixed(2);
                    var margin = api.helpers.stripTextToNum(record['margin']).toFixed(2);
                    var lo = record['lo'];
                    var mortgage = {
                        date: closing,
                        userName: lo,
                        rate: rate,
                        rateType: 'Adjustable',
                        previousValue: val,
                        lender: 'NWE Corp',
                        margin: margin,
                        upb: upb,
                        amount: upb,
                        principalLimit: principal,
                        casenum: record['casenum'],
                        createdAt: Date.now()
                    };

                    var old = Object.assign({}, prop.mortgage);
                    Object.assign(prop.mortgage, mortgage);
                    prop.mortgages.push(old);

                    var eq = parseInt(prop.mortgageValue.value - prop.mortgage.previousValue);
                    var perc = (prop.mortgageValue.value/prop.mortgage.previousValue*100).toFixed(2);
                    prop.currentEquity = eq;
                    prop.currentEquityPercent = perc;

                    prop.save(function (err,p) {
                        if(err) return next(err);
                        next(null, 'SAVED *******************');
                    });
                })
            },

            importSearchBugBatch: function (next) {
                var sheet = api.projectRoot + '/imports/' + 'searchbug1.csv';
                var fs = require('fs');
                var parse = require('csv-parse');
                var rs = fs.createReadStream(sheet);
                var parser = parse({delimiter:',',columns:true});
                parser.on('readable', function(){
                    while(record = parser.read()){
                        api.tasks.enqueue('processSearchBugRow',{record:record},'default');
                    }
                });
                parser.on('error', function(err){
                    next(err);
                });
                parser.on('finish', function(){
                    api.log('finish', 'notice');
                    next(null,'done');
                });
                rs.pipe(parser);
            },

            saveSearchBugRow:function (record, next) {
                api.log('RECORD', 'notice', record);
                api.models.Property.findOne({
                    "searchbug.id": record['SEARCHBUG']
                }, function (err, prop) {
                    if(err) return next(err);
                    if(!prop) return next(null, 'no found');
                    var s = false;
                    for(var i = 1; i<=5; i++) {
                        var key = 'Phone'+i;
                        if(record[key])
                        {
                            s = true;
                            var num = api.helpers.formatPhone(record[key]);
                            var curr = prop.phones.find(function (phone) {
                                return phone.number == num;
                            });
                            var stat = 'Good';
                            if(curr)
                            {
                                stat = curr.status;
                            }
                            prop.phones.push({
                                number: num,
                                createdAt: Date.now(),
                                status: stat,
                                userName: 'System Batch',
                                source: 'SearchBug'
                            });
                        }
                    }

                    if(s) {

                        prop.save(function (err,p) {
                            if(err) return next(err);
                            next(null, 'SAVED *******************');
                        });
                    } else {
                        next(null, 'NO SAVE =====================');
                    }

                })
            }
        };
        next();
    }
};