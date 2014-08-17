'use strict';

var _ = require('lodash')
	, mongo = require('mongodb').MongoClient;

module.exports = (function() {
	var Simplog = function(uri, options) {
		var self = this;
		var _client = {};
		var _logErr = function(err) {
			if (err && self.options.verbose) console.log('Error: unable to save log');
		};

		self.options = _.extend({
			console: false,
			criteria: {
				gte: 1,
				lte: null,
				equal: null
			},
			verbose: false,
			colName: 'logs'
		}, options || {});

		if (uri && typeof uri === 'object' && uri.constructor.name === 'Mongoose'){
			_client = uri;
			var Log = _client.model(self.options.colName, { data: _client.Schema.Types.Mixed });
			
			this._log = function(obj) { new Log({ data: obj }).save(); };
		} else {
			this._log = function(obj) { _client.collection(self.options.colName).insert(obj, _logErr); };
		}


		if (self.options.console === true) self.options.console = console.log;
	};

	Simplog.prototype.connect = function(uri, cb) {
		mongo.connect(uri, function(err, db) {
			if (err) cb(err);
			this._client = db;
			cb(null);
		});
	};

	Simplog.prototype.log = function(code, message) {
		var self = this;
		if (!this.matchesCriteria(code)) return false;

		var a = (typeof code === 'object' && code || { code: code, message: message });
		self._log(a);

		if (self.options.console) a.toJSON && self.options.console(JSON.stringify(a)) || self.options.console(a);
		return true;
	};

	Simplog.prototype.matchesCriteria = function(code) {
		var c = this.options.criteria;

		if (typeof code !== 'number') return true;
		if (c.lte && (code <= c.lte) || false) return true;
		if (c.gte && (code >= c.gte) || false) return true;

		return c.equal && (typeof _.find(c.equal, function(c) { return code === c; }) !== 'undefined') || false;
	};

	Simplog.prototype.setCriteria = function(c) {
		if (typeof c !== 'object') return false;
		this.options.criteria = c;
	};

	Simplog.prototype.error = function(code, message) {
		var self = this;
		var e = new Error(code, message);

		var eLog = (e.toJSON && e) || {
			stack: e.stack,
			message: message,
			code: code
		};

		self.log(eLog);

		
		
		return e;
	};

	return Simplog;
})();