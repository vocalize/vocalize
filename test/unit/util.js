process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var sinon = require('sinon');

var path = require('path');
var fs = require('fs');

var util = require('../../app/util');

describe('utils', function() {
  // describe('average', function() {
  //   it('should be a function', function() {
  //     expect(util.average).to.be.a('function');
  //   });

  //   it('should give an average', function() {
  //     var average = util.average([2, 4, 6]);
  //     expect(average).to.be.equal(4);
  //   });
  // });

  // describe('standardDeviation', function() {
  //   it('should be a function', function() {
  //     expect(util.standardDeviation).to.be.a('function');
  //   });

  //   it('should give a standard deviation', function() {
  //     var standardDeviation = util.standardDeviation([2,4,6]);
  //     expect(standardDeviation).to.be.equal(1.632993161855452);
  //   })
  // })
});