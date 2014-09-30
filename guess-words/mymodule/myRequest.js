var q = require('q');
var request = require('request');
var config = require('../config');


var url = config.url;
var userId = config.userId;


exports.initGame = function() {
	var defer = q.defer();
	var formData = {
		"action": "initiateGame",
		"userId": userId
	};
	var headers = {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	};
	request.post(url, {form: formData, headers: headers}, function(err, response, body) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(body);
		}
	});
	return defer.promise;
};

exports.giveWord = function(data) {
	var defer = q.defer();
	var formData = {
		"action": "nextWord",
		"userId": userId,
		"secret": data.secret
	};
	var headers = {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	};
	request.post(url, {form: formData, headers: headers}, function(err, response, body) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(body);
		}
	});
	return defer.promise;
};

exports.makeGuess = function(data, letter) {
	var defer = q.defer();
	var formData = {
		"action": "guessWord",
		"userId": userId,
		"secret": data.secret,
		"guess": letter
	};
	var headers = {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	};
	request.post(url, {form: formData, headers: headers}, function(err, response, body) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(body);
		}
	});
	return defer.promise;
};

exports.getResults = function(data) {
	var defer = q.defer();
	var formData = {
		"action": "getTestResults",
		"userId": userId,
		"secret": data.secret
	};
	var headers = {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	};
	request.post(url, {form: formData, headers: headers}, function(err, response, body) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(body);
		}
	});
	return defer.promise;
};

exports.submitResults = function(data) {
	var formData = {
		"action": "submitTestResults",
		"userId": userId,
		"secret": data.secret
	};
	var headers = {
		"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
	};
	request.post({url: url, formData: formData, headers: headers}, function(err, response, body) {
		if (err) {
			console.log("submit results Error: ", err);
		} else {
			console.log("Your test is over, check your score below: ");
			console.log("=============================================\n");
			console.log(body);
		}
	});
};