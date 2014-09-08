var nalog = require('./../lib/nalog')
  , chai      = require('chai')
  , expect    = chai.expect
  , should = chai.should()
  , config = require('./config')

  
var simpl;

describe('NALog without db', function () {
  describe('constructor', function () {
    before(function(done){
      simpl = new nalog({verbose: false});
      done();
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
  describe('log', function () {
    it('should log without errors', function (done) {
      expect(simpl.log(1,'works')).to.be.true;
      expect(simpl.log(2,{})).to.be.true;
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