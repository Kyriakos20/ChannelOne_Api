var Mailgun = require('mailgun-js');
var mg_api_key = 'key-bc793d3d65ca17b820076490dfb07210';
var mg_domain = 'mg.a4amazing.com';
var moment = require('moment');

module.exports = {
    initialize:function(api, next){
        api.evolve = {
            username:'ga-0001010097@voip.evolveip.net',
            password:'$79vn337t7qH6Q^Q6Hq7t723nv97$',
            url:'https://ews2.voip.evolveip.net',
            cleanPhone:function (number) {
                return number.replace(/-|\.|_/g,'');
            },
            dialPhone:function(params, next){
                var that = this;
                var number = parseInt(that.cleanPhone(params.number));
                var userNum = parseInt('1'+that.cleanPhone(params.user_id));
                var request = require('request');
                var fullurl =that.url+"/com.broadsoft.xsi-actions/v2.0/user/"+userNum+"/calls/new?address="+number;
                //console.log(fullurl);
                request.post({
                    url:fullurl,
                    auth:{
                        username:that.username,
                        password:that.password
                    }
                }, function (err, resp, body) {
                    //console.log(body);
                    next(err, body);
                });
            },
            call:function (xml, next) {
                xml2js = require('xml2js');
                xml2js.parseString(xml, function (err, results) {
                    if(err)
                    {
                        next(err);
                    } else {
                        api.tasks.enqueue('processEvolveCall',{xml:results}, 'evolvecall');
                        next(null, true);
                    }
                })
            },
            processCall:function (xml, next) {

                var params = {};
                var keepers = ['xsi:CallOriginatedEvent', 'xsi:CallReceivedEvent', 'xsi:CallAnsweredEvent', 'xsi:CallReleasedEvent', 'xsi:SubscriptionTerminatedEvent'];
                var type = xml['xsi:Event']['xsi:eventData'][0]['$']['xsi1:type'];
                if(!type || keepers.indexOf(type) < 0)
                {
                    next(null, 'Ignore: '+type);
                    return;
                }
                if(type == 'xsi:SubscriptionTerminatedEvent')
                {
                    var mg = new Mailgun({
                        apiKey:mg_api_key,
                        domain:mg_domain
                    });
                    var mgData = {
                        from:'channelone@' + mg_domain,
                        to: 'david@a4amazing.com',
                        subject: 'C1 Call Subscription Terminated',
                        html: 'Call Subscription was terminated at ' + moment().format('MMMM Do YYYY, h:mm:ss a')
                    };
                    mg.messages().send(mgData, function (err, body) {
                        //If there is an error, render the error page
                        if (err) {


                        }
                        //Else we can greet    and leave
                        else {

                        }

                    });
                    return next(null, 'Call Subscription Terminated');
                }

                var targetId = xml['xsi:Event']['xsi:targetId'][0];
                var phone = api.helpers.formatPhone(targetId.substring(0, targetId.indexOf('@')));
                api.models.User.findOne({"phones.desk":phone.toString()}).exec(function (err, results) {
                    if(err || !results)
                    {
                        next(null, 'User not found');
                        return;
                    }
                    var user = results;
                    params.user = user._id;
                    params.userPhone = phone;
                    var trackingId = xml['xsi:Event']['xsi:eventData'][0]['xsi:call'][0]['xsi:extTrackingId'][0];
                    params.trackingId = trackingId;
                    switch (type)
                    {
                        case 'xsi:CallOriginatedEvent':
                            params.startTime = api.helpers.convertUnixTimestamp(parseInt(xml['xsi:Event']['xsi:eventData'][0]['xsi:call'][0]['xsi:startTime'][0])/1000);
                            params.direction = 'Outbound';
                            break;
                        case 'xsi:CallReceivedEvent':
                            params.startTime = api.helpers.convertUnixTimestamp(parseInt(xml['xsi:Event']['xsi:eventData'][0]['xsi:call'][0]['xsi:startTime'][0])/1000);
                            params.direction = 'Inbound';
                            break;
                        case 'xsi:CallAnsweredEvent':
                            params.answerTime = api.helpers.convertUnixTimestamp(parseInt(xml['xsi:Event']['xsi:eventData'][0]['xsi:call'][0]['xsi:answerTime'][0])/1000);
                            break;
                        case 'xsi:CallReleasedEvent':
                            params.endTime = api.helpers.convertUnixTimestamp(parseInt(xml['xsi:Event']['xsi:eventData'][0]['xsi:call'][0]['xsi:releaseTime'][0])/1000);
                            break;
                    }

                    if(type == 'xsi:CallReceivedEvent' || type == 'xsi:CallOriginatedEvent')
                    {
                        var remoteParty = xml['xsi:Event']['xsi:eventData'][0]['xsi:call'][0]['xsi:remoteParty'][0];
                        if(remoteParty['xsi:address'])
                        {
                            var num = null;
                            if(remoteParty['xsi:address'][0]['_'])
                            {
                                num = remoteParty['xsi:address'][0]['_'];
                            } else {
                                num = remoteParty['xsi:address'][0];
                            }
                            params.clientNumber = api.helpers.formatPhone(num.substr(-10,10));
                        }
                        if(remoteParty['xsi:name'])
                        {
                            params.clientName = remoteParty['xsi:name'][0];
                        }
                    }

                    api.models.EvolveCall.findOneAndUpdate({
                        trackingId: params.trackingId
                    }, params, {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        runValidators: true
                    }, function (err, res) {
                        if(err)
                        {
                            next(err);
                            return;
                        }
                        next(null, true);
                    });

                });

            },
            center:function (xml, next) {
                xml2js = require('xml2js');
                xml2js.parseString(xml, function (err, results) {
                    if(err)
                    {
                        next(err);
                    } else {
                        api.tasks.enqueue('processEvolveCenter',{xml:results}, 'evolvecenter');
                        next(null, true);
                    }
                })
            },
            processCenter:function (xml, next) {
             
                var moment = require('moment');
                var type = xml['xsi:Event']['xsi:eventData'][0]['$']['xsi1:type'];
                if(type != 'xsi:AgentStateEvent')
                {
                    next(null, 'Ignore: '+type);
                    return;
                }
                var targetId = xml['xsi:Event']['xsi:targetId'][0];
                var phone = api.helpers.formatPhone(targetId.substring(0, targetId.indexOf('@')));
                api.models.User.findOne({
                    "phones.desk":phone.toString()
                }).exec(function (err, resp) {
                    if(err || !resp)
                    {
                        next(null, 'No Phone'); return;
                    }
                    var user = resp;
                    var state = xml['xsi:Event']['xsi:eventData'][0]['xsi:agentStateInfo'][0]['xsi:state'][0];
                    var stateTime = api.helpers.convertUnixTimestamp(parseInt(xml['xsi:Event']['xsi:eventData'][0]['xsi:agentStateInfo'][0]['xsi:stateTimestamp'][0]['xsi:value'][0])/1000);
                    var totalTime = xml['xsi:Event']['xsi:eventData'][0]['xsi:agentStateInfo'][0]['xsi:totalAvailableTime'][0];
                    var params = {
                        user:user._id,
                        userPhone:phone,
                        state:state,
                        stateTime:stateTime,
                        totalTime:totalTime
                    };
                    console.log(params);
                    api.models.EvolveCenter.create(params, function (err, result) {
                        if(err)
                        {
                            next(null, 'Could not save Center');
                            return;
                        }
                        next(null, result);
                    });
                });
            }
        };
        next();
    }
};
