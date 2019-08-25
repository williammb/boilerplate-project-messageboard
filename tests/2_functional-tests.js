/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('API ROUTING FOR /api/threads/:board', function() {

        suite('POST', function() {
            test('POST /api/threads/:board', done => {
                chai.request(server)
                    .post('/api/threads/testboard')
                    .send({ text: 'test text', delete_password: 'testpasswd' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        _id1 = res.body._id;
                        done();
                    })
            })
        });

        suite('GET', function() {
            test('GET /api/threads/:board', done => {
                chai.request(server)
                    .get('/api/threads/testboard')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.notProperty(res.body[0], 'delete_password');
                        assert.notProperty(res.body[0], 'reported');
                        done();
                    })
            })
        });

        suite('PUT', function() {
            test('PUT /api/threads/:board', done => {
                chai.request(server)
                    .put('/api/threads/testboard')
                    .send({ thread_id: _id1, reported: true })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'success');
                        done();
                    })
            })
        });

        suite('DELETE', function() {
            test('DELETE /api/threads/:board', done => {
                chai.request(server)
                    .delete('/api/threads/testboard')
                    .send({ thread_id: _id1, delete_password: 'testpasswd' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'success');
                        done();
                    });
            });
        });

    });

    suite('API ROUTING FOR /api/replies/:board', function() {

        suite('POST', function() {
            test('POST /api/threads/:board', done => {
                chai.request(server)
                    .post('/api/replies/testboard')
                    .send({ thread_id: _id1, delete_password: 'testpasswd' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        done();
                    });
            });
        });

        suite('GET', function() {
            test('GET /api/threads/:board', done => {
                chai.request(server)
                    .post('/api/replies/testboard')
                    .send({ thread_id: _id1, delete_password: 'testpasswd' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        done();
                    });
            });
        });

        suite('PUT', function() {
            test('PUT /api/threads/:board', done => {
                chai.request(server)
                    .put('/api/replies/testboard')
                    .send({ thread_id: _id1, delete_password: 'testpasswd' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'success');
                        done();
                    });
            });
        });

        suite('DELETE', function() {
            test('DELETE /api/threads/:board', done => {
                chai.request(server)
                    .delete('/api/replies/testboard')
                    .send({ thread_id: _id1, delete_password: 'testpasswd' })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isObject(res.body);
                        assert.property(res.body, 'success');
                        done();
                    });
            });
        });

    });

});