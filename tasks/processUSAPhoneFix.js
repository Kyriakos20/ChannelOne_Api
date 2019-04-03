exports.task = {
  name:          'processUSAPhoneFix',
  description:   'processUSAPhoneFix',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
      var dirty = false;
      var phones = params.property.phones;
      var newPhones = [];
      phones.find(function (o) {
          if(o.number.indexOf("(") > 0)
          {
              o.number = (o.number.replace(/\(|\)|\\n/g, '')).trim();
              o.number = o.number.replace(/\s/, "-");
              dirty = true;
          }
          newPhones.push(o);
      });
      if(dirty)
      {
          api.models.Property.findById(params.property._id, function (err, prop) {
              if(err) { return next(err);}
              prop.phones = newPhones;
              prop.save(function (err, prop) {
                  if(err) { return next(err);}
                  next(null, true);
              });
          });
      } else {
          next(null);
      }
  }
};
