var Promise = require('bluebird');

exports.task = {
  name:          'prepareAssignments',
  description:   'prepareAssignments',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){

    Promise.map(params.props, function (p) {
        return new Promise(function (resolve, reject) {
            api.tasks.enqueue('processAssignment',
                {property:p, user:params.user, assign:params.assign},
                'default',
                function (err, toRun) {
                    if(err) {
                        return reject(err);
                    }
                    resolve();
                }
            )
        });
    }).then(function () {
        next();
    }).catch(function (err) {
        return next(err);
    })
  }

};
