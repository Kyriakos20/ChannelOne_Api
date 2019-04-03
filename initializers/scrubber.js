module.exports = {
    initialize:function(api, next){
        api.scrubber = {
            config      : {
                zillowApi: {
                    max: 900
                },
                proxy: {
                    servers: [
                        {foo: 'bar'},
                        {key: 'X1-ZWz1fcuvbl39qj_3if65', url: 'ec2-54-89-206-114.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19nnlmujnrf_3jtqm', url: 'ec2-54-210-39-139.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fcurdiv5sb_3fm17', url: 'ec2-107-23-173-189.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19nnhosbjt7_3mmvk', url: 'ec2-52-91-60-164.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fcv37pjhmz_3o1g1', url: 'ec2-54-165-118-160.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19nndqq3fuz_3pg0i', url: 'ec2-54-174-181-72.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19nntiyzvnv_3e7gq', url: 'ec2-54-208-77-47.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fcuz9nbdor_3l8b3', url: 'ec2-54-174-101-93.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhqswsneh7_8w9nb', url: 'ec2-54-210-166-88.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19irrzp7myz_8uv2u', url: 'ec2-54-172-31-206.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhqoyqfaiz_8tgid', url: 'ec2-54-88-218-20.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19irvxrfqx7_8s1xw', url: 'ec2-34-227-114-188.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhql0o76kr_8qndf', url: 'ec2-34-226-136-200.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19irzvtnuvf_8p8sy', url: 'ec2-184-72-97-251.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhq96hiuq3_8i7yl', url: 'ec2-34-201-60-156.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhqd4jqyob_8l13j', url: 'ec2-54-172-194-15.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19is3tvvytn_8mfo0', url: 'ec2-54-221-120-205.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhqh2lz2mj_8nu8h', url: 'ec2-34-227-163-82.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhs0bh4lxn_9r65p', url: 'ec2-54-152-220-213.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19iqgmyibkb_9skq6', url: 'ec2-52-91-35-35.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhs49jcpvv_9tzan', url: 'ec2-54-175-244-30.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19iqcowa7m3_9vdv4', url: 'ec2-54-166-54-175.compute-1.amazonaws.com'}


                      /*

                        {key: 'X1-ZWz1fhs87lktu3_9wsfl', url: 'ec2-54-198-60-143.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19iq8qu23nv_9y702', url: 'ec2-34-201-120-222.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhsc5nsxsb_9zlkj', url: 'ec2-34-234-82-102.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19iq4srtzpn_a1050', url: 'ec2-54-158-2-249.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhsg3q11qj_a2eph', url: 'ec2-54-144-247-10.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19iq0uplvrf_a3t9y', url: 'ec2-34-230-75-51.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fhsk1s95or_a57uf', url: 'ec2-54-88-198-239.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz19iqkl0qfij_9prl8', url: 'ec2-54-235-38-19.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1a8dz1qevij_1llb0', url: 'ec2-34-239-245-192.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1es4lurg5xn_1mzvh', url: 'ec2-34-204-18-53.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1a8dv3o6rkb_1oefy', url: 'ec2-34-207-81-15.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1es4psto9vv_1pt0f', url: 'ec2-54-164-36-89.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1a8dr5lynm3_1r7kw', url: 'ec2-34-228-140-199.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1duk7dc2ebv_adn99', url: 'ec2-107-23-228-123.compute-1.amazonaws.com'},

                        {key: 'X1-ZWz191oq2v7w23_77v70', url: 'ec2-34-207-242-218.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz191om4szs3v_7aoby', url: 'ec2-107-23-228-123.compute-1.amazonaws.com'},
                        {key: 'X1-ZWz1fytutmn5e3_799rh', url: 'ec2-52-91-144-25.compute-1.amazonaws.com'}
                        */
                    ]
                }
            },
            test: function (next) {
                var request = require('request');
                var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1fcuvbl39qj_3if65&address='+encodeURI('1 Teaneck Ct')+'&citystatezip='+encodeURI('Lutherville Timonium, MD');
                console.log(url);
                request.post({
                    url:'http://ec2-54-152-230-208.compute-1.amazonaws.com/zillow_api_search.php',
                    form:{url:url}
                }, function (err, resp, body) {
                    console.log('<<<<<<<< response >>>>>>>>>>>');
                    console.log(resp);
                    console.log('<<<<<<<< body >>>>>>>>>>>');
                    console.log(body);
                    next();
                });
            },
            runBatch    : function (params, next) {

                var run_phones = false;
                var run_values = true;
                var query = {
                    //updatedAt:{$gt:new Date("2016-07-01T00:00:00.000Z")},
                    //"mortgageValue.date":{$lt:new Date("2016-07-01T00:00:00.000Z"),$exists:true}
                    //"source.description":"3-2017-ME-IN",
                    //"source.description":{$ne:"10-2016-120k"},
                    address:{$exists:true}
                };
                var start = 1;
                //var stream = api.models.Property.find(query).sort({"mortgageValue.date":1}).skip(Number(params.skip)).limit(Number($
                var stream = api.models.Property.find(query).skip(Number(params.skip)).limit(Number(params.limit)).stream();

                stream.on('data', function (item) {

                    if(run_values)
                    {

                        if(params.server) {
                            api.tasks.enqueue('processZillowApi', {property: item, server: params.server}, 'zillowapi');
                        }
                    }
                    if(run_phones)
                    {
                        /*
                         start++;
                         if(start == api.scrubber.config.proxy.servers.length)
                         {
                         start = 0;
                         }
                         */
                        api.tasks.enqueue('processWhitePhone',{property:item},'yellowphone');
                    }

                });
                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'!!!! Batch Complete !!!!');
                });

            },
            getYellowPhone:function (params, next) {
                var $ = require('cheerio');
                var request = require('request');

                    var proxy = api.scrubber.config.proxy.servers[params.proxy];
                    if(!proxy)
                    {
                        return next(new Error("no proxy"));
                    }
                    var server = 'http://'+proxy.url+'/yellow_address.php';
                var url = 'http://people.yellowpages.com/whitepages/address?street='+params.property.address.street1.replace(/ /g,'+')+'&qloc='+params.property.address.city.replace(/ /g, '+')+"+"+params.property.address.state+'+'+params.property.address.zip;

                request.post({
                    url:server,
                    form:{url:url}
                }, function (err, resp, body) {
                    if (err || resp.statusCode != 200) {

                        next(null, 'Resonse Error');
                        return;
                    }
                    var html = $.load(body);
                    var nums = [];
                    html('.result-left').each(function (i, el) {
                        var num = $(this).find('.phone').text();
                        if(num.length)
                        {
                            nums.push(num);
                        }
                    });
                    var result = new api.models.ScrubResult();
                    result.propertyId = params.property._id;
                    result.type = 'Phone';
                    result.source = 'YellowPages';
                    result.data = {
                        params:params,
                        numbers:nums,
                        proxy:proxy
                    };
                    result.save(function (err) {
                        if(err)
                        {
                            next(null, 'Error saving Property: '+params.property._id);
                            return;
                        }
                        if(nums.length <= 0)
                        {
                            next(null, 'SAVED - COMPLETE with NO NUMBERS: '+params.property._id);
                            return;
                        }

                        api.properties.updateValueFromYellow(params.property._id, nums, function (err, status) {
                            if(err)
                            {
                                next(null, 'Error saving Property: '+params.property._id);
                                return;
                            }
                            next(null, 'SAVED - COMPLETE: '+params.property._id);
                        });
                    });
                });
            },
            getZillowApi:function (params, next) {
                var _ = require('lodash');
                var xml2js = require('xml2js');
                var parser = new xml2js.Parser();
                var request = require('request');

                var proxy = api.scrubber.config.proxy.servers[params.server];
                if(!proxy)
                {
                    next(null, 'No Proxy');
                    return;
                }

                var url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id='+proxy.key+'&address='+encodeURI(params.property.address.street1)+'&citystatezip='+encodeURI(params.property.address.city+', '+params.property.address.state+' '+params.property.address.zip);
                request.post({
                    url:'http://'+proxy.url+'/zillow_api_search.php',
                    form:{url:url}
                }, function (err, resp, body) {
                    if (err || resp.statusCode != 200) {
                        next(null,'Invalid Request Response');
                        return;
                    }
                    parser.parseString(body, function (err, result) {
                        if (err) {
                            next(null, 'Parser Error');
                            return;
                        }
                        if(!result)
                        {
                            next(null, 'No Result');
                            return;
                        }
                        var resultSet = result["SearchResults:searchresults"];
                        if (resultSet.message[0]["limit-warning"] || resultSet.message[0].code[0] != 0 || resultSet.response[0].results[0].result.length != 1) {
                            next(null,resultSet.message[0]);
                            return;
                        }
                        var r = resultSet.response[0].results[0].result[0];
                        var zpid = r.zpid[0];
                        var zestimate = r.zestimate[0].amount[0]["_"];
                        var saved = new api.models.ScrubResult();
                        saved.type = 'Value';
                        saved.source = 'ZillowAPI';
                        saved.propertyId = params.property._id;
                        saved.data = {
                            params: params,
                            proxy: proxy,
                            zpid: zpid,
                            value: zestimate
                        };
                        saved.key = proxy['key'];
                        saved.server = proxy.server;
                        saved.save(function (err) {
                            if(err)
                            {
                                next(null, 'Error Saving Result: '+params.property._id);
                                return;
                            }
                            api.properties.updateValueFromZillow(params.property._id, zpid, zestimate, function (err, status) {
                                if(err)
                                {
                                    next(null, 'Error saving Property: '+params.property._id);
                                    return;
                                }
                                next(null, 'SAVED - COMPLETE: '+params.property._id);
                            });
                        });
                    });
                });
            },
            processWhitePages: function(params, next) {
                var _ = require('lodash');
                var request = require('request');
                var qs = {
                    api_key: "4bbb45d4eb704eb4902994d63e9afc36",
                    city: params.property.address.city,
                    state: params.property.address.state,
                    country_code: "US",
                    postal_code: params.property.address.zip,
                    street_line_1: params.property.address.street1
                };

                if(params.property.address.street2) {
                    qs.street_line_2 = params.property.address.street2;
                }

                request({
                    url: 'https://proapi.whitepages.com/3.0/location',
                    method: 'GET',
                    qs: qs
                }, function (error, response, body) {
                    if(error) {
                        return next(error);
                    }
                    var res = JSON.parse(body);
                    var phones = [];
                    res.current_residents.forEach(function(person){
                        person.phones.forEach(function(phone){
                            phones.push(phone.phone_number);
                        });
                    });
                    if(phones.length)
                    {
                        phones = _.uniq(phones);
                        api.models.Property.findById(params.property._id, function(err, property){
                            if(err) {next(err);} else{
                                phones.forEach(function(wpPhone){
                                    p = {};
                                    phone.number = api.helpers.formatPhone(wpPhone);
                                    phone.updated = Date.now();
                                    phone.status = 'Good';
                                    phone.source = 'WhitePagesPro';
                                    property.phones.push(phone);
                                });
                                property.save(function (err, p) {
                                    if(err)
                                    {
                                        next(err);
                                    } else {
                                        next(null, p);
                                    }
                                });
                            }
                        });//end model query
                    } else {
                        next();
                    }
                });
            },
            fetchWhitePages: function (params, next) {
                var request = require('request');
                api.models.Property.findById(params.propertyId, function (err, prop) {
                    if(err) {
                        return next(err);
                    }
                    api.models.WPRequest({
                        property: prop._id,
                        user: params.user._id
                    }).save();

                    var qs = {
                        api_key: "4bbb45d4eb704eb4902994d63e9afc36",
                        city: prop.address.city,
                        state: prop.address.state,
                        country_code: "US",
                        postal_code: prop.address.zip,
                        street_line_1: prop.address.street1
                    };

                    if(prop.address.steet2) {
                        qs.street_line_2 = prop.address.street2;
                    }

                    console.log(qs);

                    request({
                        url: 'https://proapi.whitepages.com/3.0/location',
                        method: 'GET',
                        qs: qs
                    }, function (error, response, body) {
                        if(error) {
                            return next(error);
                        }
                        next(null, JSON.parse(body));
                    });

                });
            },
            //////////////////////////////////  Stand Alone ////////////////////////////////
            standAlone: {
                api: {
                    config: {
                        zillowLimit: 1000,
                        proxies: [
                            {foo: 'bar'},
                            {key: 'X1-ZWz1fcuvbl39qj_3if65', url: 'ec2-34-229-171-183.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19nnlmujnrf_3jtqm', url: 'ec2-54-174-220-3.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fcurdiv5sb_3fm17', url: 'ec2-54-224-215-108.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19nnhosbjt7_3mmvk', url: 'ec2-107-21-129-173.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fcv37pjhmz_3o1g1', url: 'ec2-34-203-30-92.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19nndqq3fuz_3pg0i', url: 'ec2-34-224-33-138.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19nntiyzvnv_3e7gq', url: 'ec2-52-207-198-4.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fcuz9nbdor_3l8b3', url: 'ec2-107-21-157-28.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhqswsneh7_8w9nb', url: 'ec2-184-73-24-252.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19irrzp7myz_8uv2u', url: 'ec2-54-158-0-207.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhqoyqfaiz_8tgid', url: 'ec2-54-144-204-101.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19irvxrfqx7_8s1xw', url: 'ec2-34-229-7-98.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhql0o76kr_8qndf', url: 'ec2-54-236-7-171.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19irzvtnuvf_8p8sy', url: 'ec2-34-203-234-14.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhq96hiuq3_8i7yl', url: 'ec2-54-227-153-80.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhqd4jqyob_8l13j', url: 'ec2-54-162-214-138.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19is3tvvytn_8mfo0', url: 'ec2-54-152-175-46.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhqh2lz2mj_8nu8h', url: 'ec2-52-207-227-101.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhs0bh4lxn_9r65p', url: 'ec2-34-228-200-83.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19iqgmyibkb_9skq6', url: 'ec2-34-234-84-244.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhs49jcpvv_9tzan', url: 'ec2-34-234-84-244.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19iqcowa7m3_9vdv4', url: 'ec2-52-90-160-188.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhs87lktu3_9wsfl', url: 'ec2-34-228-59-211.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19iq8qu23nv_9y702', url: 'ec2-54-205-184-2.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhsc5nsxsb_9zlkj', url: 'ec2-54-174-161-141.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19iq4srtzpn_a1050', url: 'ec2-54-205-204-233.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhsg3q11qj_a2eph', url: 'ec2-54-174-168-53.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19iq0uplvrf_a3t9y', url: 'ec2-54-152-229-2.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fhsk1s95or_a57uf', url: 'ec2-54-237-139-191.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz19iqkl0qfij_9prl8', url: 'ec2-34-228-61-213.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1a8dz1qevij_1llb0', url: 'ec2-52-91-225-136.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1es4lurg5xn_1mzvh', url: 'ec2-34-207-82-56.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1a8dv3o6rkb_1oefy', url: 'ec2-52-90-0-129.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1es4psto9vv_1pt0f', url: 'ec2-52-87-246-181.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1a8dr5lynm3_1r7kw', url: 'ec2-107-21-12-95.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1duk7dc2ebv_adn99', url: 'ec2-54-197-160-142.compute-1.amazonaws.com'},

                            {key: 'X1-ZWz191oq2v7w23_77v70', url: 'ec2-34-229-19-21.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz191om4szs3v_7aoby', url: 'ec2-54-152-196-216.compute-1.amazonaws.com'},
                            {key: 'X1-ZWz1fytutmn5e3_799rh', url: 'ec2-34-234-76-174.compute-1.amazonaws.com'}

                        ]
                    },
                    runBatch    : function (params, next) {

                        var query = {"mortgageValue.date": {$lt: new Date(2017,7,30) },$and:[{"mortgageValue.link":{$exists:true}},{"mortgageValue.link":{$not:{$type:10}}}]};
                        //var stream = api.models.Property.find(query).sort({"mortgageValue.date":1}).skip(Number(params.skip)).limit(Number($
                        //var stream = api.models.DestinyLead.find(query).skip(Number(params.skip)).limit(Number(params.limit)).stream();
                        var stream = api.models.Property.find(query).skip(Number(params.skip)).limit(Number(params.limit)).stream();

                        stream.on('data', function (item) {

                            const server = api.scrubber.standAlone.api.config.proxies[params.server];

                            api.tasks.enqueue('processNWEZillowApi', {property: item, server: server}, 'default');

                        });
                        stream.on('error', function (err) {
                            next(err);
                        });
                        stream.on('close', function (foo) {
                            next(null,'!!!! Batch Complete !!!!');
                        });

                    },
                },
            },

            checkProxyHash: function (i) {
                api.redis.client.hsetnx('scrubproxies', i, api.scrubber.config.zillowApi.max);
            },
            checkProxyNode: function () {
                api.redis.client.setnx('scrubnode', 1);
                api.redis.client.setnx('phonenode', 1);
            }
        }
        next();
    },
    start: function(api, next){
        api.scrubber.checkProxyNode();
        for(var i = 1; i <= api.scrubber.config.proxy.servers.length; i++)
        {
            api.scrubber.checkProxyHash(i);
        }
        next();
    }
};