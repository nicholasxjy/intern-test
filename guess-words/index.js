var async = require('async');
var myRequest = require('./mymodule/myRequest');
var guess = require('./mymodule/guess');

myRequest.initGame().then(function(data) {
	if (data) {
		var initRes = JSON.parse(data);

		//here it should be many times  at most 80 times depend on game rounds
        async.timesSeries(80, function(n, next) {
            async.waterfall([function (callback) {
                myRequest.giveWord(initRes).then(function (data) {
                    var giveWordRes = JSON.parse(data);
                    callback(null, giveWordRes);
                }, function (err) {
                    callback(err);
                    console.log("give word error: ", err);
                });
            }, function (res, callback) {
                guess.handleGuess(res, function(err, finalWord) {
                   if(err) {
                       callback(err);
                       console.log("Error :", err);
                   } else {
                       callback(null, finalWord);
                   }
                });
            }], function (err, result) {
                if (err) {
                    next(err);
                    console.log("Error guess: ", err);
                } else {
                    console.log("Final " + (n+1) + " word: " + result + "\n");
                    next(null, result);
                }
            });
        }, function(err, results) {
            async.waterfall([function(callback) {
                myRequest.getResults(initRes).then(function(data) {
                    var res = JSON.parse(data);
                    callback(null, res);
                }, function(err) {
                    callback(err);
                    console.log("Get results error: ", err);
                });
            }], function(err, result) {
                var score = parseInt(result.totalScore);
                myRequest.submitResults(initRes);
                console.log("Submit scores done");
            });
        });
	}
}, function(err) {
	console.log("initiateGame Error: ", err);
});
