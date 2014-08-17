'use strict';

var _ = require('lodash')
	, mongo = require('mongodb').MongoClient;

module.exports = (function() {
	var NALog = function(uri, options) {
		var self = this;
		self._client = uri;

		var _logCB = function(err, res) {
			if (err && self.options.verbose) console.log('Error: unable to save log');
			if(self.options.verbose) console.log('NALog:', JSON.stringify(res,null,' '))
		};

		self.options = _.extend({
			console: false,
			criteria: {
				gte: null,
				lte: null,
				equal: null
			},
			verbose: false,
			colName: 'logs'
		}, options || {});

		if (self.options.console === true) self.options.console = console.log;

		if (uri && typeof uri === 'object' && uri.constructor.name === 'Mongoose'){
			var Model = self._client.model(self.options.colName, { d: {}, c: Number, m: String });
			this._log = function(obj) { new Model(obj).save(_logCB); };

		} else if (uri && typeof uri === 'string')  {
			console.log(self._client.collection)
			this._log = function(obj) { self._client.collection(self.options.colName).insert(obj, _logCB); };
		} else {
			self.options.verbose && self.options.console.log('NAlog: Db connection empty')
			self._
		}
	};

	NALog.prototype.connect = function(cb) {
		var self = this;
		if (typeof self._client !== 'string') throw new Error('URI required');
		mongo.connect(self._client, function(err, db) {
			if (err) cb(err);
			self._client = db;
			cb && cb(null);
		});
	};

	NALog.prototype.log = function(code, msg, data, lvl) {
		var self = this;
		var lvl = (typeof lvl === 'number') ? lvl :
						(typeof data === 'number' && data) 
						|| (typeof msg === 'number' && msg)
						|| undefined
		var data = (typeof data === 'object' && data) 
						|| (typeof msg === 'object' && msg) 
						|| (typeof code === 'object' && code) 
						|| undefined;
		var msg = (typeof msg === 'string' && msg)
						|| (typeof code === 'string' && code)
						|| undefined;
		var code = (typeof code ==='number' && code)
						|| undefined;

		if (typeof lvl === 'number' && !this.matchesCriteria(lvl)) return false;

		var a ={};

		if(typeof code !== 'undefined') a.c = code
		if(typeof msg !== 'undefined') a.m = msg
		if(typeof data !== 'undefined') a.d = data

		self._log(a);

		if (self.options.console) a.toJSON && self.options.console(JSON.stringify(a)) || self.options.console(a);

		return true;
	};

	NALog.prototype.matchesCriteria = function(level) {
		var c = this.options.criteria;
		if (typeof level !== 'number') return false
		if (!(c.lte && c.gte && c.equal)) return true
		if (typeof level !== 'number') return true;
		if (c.lte && (level <= c.lte) || false) return true;
		if (c.gte && (level >= c.gte) || false) return true;

		return c.equal && (typeof _.find(c.equal, function(c) { return level === c; }) !== 'undefined') || false;
	};

	NALog.prototype.setCriteria = function(c) {
		if (typeof c !== 'object') return false;
		this.options.criteria = c;
	};

	NALog.prototype.error = function(code, message, level) {
		var self = this;
		var e = new Error(code, message);

		var eLog = (e.toJSON && e) || {
			stack: e.stack,
			message: message,
			code: code
		};

		self.log(eLog, level);
		
		return e;
	};

	return NALog;
})();