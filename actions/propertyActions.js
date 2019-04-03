exports.saveNewProp = {
    name:'saveNewProp',
    description:'saveNewProp',
    inputs: {
        property: {required:true},
        user: {required:true}
    },
    run: function (api, data, next) {
        api.properties.saveNew(data.params, function (err, prop) {
            if(err){
                return next(err);
            }
            data.response.property = prop;
            next();
        })
    }
};

exports.getProperty = {
    name:'getProperty',
    description:'getProperty',
    inputs: {
        id: {required:true}
    },
    run: function (api, data, next) {
        api.properties.getOne(data.params.id, function (err, prop) {
            if(err){
                return next(err);
            }
            data.response.property = prop;
            next();
        })
    }
};

exports.recycleProperty = {
    name:'recycleProperty',
    description:'recycleProperty',
    inputs: {
        id: {required:true},
        user: {required: true}
    },
    run: function (api, data, next) {
        api.properties.recycle(data.params, function (err, prop) {
            if(err){
                return next(err);
            }
            data.response.status = "success";
            next();
        })
    }
};

exports.allProperties = {
    name: 'allProperties',
    description: 'allProperties',
    inputs: {
        filters:{
            required:true
        }
    },
    run: function (api, data, next) {
        api.properties.all(data.params.filters, true, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.leads = results.leads;
                data.response.meta = results.meta;
                next();
            }
        });
    }
};


exports.oldAllProps = {
    name: 'oldAllProps',
    description: 'oldAllProps',

    inputs: {
        filters:{
            required:true
        }
    },

    run: function(api, data, next){
        if(data.params.filters.user)
        {
            api.leads.assignments(data.params.filters.user, function (err, ids) {
               if(err)
               {
                   next(err);
               } else {
                   
                   api.properties.all(data.params.filters, ids, true, function(error, results) {
                       if(error)
                       {
                           next(error);
                       } else {
                           data.response.leads = results.leads;
                           data.response.meta = results.meta;
                           next();
                       }
                   });
               }
            });

        } else {
            api.properties.all(data.params.filters, null, true, function(error, results) {
                if(error)
                {
                    next(error);
                } else {
                    data.response.leads = results.leads;
                    data.response.meta = results.meta;
                    next();
                }
            });
        }
    }
};

exports.exportProperties = {
    name: 'exportProperties',
    description: 'exportProperties',

    inputs: {
        filters:{
            required:true
        }
    },

    run: function(api, data, next){
        data.params.filters.page = null;
        data.params.filters.perPage = null;


            api.properties.all(data.params.filters, false, function(error, results) {
                if(error)
                {
                    next(error);
                } else {
                    api.properties.export(results, function (err, success) {
                        if(err)
                        {
                            next(err);
                        } else {
                            //data.response.success = true;
                            data.response.path = success;
                            next();
                        }
                    });
                }
            });

            
    }
};

exports.searchAll = {
    name: 'searchAll',
    description: 'searchAll',

    inputs: {
        filter:{
            required:true
        }
    },

    run: function(api, data, next){

        api.properties.searchAll(data.params.filter, function(error, results) {
            if(error)
            {
                next(error);
            } else {
                data.response.leads = results;
                next();
            }
        });
    }
};

exports.changePhoneStatus = {
    name: 'changePhoneStatus',
    description: 'changePhoneStatus',

    inputs: {
        user:{
            required:true
        },
        property:{
            required:true
        },
        status:{
            required:true
        },
        phone:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changePhoneStatus(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.success = results;
                next();
            }
        });
    }
};

exports.changeDNC = {
    name: 'changeDNC',
    description: 'changeDNC',

    inputs: {
        user:{
            required:true
        },
        property:{
            required:true
        },
        status:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changeDNC(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.lead = results;
                next();
            }
        });
    }
};

exports.changeDNM = {
    name: 'changeDNM',
    description: 'changeDNM',

    inputs: {
        user:{
            required:true
        },
        property:{
            required:true
        },
        status:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changeDNM(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.lead = results;
                next();
            }
        });
    }
};

exports.turnDown = {
    name: 'turnDown',
    description: 'turnDown',

    inputs: {
        property:{
            required:true
        },
        turnDown:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.turnDown(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.success = results;
                next();
            }
        });
    }
};

exports.changeStatus = {
    name: 'changeStatus',
    description: 'changeStatus',

    inputs: {
        property:{
            required:true
        },
        status:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changeStatus(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.property = results;
                next();
            }
        });
    }
};

exports.changeStatusClosed = {
    name: 'changeStatusClosed',
    description: 'changeStatusClosed',

    inputs: {
        property:{
            required:true
        },
        closed:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changeStatusClosed(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.property = results;
                next();
            }
        });
    }
};

exports.changeOwner = {
    name: 'changeOwner',
    description: 'changeOwner',

    inputs: {
        property:{
            required:true
        },
        owner:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changeOwner(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.property = results;
                next();
            }
        });
    }
};

exports.changeColor = {
    name: 'changeColor',
    description: 'changeColor',

    inputs: {
        property:{
            required:true
        },
        color:{
            required:true
        },
        user:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.changeColor(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.property = results;
                next();
            }
        });
    }
};

exports.addPhone = {
    name: 'addPhone',
    description: 'addPhone',

    inputs: {
        user:{
            required:true
        },
        property:{
            required:true
        },
        phone:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.addPhone(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.phones = results.phones;
                next();
            }
        });
    }
};

exports.saveWPPhone = {
    name: 'saveWPPhone',
    description: 'saveWPPhone',

    inputs: {
        user: {
            required: true
        },
        property: {
            required: true
        },
        phone: {
            required: true
        }
    },

    run: function (api, data, next) {
        api.properties.addWPPhone(data.params, function (err, results) {
            if (err) {
                next(err);
            } else {
                data.response.phones = results.phones;
                next();
            }
        });
    }
};

exports.addComment = {
    name: 'addComment',
    description: 'addComment',

    inputs: {
        user:{
            required:true
        },
        property:{
            required:true
        },
        comment:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.addComment(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.comments = results.comments;
                next();
            }
        });
    }
};

exports.deleteComment = {
    name: 'deleteComment',
    description: 'deleteComment',

    inputs: {
        property:{
            required:true
        },
        comment:{
            required:true
        }
    },

    run: function(api, data, next){
        api.properties.deleteComment(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.comments = results.comments;
                next();
            }
        });
    }
};

exports.basicPropertyStats = {
    name: 'basicPropertyStats',
    description: 'basicPropertyStats',
    autosession:false,
    inputs: {
        id:{
            required:false
        }
    },
    run: function(api, data, next){
        api.properties.basicStats(data.params, function (err, results) {
            if(err)
            {
                next(err);
            } else {
                data.response.stats = results;
                next(null);
            }
        });
    }
};