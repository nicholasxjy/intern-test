var async = require('async');
var _ = require('underscore-contrib');
var underscore = require('underscore');
var config = require('../config');
var myRequest = require('./myRequest');
var allletters = config.letters;
var vowels = config.vowels;
var firstletters = config.firstLetters;
var secondletters = config.secondLetters;
var thirdletters = config.thirdLetters;

exports.handleGuess = function(res, cb) {
	var numberOfGuessAllowedForThisWord = parseInt(res.data.numberOfGuessAllowedForThisWord);
	var removedLetters = [];
    var fitLetters = [];
	async.timesSeries(numberOfGuessAllowedForThisWord, function(n, next) {
		var letter = exports.pickLetter(removedLetters, fitLetters);
        console.log("guess letter: " + letter + "\n");
        async.waterfall([function(callback){
            myRequest.makeGuess(res, letter).then(function(data){
                var guessRes = JSON.parse(data);
                callback(null, guessRes.word);
            }, function(err) {
                console.log("guess word error: ", err);
            });
        }], function(err, result) {
            if (err) {
                next(err);
                console.log("Async guess error: ", err);
            } else {
                if (_.strContains(result, letter)) {
                    fitLetters.push(letter);
                }
                removedLetters.push(letter);
                next(null, result);
            }
        });
	}, function(err, results) {
        if (err) {
            cb(err);
        }
		var len = results.length;
		var word = results[len-1];
		cb(null, word);
	});
};

//pick random letter depend on its posibility

exports.pickLetter = function(removedLetters, fitLetters) {
    var leftVowels = underscore.difference(vowels, removedLetters);
    var leftFirstArray = underscore.difference(firstletters, removedLetters);
    var leftSecondArray = underscore.difference(secondletters, removedLetters);
    var leftThirdArray = underscore.difference(thirdletters, removedLetters);


    var leftLetters = underscore.difference(allletters, removedLetters);
    var lenLeftLetters = leftLetters.length;

    var lenvowels = leftVowels.length;
    var lenFirst = leftFirstArray.length;
    var lenSecond = leftSecondArray.length;
    var lenThird = leftThirdArray.length;


    var vowelNotFitArray = underscore.difference(vowels, fitLetters);
    var vowelNotFitLen = vowelNotFitArray.length;

    var firstNotFitArray = underscore.difference(firstletters, fitLetters);
    var firstNotFitLen = firstNotFitArray.length;

    var secondNotFitArray = underscore.difference(secondletters, fitLetters);
    var secondNotFitLen = secondNotFitArray.length;

    var thirdNotFitArray = underscore.difference(thirdletters, fitLetters);
    var thirdNotFitLen = thirdNotFitArray.length;


    if (lenvowels && vowelNotFitLen > 3) {
        var index0 = Math.floor(Math.random()*lenvowels);
        return leftVowels[index0];
    } else if (lenFirst && firstNotFitLen > 3) {
        var index1 = Math.floor(Math.random()*lenFirst);
        return leftFirstArray[index1];
    } else if(lenSecond && secondNotFitLen > 3) {
        var index2 = Math.floor(Math.random()*lenSecond);
        return leftSecondArray[index2];
    } else if (lenThird && thirdNotFitLen > 4) {
        var index3 = Math.floor(Math.random()*lenThird);
        return leftThirdArray[index3];
    } else {
        var index = Math.floor(Math.random()*lenLeftLetters);
        return leftLetters[index];
    }
};