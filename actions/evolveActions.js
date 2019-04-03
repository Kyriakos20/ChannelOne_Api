exports.evolveDialPhone = {
    name: 'evolveDialPhone',
    description: 'evolveDialPhone',
    inputs: {
        number:{
            required:true
        },
        user_id:{
            required:true
        }
    },

    run: function(api, data, next){
        api.evolve.dialPhone(data.params, function(error, result) {
            if(error)
            {
                next(error);
            } else {
                data.response.status = true;
                next();
            }
        });
    }
};

exports.evolveCall = {
    name: 'evolveCall',
    description: 'evolveCall',
    autosession:false,
    inputs: {
        xml:{
            required:true
        }
    },

    run: function(api, data, next){
        api.evolve.call(data.params.xml, function(error, result) {
            if(error)
            {
                next(error);
            } else {
                data.response.status = true;
                next();
            }
        });
    }
};

exports.testCall = {
    name: 'testCall',
    description: 'testCall',
    autosession:false,

    run: function(api, data, next){
        //var xml = {"xsi:Event":{"$":{"xsi1:type":"xsi:SubscriptionEvent","xmlns:xsi":"http://schema.broadsoft.com/xsi","xmlns:xsi1":"http://www.w3.org/2001/XMLSchema-instance"},"xsi:eventID":["ca8a234e-fb0e-4ac5-8148-f938ae21c3e7"],"xsi:sequenceNumber":["3"],"xsi:userId":["ga-0001010097@voip.evolveip.net"],"xsi:externalApplicationId":["DevelopDC-NetEquity"],"xsi:subscriptionId":["9934e180-abf3-46e6-9d09-936525600895"],"xsi:httpContact":[{"xsi:uri":["http://evolve.developdc.net/event.php"]}],"xsi:targetId":["4437259925@voip.evolveip.net"],"xsi:eventData":[{"$":{"xsi1:type":"xsi:CallOriginatedEvent"},"xsi:call":[{"xsi:callId":["callhalf-5489974461:0"],"xsi:extTrackingId":["5701687:1"],"xsi:networkCallId":["BW154444841241115-474918272@10.128.0.101"],"xsi:personality":["Originator"],"xsi:state":["Released"],"xsi:releasingParty":["localRelease"],"xsi:remoteParty":[{"xsi:address":["tel:5104895264"],"xsi:name":["Big Dave"],"xsi:callType":["Network"]}],"xsi:startTime":["1448397884828"],"xsi:releaseTime":["1448397912040"]}]}]}};
        var xml = {"xsi:Event":{"$":{"xsi1:type":"xsi:SubscriptionEvent","xmlns:xsi":"http://schema.broadsoft.com/xsi","xmlns:xsi1":"http://www.w3.org/2001/XMLSchema-instance"},"xsi:eventID":["ca8a234e-fb0e-4ac5-8148-f938ae21c3e7"],"xsi:sequenceNumber":["3"],"xsi:userId":["ga-0001010097@voip.evolveip.net"],"xsi:externalApplicationId":["DevelopDC-NetEquity"],"xsi:subscriptionId":["9934e180-abf3-46e6-9d09-936525600895"],"xsi:httpContact":[{"xsi:uri":["http://evolve.developdc.net/event.php"]}],"xsi:targetId":["4437259925@voip.evolveip.net"],"xsi:eventData":[{"$":{"xsi1:type":"xsi:CallReleasedEvent"},"xsi:call":[{"xsi:callId":["callhalf-5489974461:0"],"xsi:extTrackingId":["5701687:1"],"xsi:networkCallId":["BW154444841241115-474918272@10.128.0.101"],"xsi:personality":["Originator"],"xsi:state":["Released"],"xsi:releasingParty":["localRelease"],"xsi:remoteParty":[{"xsi:address":["tel:5104895264"],"xsi:name":["Big Dave"],"xsi:callType":["Network"]}],"xsi:startTime":["1470871633818"],"xsi:releaseTime":["1448397912040"]}]}]}};
        api.evolve.processCall(xml, function (error, results) {
            if(error)
            {
                next(error);
                return;
            }
            data.response = results;
            next(null, results);
        });

    }
};

exports.testCallMail = {
    name: 'testCallMail',
    description: 'testCallMail',
    autosession:false,

    run: function(api, data, next){
        //var xml = {"xsi:Event":{"$":{"xsi1:type":"xsi:SubscriptionEvent","xmlns:xsi":"http://schema.broadsoft.com/xsi","xmlns:xsi1":"http://www.w3.org/2001/XMLSchema-instance"},"xsi:eventID":["ca8a234e-fb0e-4ac5-8148-f938ae21c3e7"],"xsi:sequenceNumber":["3"],"xsi:userId":["ga-0001010097@voip.evolveip.net"],"xsi:externalApplicationId":["DevelopDC-NetEquity"],"xsi:subscriptionId":["9934e180-abf3-46e6-9d09-936525600895"],"xsi:httpContact":[{"xsi:uri":["http://evolve.developdc.net/event.php"]}],"xsi:targetId":["4437259925@voip.evolveip.net"],"xsi:eventData":[{"$":{"xsi1:type":"xsi:CallOriginatedEvent"},"xsi:call":[{"xsi:callId":["callhalf-5489974461:0"],"xsi:extTrackingId":["5701687:1"],"xsi:networkCallId":["BW154444841241115-474918272@10.128.0.101"],"xsi:personality":["Originator"],"xsi:state":["Released"],"xsi:releasingParty":["localRelease"],"xsi:remoteParty":[{"xsi:address":["tel:5104895264"],"xsi:name":["Big Dave"],"xsi:callType":["Network"]}],"xsi:startTime":["1448397884828"],"xsi:releaseTime":["1448397912040"]}]}]}};
        var xml = {"xsi:Event":{"$":{"xsi1:type":"xsi:SubscriptionEvent","xmlns:xsi":"http://schema.broadsoft.com/xsi","xmlns:xsi1":"http://www.w3.org/2001/XMLSchema-instance"},"xsi:eventID":["ca8a234e-fb0e-4ac5-8148-f938ae21c3e7"],"xsi:sequenceNumber":["3"],"xsi:userId":["ga-0001010097@voip.evolveip.net"],"xsi:externalApplicationId":["DevelopDC-NetEquity"],"xsi:subscriptionId":["9934e180-abf3-46e6-9d09-936525600895"],"xsi:httpContact":[{"xsi:uri":["http://evolve.developdc.net/event.php"]}],"xsi:targetId":["4437259925@voip.evolveip.net"],"xsi:eventData":[{"$":{"xsi1:type":"xsi:SubscriptionTerminatedEvent"},"xsi:call":[{"xsi:callId":["callhalf-5489974461:0"],"xsi:extTrackingId":["5701687:1"],"xsi:networkCallId":["BW154444841241115-474918272@10.128.0.101"],"xsi:personality":["Originator"],"xsi:state":["Released"],"xsi:releasingParty":["localRelease"],"xsi:remoteParty":[{"xsi:address":["tel:5104895264"],"xsi:name":["Big Dave"],"xsi:callType":["Network"]}],"xsi:startTime":["1470871633818"],"xsi:releaseTime":["1448397912040"]}]}]}};
        api.evolve.processCall(xml, function (error, results) {
            if(error)
            {
                next(error);
                return;
            }
            next(null, results);
        });

    }
};

exports.testMail = {
    name: 'testMail',
    description: 'testMail',
    autosession: false,
    run:function (api, data, next) {
        var Mailgun = require('mailgun-js');
        var mg_api_key = 'key-bc793d3d65ca17b820076490dfb07210';
        var mg_domain = 'mg.a4amazing.com';
        var mg = new Mailgun({apiKey:mg_api_key, domain:mg_domain});
        var mgData = {
            from:'channelone@mg.a4amazing.com',
            to: 'david@a4amazing.com',
            subject: 'C1 Call Subscription Terminated',
            text: 'Call Subscription was terminated'
        };
        mg.messages().send(mgData, function (err, body) {
            //If there is an error, render the error page
            if (err) {
                next(err, null);
            }
            //Else we can greet    and leave
            else {
                next(null, body);
            }
        });
    }
};

exports.testCenter = {
    name: 'testCenter',
    description: 'testCenter',
    autosession:false,

    run: function(api, data, next){
        var xml = {"xsi:Event":{"$":{"xmlns:xsi":"http://schema.broadsoft.com/xsi","xmlns:xsi1":"http://www.w3.org/2001/XMLSchema-instance","xsi1:type":"xsi:SubscriptionEvent"},"xsi:eventID":["632030e3-b2c4-4d49-b866-8e2adb0ee87f"],"xsi:sequenceNumber":["2"],"xsi:userId":["asouth@mtlasdev87.net@mtlasdev87.net"],"xsi:externalApplicationId":["com.broadsoft.remoteapp.routepoint.sg"],"xsi:subscriptionId":["209389b3-f4f7-44b8-a662-209959cd8bb7"],"xsi:channelId":["a61750ee-3bb3-4330-aaa5-4497322a8a35"],"xsi:targetId":["4437253547@voip.evolveip.net"],"xsi:eventData":[{"$":{"xsi1:type":"xsi:AgentStateEvent"},"xsi:agentStateInfo":[{"xsi:state":["Unavailable"],"xsi:stateTimestamp":[{"xsi:value":["1471291373547"],"xsi:severity":["1"],"xsi:prevSeverity":["0"],"xsi:threshold":["600"]}],"xsi:signInTimestamp":["1292361232195"],"xsi:totalAvailableTime":["10"],"xsi:averageWrapUpTime":[{"xsi:value":["0"],"xsi:severity":["0"]}]}]}]}};
        api.evolve.processCenter(xml, function (error, results) {
            data.response = results;
            next(error, results);
        });

    }
};



exports.evolveCenter = {
    name: 'evolveCenter',
    description: 'evolveCenter',
    autosession:false,
    inputs: {
        xml:{
            required:true
        }
    },

    run: function(api, data, next){
        api.evolve.center(data.params.xml, function(error, result) {
            if(error)
            {
                next(error);
            } else {
                data.response.status = true;
                next();
            }
        });
    }
};
