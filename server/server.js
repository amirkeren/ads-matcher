var packageVersion = require('./../package.json').version;
console.log("packageVersion :: " + packageVersion);

var loopback = require('loopback');
var boot = require('loopback-boot');
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');
var bodyParser = require('body-parser');

var app = module.exports = loopback();

var async = require('async');

var Cloudant = require('cloudant');

var cloudant = Cloudant("https://85a6963a-c421-4c67-8972-30e88dabb383-bluemix:265339a8340d7641f7f61001ea1686f34d4a0cab9782ceaec2ce37908c338910@85a6963a-c421-4c67-8972-30e88dabb383-bluemix.cloudant.com");

var toExtract = 'entities,keywords,taxonomy,concepts';

// ------------ Protecting mobile backend with Mobile Client Access start -----------------

// Load passport (http://passportjs.org)
var passport = require('passport');

var threshold = 75;

// Get the MCA passport strategy to use
var MCABackendStrategy = require('bms-mca-token-validation-strategy').MCABackendStrategy;

// Tell passport to use the MCA strategy
passport.use(new MCABackendStrategy())

// Tell application to use passport
app.use(passport.initialize());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Protect DELETE endpoint so it can only be accessed by HelloTodo mobile samples
app.delete('/api/Items/:id', passport.authenticate('mca-backend-strategy', {session: false}));

// Protect /protected endpoint which is used in Getting Started with Bluemix Mobile Services tutorials
app.get('/protected', passport.authenticate('mca-backend-strategy', {session: false}), function(req, res){
	res.send("Hello, this is a protected resouce of the mobile backend application!");
});
// ------------ Protecting backend APIs with Mobile Client Access end -----------------

app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		var componentExplorer = app.get('loopback-component-explorer');
		if (componentExplorer) {
			console.log('Browse your REST API at %s%s', baseUrl, componentExplorer.mountPath);
		}
	});
};

var alchemy_language = new AlchemyLanguageV1({
  api_key: 'bb54b7a90f758cc686ed6e3aed6768a66260ca78'
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
	if (err) throw err;
	if (require.main === module)
		app.start();
});

var ads = [];
//for testing purposes only
var analysis_result;

//analyze ads
(function () {
    var db = cloudant.db.use('ads');
    db.find(
    {
      "selector": {
        "_id": {
          "$gt": 0
        }
      },
      "fields": [
        "category",
        "title",
        "content"
      ]
    }, function(er, result) {
     if (er)
          console.error(er);
     else {
          console.log('found %d documents', result.docs.length);
          async.map(result.docs, function(item, callback) {
            var parameters = {
               extract: toExtract,
               text: item.category + ": " + item.title + " - " + item.content
            };
            alchemy_language.combined(parameters, function(err, response) {
               if (err)
                   console.error(err);
               else
                   ads.push({ ad: item, analysis: response});
            });
          });
      }
    });
})();

// ------------------------------------- Custom APIs ----------------------------------------------------

function shouldDisplayAd(emotion_response) {
   if ("anger" in emotion_response.docEmotions) {
    console.log("anger levels found");
    var level = parseFloat(emotion_response.docEmotions.anger) * 100;
    console.log("level is " + level);
    if (level > threshold) {
        return true;
    }
    console.log("lower than threshold");
   }
   if ("disgust" in emotion_response.docEmotions) {
    console.log("disgust levels found");
    var level = parseFloat(emotion_response.docEmotions.disgust) * 100;
    console.log("level is " + level);
    if (level > threshold) {
        return true;
    }
    console.log("lower than threshold");
   }
   return false;
}

function matchAd(combined_response) {
    //TODO - implement
    console.log("matching ads");
    return {"ad": "blabla", "explanation": "blibli"};
}

/*
* 1. Analyze url for taxonomy, concepts, keywords, entities and emotions
* 2. Determine whether or not to display ad
* 3. If need to display ad - match the appropriate ad by the result from step 1
*/
app.post('/api/alchemy', function(req, res) {
    var urlToAnalyze = req.body.data;
    console.log("analyzing url - " + urlToAnalyze);
    var parameters = {
       extract: toExtract,
       url: urlToAnalyze
    };
    alchemy_language.combined(parameters, function(err, combined_response) {
       if (err)
           res.send(err);
        else {
            analysis_result = combined_response;
            var parameters = {
               url: urlToAnalyze
            };
            alchemy_language.emotion(parameters, function(err, emotion_response) {
               if (err)
                   res.send(err);
                else if (shouldDisplayAd(emotion_response)) {
                    console.log("should display ad, determining which ad");
                    res.send(matchAd(combined_response));
                } else {
                    console.log("shouldn't display ad");
                    res.send();
                }
            });
        }
    });
});

// ------------------------------------- Test APIs ----------------------------------------------------

app.get('/api/ads', function(req, res) {
    res.send(ads);
});

app.get('/api/url', function(req, res) {
    res.send(analysis_result);
});