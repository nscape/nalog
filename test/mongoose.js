var NALog = require('./../lib/nalog')
	, chai      = require('chai')
  , expect    = chai.expect
  , should = chai.should()
  , mongoose = require('mongoose')
  , config = require('./config')

	
var simpl;

describe('NALog with mongoose', function () {

  describe('constructor', function () {
  	before(function(done){
  		mongoose.connect(config.URI);
  		mongoose.connection.on('error', function() { throw new Error('Unable to connect') });
			mongoose.connection.once('open', function callback () {
			  done()
			});
			simpl = new NALog(mongoose, {verbose:false})

		})
    it('should instantiate without errors', function (done) {
      simpl.should.be.a('object')
      done();
    })
  })
  describe('#matchesCriteria with defaults', function () {
    it('should pass checks', function (done) {
      expect(simpl.matchesCriteria(1)).to.be.true;
      expect(simpl.matchesCriteria(0)).to.be.true;
      expect(simpl.matchesCriteria(-1)).to.be.true;
      done();
    })
  })
  describe('#matchesCriteria #2', function () {
    it('should pass checks', function (done) {
      var set = simpl.setCriteria({
        gte: 10,
        lte: -5,
        equal: [0, 5]
      })
      expect(simpl.matchesCriteria(11)).to.be.true;
      expect(simpl.matchesCriteria(9)).to.be.false;
      expect(simpl.matchesCriteria(-10)).to.be.true;
      expect(simpl.matchesCriteria(0)).to.be.true;
      expect(simpl.matchesCriteria(5)).to.be.true;
      done();
    })
  })
  describe('log', function () {
    it('should log without errors', function (done) {
      expect(simpl.log(1,'works')).to.be.true;
      expect(simpl.log(2,{})).to.be.true;
      done();
    })

    it('should log with level without errors', function (done) {
      expect(simpl.log(3,'works', -1)).to.be.false;
      expect(simpl.log(4,'works', -999)).to.be.true;
      expect(simpl.log(5,'works', 6)).to.be.false;
      expect(simpl.log(6,'works', 10)).to.be.true;
      expect(simpl.log(6,'works', 0)).to.be.true;

      expect(simpl.log(7,'works', {}, 99)).to.be.true;
      expect(simpl.log(7,'works', {}, 1)).to.be.false
      expect(simpl.log('works', {}, 99)).to.be.true;
      expect(simpl.log('works', {}, 1)).to.be.false
      expect(simpl.log('works', {})).to.be.true;
      expect(simpl.log({})).to.be.true;
      expect(simpl.log({},1)).to.be.false;
      expect(simpl.log('works')).to.be.true;
      expect(simpl.log(8,{}, 99)).to.be.true;
      done();
    })
  })
  describe('error', function () {
    it('should create an error object without errors', function (done) {
      expect(simpl.error(10,'works')).to.be.an.instanceof(Error);
      done();
    })
    it('should create an error object with level without errors', function (done) {
      expect(simpl.error(10,'works',5)).to.be.an.instanceof(Error);
      done();
    })
  })
})