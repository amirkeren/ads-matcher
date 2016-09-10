var app =  {

    // Bluemix credentials
    route: "http://ads-matching.mybluemix.net",
    guid: "04434195-9c21-4a0c-b8b8-280876d163ed",

    // API route for Items model
    apiRoute: "/api/alchemy",

    // Initialize BMSClient
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to use the 'route' and 'guid'
    // variables, we must explicitly call 'app.route' and 'app.guid'
    onDeviceReady: function() {
        BMSClient.initialize(app.route, app.guid);
        app.apiRoute = app.route + app.apiRoute;
    },

    // Make a call to our API to get all Items.
    // Update the table with the items if the request succeeds
    analyzeUrl: function() {
        api.analyzeUrl(app.apiRoute, view.refreshTable, app.failure);
    },

    // Standard failure response
    failure: function(res) {
        alert("Failure: " + JSON.stringify(res));
    }
};

app.initialize();