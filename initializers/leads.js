module.exports = {
    initialize:function(api, next){
        api.leads = {
            assignments:function (user,next) {
                //var that = this;
                //var id = user.id;
                api.models.Lead.find({"user": user._id})
                    .limit(2000)
                    .select({"property": 1})
                    .exec(function (err, ids) {
                        if(err)
                        {
                            next(err);
                        } else {
                            next(null, ids);
                        }
                    });
            },
            assign: function (params, next) {
                var Promise = require('bluebird');
                if(!params.assignData.user) {
                    return next(new Error('Please select a user'));
                }
                var q1;
                if(params.assignData.type == 'all') {
                    params.filters.perPage = null;
                    params.filters.page = null;
                }
                if(params.assignData.type == 'selected') {
                    q1 = api.models.Property.find({
                        "_id":{$in:params.selected}
                    }).exec();
                } else {
                    q1 = new Promise(function (resolve, reject) {
                        api.properties.all(params.filters, false, function (err, props) {
                            if(err) {
                                return reject(err);
                            } else {
                                resolve(props);
                            }
                        });
                    });
                }
                q1.then(function (res) {
                    var props = (params.assignData.type == 'selected')? res : res.leads;
                    if(!props.length) {
                        return next(new Error('No Results'));
                    }
                    api.tasks.enqueue('prepareAssignments',
                        {props:props, user:params.assignData.user, assign:params.assignData.assign},
                        'default',
                        function (err, toRun) {
                            if(err) {
                                return next(err);
                            }
                            next(null, true);
                        }
                    );
                }).catch(function (err) {
                    return next(err);
                })
            },
            oldassign:function (params, next) {

                var that = this;
                var orignParams = params;
                that.getAssignProps(params, function (err, results) {
                   if(err)
                   {
                       next(err);
                   } else {
                       //api.log(results.meta.total);
                       if(results.leads)
                       {
                           results = results.leads;
                       }
                       for(var i = 0; i< results.length; i++)
                       {
                           //api.log('Process Assignment Enqueue: '+i);
                           api.tasks.enqueue('processAssignment',{property:results[i],user:orignParams.assignData.user, assign:orignParams.assignData.assign},'default');

                           if(i+1 == results.length)
                           {
                               next(null,true);
                           }
                       }
                   }

                });

            },
            getAssignProps:function (params, next) {
                if (params.assignData.type == 'all')
                {
                    //api.log('ALL');
                    params.filters.perPage = null;
                    params.filters.page = null;
                }
                if(params.assignData.type == 'selected')
                {
                    //api.log('SELECTED');
                    api.models.Property.find({
                        "_id":{$in:params.selected}
                    }).exec(function (err, results) {
                        if(err)
                        {
                            next(err);
                        } else {
                            next(null, results);
                        }
                    });
                } else if(params.filters.user)
                {
                    //api.log('USER');
                    api.leads.assignments(params.filters.user, function (err, ids) {
                        if(err)
                        {
                            next(err);
                        } else {
                            api.properties.all(params.filters, ids, true, function(error, results) {
                                if(error)
                                {
                                    next(error);
                                } else {
                                    next(null, results);
                                }
                            });
                        }
                    });

                } else {
                    //api.log('NO USER');
                    api.properties.all(params.filters, null, true, function(error, results) {
                        if(error)
                        {
                            next(error);
                        } else {
                            next(null, results);
                        }
                    });
                }

            },
            processAssignment:function (prop, user, assign, next) {
                //api.log('PROCESS THIS: '+num);
                if(assign)
                {
                    //api.log('STEP 2: '+num);
                    var l = new api.models.Lead;
                    l.property = prop;
                    l.user = user;
                    l.save(function (err) {
                        if(err)
                        {
                            next(err);
                        } else {
                            next();
                        }
                    })
                } else {
                    api.models.Lead.remove({
                        property:prop._id,
                        user:user._id
                    }).exec(function (err, results) {
                        if(err)
                        {
                            next(err);
                        } else {
                            next(null, results);
                        }
                    });
                }
            },
            claim:function (params, next) {
                 api.models.Property.findById(params.property, function(err, property) {
                     if (err) {
                         next(err);
                     } else {
                         property.pipelineOwner = params.user;
                         property.bucket = 'Completed Apps';
                         property.status = 'Paper App';
                         var st = {
                             user:params.user,
                             userName:params.user.name.first+' '+params.user.name.last,
                             name:'Paper App',
                             date: Date.now()
                         };
                         if(params.source)
                         {
                             st.source = params.source
                         }
                         property.statuses.push(st);
                         property.save(function (err, p) {
                             if (err) {
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
            claimLead:function (params, next) {
                var lead = new api.models.Lead();
                lead.property = params.property;
                lead.user = params.user._id;
                lead.save(function (err, l) {
                    if(err)
                    {
                        next(err);
                    } else {
                        next(null, l);
                    }
                });
            },
            checkHasLead:function (params, next) {
                api.models.Lead.findOne({
                    user:params.user_id,
                    property:params.property_id
                }).exec(function (err, prop) {
                    if(prop)
                    {
                        next(null, true);
                    } else {
                        next(null,false);
                    }
                });
            }
        };
        next();
    }
};