'use strict';

var _ = require('lodash')
  , Promise = require('bluebird')
  , mongo = require('mongodb').MongoClient;

module.exports = (function() {
  var nalog = function(options) {
    var self = this;
    self._logCB = function(err, res) {
      if (err && self.options.verbose) console.log('Error: unable to save log');
      if (self.options.verbose) console.log('NALog:', JSON.stringify(res,null,' '));
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

    //default logging function
    self._log = function(o){ 
      self.options.console && self.options.console(o)
    }
  };

  nalog.prototype.connect = function(uri) {
    var self = this;
    if (typeof uri !== 'string') throw new Error('URI required');

    return new Promise(function(resolve, reject){
      mongo.connect(uri, function(err, db) {
        if (err) return reject(err);

        self._client = db;
        self._log = function(obj) { 
          self._client.collection(self.options.colName).insert(obj, self._logCB); 
        };
        
        resolve();
      });
    });
  };

  nalog.prototype.use = function(o) {
    var self = this;
    return new Promise(function(resolve, reject){
      if (o && typeof o === 'object' && o.constructor.name === 'Mongoose') {
        self._client = o;
        var Model = self._client.model(self.options.colName, { d: {}, c: Number, m: String });
        self._log = function(obj) { 
          new Model(obj).save(self._logCB); 
        };
        resolve();
      } else {
        throw new Error('Unknown object');
      }
    });
  };

  nalog.prototype.log = function(code, msg, data, lvl) {
    var self = this;
    lvl =  (typeof lvl === 'number') ? lvl 
        : (typeof data === 'number' && data) 
        || (typeof msg === 'number' && msg)
        || undefined;
    data = (typeof data === 'object' && data) 
        || (typeof msg === 'object' && msg) 
        || (typeof code === 'object' && code) 
        || undefined;
    msg =  (typeof msg === 'string' && msg)
        || (typeof code === 'string' && code)
        || undefined;
    code = (typeof code ==='number') ? code
        : undefined;

    if (typeof lvl === 'number' && !this.matchesCriteria(lvl)) return false;

    var a = {};

    if(typeof code !== 'undefined') a.c = code;
    if(typeof msg !== 'undefined') a.m = msg;
    if(typeof data !== 'undefined') a.d = data;

    self._log(a);

    if (self.options.console) a.toJSON && self.options.console(JSON.stringify(a)) || self.options.console(a);

    return true;
  };

  nalog.prototype.matchesCriteria = function(level) {
    var c = this.options.criteria;
    if (typeof level !== 'number') return false;
    if (!(c.lte && c.gte && c.equal)) return true;
    if (typeof level !== 'number') return true;
    if (c.lte && (level <= c.lte) || false) return true;
    if (c.gte && (level >= c.gte) || false) return true;

    return c.equal && (typeof _.find(c.equal, function(c) { return level === c; }) !== 'undefined') || false;
  };

  nalog.prototype.setCriteria = function(c) {
    if (typeof c !== 'object') return false;
    this.options.criteria = c;
  };

  nalog.prototype.error = function(code, message, level) {
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

  return nalog;
})();
