exports.task = {
  name:          'processTelePhone',
  description:   'processTelePhone',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.models.Property.findOne({oldId: params.record.id}).exec(function (err, res) {
        if(err) {
          return next(err);
        }
        if(!res) {
          return next(null);
        }
        var p;
        var t = 'Landline';
        if(params.mobile) {
          p = params.record.cell;
          t = 'Mobile';
        } else {
          p = params.record.land;
        }
        var r = api.helpers.formatPhone(p);
        var dup = false;
        for(var i = 0; i<res.phones.length; i++)
        {
          // api.log('P', 'crit', r);
          // api.log('Phone', 'crit', res.phones[i].number);
          if(res.phones[i].number == r) {
            dup = true;
          }
        }

        if(!dup) {
            res.phones.push({
                number: r,
                status: 'Good',
                username: "System",
                source: "ABC",
                phoneType: t
            });
            res.save(function (err, saved) {
                if(err) {
                    return next(err);
                }
                return next(null);
            })
            //api.log('NO DUP', 'crit');
        } else {
          return next(null);
        }

    });
  }
};
