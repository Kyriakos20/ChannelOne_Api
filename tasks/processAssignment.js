exports.task = {
  name:          'processAssignment',
  description:   'processAssignment',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    var prop = params.property;
    var user = params.user;
    var assign = params.assign;
      if(assign)
      {
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
                  next();
              }
          });
      }
  }
};
