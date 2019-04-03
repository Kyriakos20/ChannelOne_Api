exports.fixSValues = {
    name: "fixSValues",
    description: "fixSValues",
    autosession: false,
    run: function(api, data, next){
        api.migrations.fixSValues(function(err, res){
            if(err) return next(err);
            data.response.status = res;
            next();
        });
    }
};

exports.addTelePhones = {
    name: "addTelePhones",
    description: "addTelePhones",
    autosession: false,
    run: function(api, data, next){
        api.migrations.addTelePhones(function(err, res){
            if(err) return next(err);
            data.response.status = res;
            next();
        });
    }
};

exports.importSearchBugBatch = {
    name:"importSearchBugBatch",
    description:"importSearchBugBatch",
    autosession:false,
    run:function(api, data, next){

        api.migrations.importSearchBugBatch(function(err, result){
            if(err) return next(err);
            next(null, result);
        });
    }
};

exports.importClosedLoans = {
    name:"importClosedLoans",
    description:"importClosedLoans",
    autosession:false,
    run:function(api, data, next){

        api.migrations.importClosedLoans(function(err, result){
            if(err) return next(err);
            next(null, result);
        });
    }
};

exports.fixInfoUSAPhones = {
    name:"fixInfoUSAPhones",
    description:"fixInfoUSAPhones",
    autosession:false,
    run:function(api, data, next){


        api.migrations.fixInfoUSAPhones(function(err, result){
            next();
        });
    }
};

exports.fixTrusts = {
    name:"fixTrusts",
    description:"fixTrusts",
    autosession:false,
    run:function(api, data, next){


        api.migrations.fixTrusts(function(err, result){
           next();
        });
    }
};

exports.removeOldWorkers = {
    name:"removeOldWorkers",
    description:"removeOldWorkers",
    autosession:false,
    run:function(api, data, next){


        api.tasks.cleanOldWorkers(10000, function(err, result){
            console.log('foo');
            if(err){
                console.log(err);
                next(err);
            } else {
                console.log(result);
                next(result);
            }
        });

        /*
        api.tasks.failedCount(function (err, count) {
            data.response.count = count;

            next();
        });
        */
    }
};

exports.crowleyPhones = {
    name: 'crowleyPhones',
    description: 'crowleyPhones',
    autosession: false,

    run: function(api, data, next){

        api.migrations.crowleyPhones(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fixCounties = {
    name: 'fixCounties',
    description: 'fixCounties',
    autosession: false,
    run: function(api, data, next){

        api.migrations.fixCounties(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fakeAllValues = {
    name: 'fakeAllValues',
    description: 'fakeAllValues',
    autosession: false,
    run: function(api, data, next){
        api.migrations.fakeAllValues(function (error, output) {
            data.response.output = 'closed';
            next();
        });
    }
};


exports.startFakeValues = {
    name: 'startFakeValues',
    description: 'startFakeValues',
    autosession: false,
    run: function(api, data, next){
        api.migrations.startFakeValues(function (error, output) {
            data.response.count = output;
            next();
        });
    }
};

exports.zpidLink = {
    //db.properties.find({ "mortgageValue.zpid": { $exists: true, $ne: "" } }, {"mortgageValue.zpid": 1})
    name: 'zpidLink',
    description: 'zpidLink',
    autosession: false,

    run: function(api, data, next){

        api.migrations.zpidLink(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.migrateLeads1 = {
    name: 'migrateLeads1',
    description: 'migrateLeads1',
    autosession: false,

    run: function(api, data, next){
        
        api.migrations.leads1(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.migrateLeadsColors = {
    name: 'migrateLeadsColors',
    description: 'migrateLeadsColors',
    autosession: false,

    run: function(api, data, next){

        api.migrations.leadsColors(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.migrateLeadsNotes = {
    name: 'migrateLeadsNotes',
    description: 'migrateLeadsNotes',
    autosession: false,

    run: function(api, data, next){

        api.migrations.leadsNotes(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fillInValues = {
    name: 'fillInValues',
    description: 'fillInValues',
    autosession: false,

    run: function(api, data, next){

        api.migrations.fillInValues(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.migrateLeadsUsers = {
    name: 'migrateLeadsUsers',
    description: 'migrateLeadsUsers',
    autosession: false,

    run: function(api, data, next){

        api.migrations.leadsUsers(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};


exports.migrateLeadsOwners = {
    name: 'migrateLeadsOwners',
    description: 'migrateLeadsOwners',
    autosession: false,

    run: function(api, data, next){

        api.migrations.leadsOwners(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.migrateUsers1 = {
    name: 'migrateUsers1',
    description: 'migrateUsers1',
    autosession: false,

    run: function(api, data, next){

        api.migrations.users1(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.migrateZips = {
    name: 'migrateZips',
    description: 'migrateZips',
    autosession: false,

    run: function(api, data, next){

        api.migrations.zips(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fixOwners = {
    name: 'fixOwners',
    description: 'fixOwners',
    autosession: false,

    run: function(api, data, next){

        api.migrations.fixOwners(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fixMortgages = {
    name: 'fixMortgages',
    description: 'fixMortgages',
    autosession: false,

    run: function(api, data, next){

        api.migrations.fixMortgages(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fixUsersLeads = {
    name: 'fixUsersLeads',
    description: 'fixUsersLeads',
    autosession: false,

    run: function(api, data, next){

        api.migrations.fixUsersLeads(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.importLeadSheet = {
    name: 'importLeadSheet',
    description: 'importLeadSheet',
    autosession: false,

    run: function(api, data, next){

        api.migrations.importLeadSheet(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.importPhones = {
    name: 'importPhones',
    description: 'importPhones',
    autosession: false,

    run: function(api, data, next){

        api.migrations.importPhones(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.importZillowData = {
    name: 'importZillowData',
    description: 'importZillowData',
    autosession: false,

    run: function(api, data, next){

        api.migrations.importZillowData(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fixOldIds = {
    name: 'fixOldIds',
    description: 'fixOldIds',
    autosession: false,

    run: function(api, data, next){

        api.migrations.fixOldIds(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.createBlankLead = {
    name: 'createBlankLead',
    description: 'createBlankLead',
    autosession: false,

    run: function(api, data, next){

        api.migrations.createBlankLead(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.fixEquity = {
    name: 'fixEquity',
    description: 'fixEquity',
    autosession: false,

    run: function(api, data, next){

        api.migrations.fixEquity(function (error, output) {
            data.response.records = output;
            next();
        });
    }
};

exports.moveScrubbedValues = {
    name: 'moveScrubbedValues',
    description: 'moveScrubbedValues',
    autosession: false,

    run: function(api, data, next){

        api.migrations.moveScrubbedValues(function (error, output) {
            data.response = output;
            next();
        });
    }
};

exports.addLeadsToUserQueue = {
    name: 'addLeadsToUserQueue',
    description: 'addLeadsToUserQueue',
    autosession: false,
    inputs: {
        user:{
            required:true
        },
        properties:{
            required:true
        }
    },

    run: function(api, data, next){

        api.migrations.addLeadsToUserQueue(data.params, function (error, output) {
            data.response = output;
            next();
        });
    }
};

exports.importDestinyLeads = {
    name: 'importDestinyLeads',
    description: 'importDestinyLeads',
    autosession: false,

    run: function(api, data, next){

        api.migrations.importDestinyLeads(function (error, output) {
            data.response = output;
            next();
        });
    }
};
