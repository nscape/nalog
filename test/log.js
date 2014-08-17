var Simplog = require('./../lib/simplog')
	, chai      = require('chai')
  , expect    = chai.expect
  , should = chai.should()
  , mongoose = require('mongoose')
  , config = require('./config')

	
	var simpl;

describe('simplog', function () {

  describe('constructor with mongoose', function () {
  	before(function(done){
  		mongoose.connect(config.URI);
  		mongoose.connection.on('error', function() { throw new Error('Unable to connect') });
			mongoose.connection.once('open', function callback () {
			  done()
			});
			simpl = new Simplog(mongoose)

		})
    it('should instantiate without errors', function (done) {
      simpl.should.be.a('object')
      done();
    })
  })
  describe('#matchesCriteria with defaults', function () {
    it('should pass checks', function (done) {
    	expect(simpl.matchesCriteria({})).to.be.true;
    	expect(simpl.matchesCriteria('test')).to.be.true;
    	expect(simpl.matchesCriteria(1)).to.be.true;
    	expect(simpl.matchesCriteria(0)).to.be.false;
    	expect(simpl.matchesCriteria(-1)).to.be.false;
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
			expect(simpl.matchesCriteria({})).to.be.true;
    	expect(simpl.matchesCriteria('test')).to.be.true;
    	expect(simpl.matchesCriteria(11)).to.be.true;
    	expect(simpl.matchesCriteria(9)).to.be.false;
    	expect(simpl.matchesCriteria(-10)).to.be.true;
    	expect(simpl.matchesCriteria(0)).to.be.true;
    	expect(simpl.matchesCriteria(5)).to.be.true;
    	done();
    })
  })
  describe('log', function () {
    it('should instantiate without errors', function (done) {
      expect(simpl.log(10,'works')).to.be.true;
      done();
    })
  })
  describe('error', function () {
    it('should instantiate without errors', function (done) {
      expect(simpl.error(10,'works')).to.be.an.instanceof(Error);
      done();
    })
  })
})