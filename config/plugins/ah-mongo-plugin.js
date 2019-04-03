exports.default = {
    mongo: function(api){
        return {
            enable: true,
            startMongo: true,
            connectionURL: 'mongodb://localhost:27017/channeloneProd',
            debug: true,
            modelPath: api.projectRoot + '/models'
        };
    }
};

exports.production = {
    mongo: function(api){
        return {
            enable: true,
            startMongo: true,
            connectionURL: 'mongodb://localhost:27017/channeloneProd',
            debug: false,
            modelPath: api.projectRoot + '/models'
        };
    }
};