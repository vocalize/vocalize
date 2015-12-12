process.env.NODE_ENV = 'test';

var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server');

describe('Routes', function() {
  it('should load the index', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
});