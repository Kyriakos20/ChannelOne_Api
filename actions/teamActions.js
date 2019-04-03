exports.allTeams = {
    name: 'allTeams',
    description: 'allTeams',

    run: function(api, data, next){
        api.teams.all(function(err, resp){
            if(resp)
            {
                data.response.teams = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.newTeam = {
    name: 'newTeam',
    description: 'newTeam',

    inputs: {
        team:{
            required:true
        }
    },

    run: function(api, data, next){
        api.teams.new(data.params, function(err, resp){
            if(resp)
            {
                data.response.team = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};

exports.editTeam = {
    name: 'editTeam',
    description: 'editTeam',

    inputs: {
        team:{
            required:true
        }
    },

    run: function(api, data, next){
        api.teams.edit(data.params, function(err, resp){
            if(resp)
            {
                data.response.team = resp;
                next(null, resp);
            } else {
                next(err);
            }
        });
    }
};