exports.default = {
  routes: function(api){
    return {

      post: [
        { path: '/login', action: 'login' },
        { path: '/users/create', action: 'createUser' },
        { path: '/users/update', action: 'updateUser' },
        { path: '/users/new', action: 'newUser' },
        { path: '/users/edit', action: 'editUser' },
        { path: '/users/all', action: 'allUsers' },
        { path: '/properties/all', action: 'allProperties'},
        { path: '/leads/assign', action: 'assignLeads'},
        { path: '/properties/export', action: 'exportProperties'},
        { path: '/properties/phone_status', action: 'changePhoneStatus'},
        { path: '/properties/add_phone', action: 'addPhone'},
        { path: '/properties/change_dnc', action: 'changeDNC'},
        { path: '/properties/change_dnm', action: 'changeDNM'},
        { path: '/properties/turn_down', action: 'turnDown'},
        { path: '/leads/claim', action: 'claim'},
        { path: '/leads/claim_lead', action: 'claimLead'},
        { path: '/properties/add_comment', action: 'addComment'},
        { path: '/properties/delete_comment', action: 'deleteComment'},
        { path: '/properties/change_status', action: 'changeStatus'},
        { path: '/properties/change_status_closed', action: 'changeStatusClosed'},
        { path: '/properties/change_owner', action: 'changeOwner'},
        { path: '/properties/change_color', action: 'changeColor'},
        { path: '/properties/search', action: 'searchAll'},
        { path: '/apps/save', action: 'saveApp'},
        { path: '/apps/load', action: 'loadApp'},
        { path: '/teams/all', action: 'allTeams'},
        { path: '/teams/new', action: 'newTeam'},
        { path: '/teams/edit', action: 'editTeam'},
        { path: '/scrubber/results/phones', action:'phoneScrubResult'},
        { path: '/scrubber/results/value', action:'valueScrubResult'},
        { path: '/xml/call', action:'evolveCall'},
        { path: '/xml/center', action:'evolveCenter'},
        { path: '/scrubber/destiny/batch', action:'scrubDestinyBatch'},
        { path: 'scraper/init', action: 'scrapeAll'}

      ],
      get: [
          { path: '/fake/vals', action:'startFakeValues'},
        { path: '/counties/simple', action: 'simpleCounties' },
        { path: '/users/simple', action: 'simpleUsers' },
        { path: '/apps/print/:id', action: 'printApp' }, // (GET) /api/search/car/limit/10/offset/100
        {path: '/migrations/destiny/leads', action: 'importDestinyLeads'}
      ]
      /* ---------------------
      routes.js

      For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

      Learn more here: http://www.actionherojs.com/docs/#routes

      examples:

      get: [
        { path: '/users', action: 'usersList' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      ],

      post: [
        { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      ],

      all: [
        { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
      ]

      ---------------------- */

    };
  }
};
