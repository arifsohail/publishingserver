'use strict';

var test = require('tape');
var request = require('supertest');
var app = require('../index');
var json = require('./config');

test('Create gatsby site', function (t) {
  request(app)
    .post('/api/create-gatsby-site')
    .send({site_name : "dharmeshv"})
    .expect('Content-Type', /json/)
    .expect(400)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.message, 'This site name is already exits', 'Site name already exits');
      t.same(res.body.status, false, 'Site is not created');
      t.end();
    });
});

test('Create gatsby site', function (t) {
  request(app)
    .post('/api/create-gatsby-site')
    .expect('Content-Type', /json/)
    .expect(400)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, false, 'Site name is required');
      t.end();
    });
});


test('Create gatsby site', function (t) {
  request(app)
    .post('/api/create-gatsby-site')
    .send({site_name : "dharmeshv"})
    .expect('Content-Type', /json/)
    .expect(400)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.message, 'This site name is already exits', 'Site name already exits');
      t.same(res.body.status, false, 'Site is not created');
      t.end();
    });
});


test('Create gatsby site', function (t) {
  request(app)
    .post('/api/create-gatsby-site')
    .send({site_name : "dharmeshvasani"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, true, 'Site created successfully.');
      t.end();
    });
});

test('Create gatsby site', function (t) {
  request(app)
    .post('/api/build-gatsby-site')
    .expect('Content-Type', /json/)
    .expect(400)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, false, 'site name is required');
      t.end();
    });
});

test('Create gatsby site', function (t) {
  request(app)
    .post('/api/build-gatsby-site')
    .send({site_name : "dharmesh   66 vasani"})
    .expect('Content-Type', /json/)
    .expect(400)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, false, 'Site name is invalid. Space and special charactors are not allowed in Site name');
      t.end();
    });
});

test('Build gatsby site', function (t) {
  request(app)
    .post('/api/build-gatsby-site')
    .send({site_name : "dharmeshvasani"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, true, 'Site Build done successfully.');
      t.end();
    });
});

test('Publish gatsby site', function (t) {
  request(app)
    .post('/api/publish-gatsby-site')
    .send({site_name : "dharmeshvasani"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, true, 'Site publish is publish on AWS s3 Bucket');
      t.end();
    });
});


test('Publish gatsby site', function (t) {
  request(app)
    .post('/api/publish-gatsby-site')
    .send({site_name : "dharmeshvasani"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.error(err, 'No error');
      t.same(res.body.status, true, 'Site publish is publish on AWS s3 Bucket');
      t.end();
    });
});

test('Publish gatsby site', function (t) {
  request(app)
    .post('/api/publish-gatsby-pages')
    .send(json.getJson())
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
        console.log(res.body)
      t.error(err, 'No error');
      t.same(res.body.status, true, 'Publish gatsby pages');
      t.end();
    });
});