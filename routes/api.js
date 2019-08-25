/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;

module.exports = function(app) {
    app.route('/api/threads/:board').get(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json('Database error: ' + err);
            }
            db.collection(req.params.board).find({}, { delete_password: 0, reported: 0 }, { replies: { $size: 3, $sort: { created_on: -1 } } })
                .sort({ bumped_on: -1 }).limit(10).toArray((err, data) => {
                    if (err) {
                        res.json({ error: 'erro to get the threads' });
                    }
                    res.json(data);
                })
        })
    });
    app.route('/api/threads/:board').post(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json('Database error: ' + err);
            }
            const thread = {
                text: req.body.text,
                create_on: new Date(),
                bumped_on: new Date(),
                reported: false,
                delete_password: req.body.delete_password,
                replies: []
            }
            db.collection(req.params.board).insertOne(thread, (err, data) => {
                if (err) {
                    res.json({ error: 'Erro to save this project' });
                }
                res.json(thread);
            })
        })
    }); //5d62aa1a97efb5166c135015

    app.route('/api/threads/:board').put(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'databese erro :  ' + err });
            }
            db.collection(req.params.board).updateOne({ _id: ObjectId(req.body['thread_id']) }, { $set: { reported: true } }, (err, dataU) => {
                if (err) {
                    res.json({ error: 'could not update ' + req.body['thread_id'] });
                }
                res.json({ success: 'successfully updated' });
            })

        })
    });
    app.route('/api/threads/:board').delete(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'databese erro :  ' + err });
            }
            db.collection(req.params.board).remove({ _id: ObjectId(req.body['thread_id']), delete_password: req.body.delete_password }, (err, data) => {
                if (err) {
                    res.json({ error: 'incorrect password' });
                }
                res.json({ success: 'successfully deleted' });
            })
        })
    });

    app.route('/api/replies/:board').get(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json('Database error: ' + err);
            }
            db.collection(req.params.board).findOne({ _id: ObjectId(req.query['thread_id']) }, (err, data) => {
                if (err) {
                    res.json({ error: 'erro to get the threads' });
                }
                const replies = data.replies.map(replay => {
                    return ({ _id: repay._id, text: replay.text, created_on: replay.created_on })
                })
                res.json({
                    _id: data._id,
                    text: req.body.text,
                    create_on: new Date(),
                    bumped_on: new Date(),
                    replies: replies
                });
            })
        })
    });

    app.route('/api/replies/:board').post(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'databese erro :  ' + err });
            }
            db.collection(req.params.board).findOne(ObjectId(req.body['thread_id']), (err, data) => {
                if (err) {
                    res.json({ error: 'could not update ' + req.body['thread_id'] });
                }
                const newreplies = data.replies.push({
                    _id: ObjectId(),
                    text: req.body.text,
                    delete_password: req.body.delete_password,
                    created_on: new Date(),
                    reported: false
                })
                if (data) {
                    db.collection(req.params.board).updateOne({ _id: ObjectId(req.body['thread_id']) }, { $set: { bumped_on: new Date(), replies: newreplies } }, (err, dataU) => {
                        if (err) {
                            res.json({ Error: 'could not update ' + req.body['thread_id'] });
                        }
                        res.json({ success: 'successfully updated' });
                    })
                } else {
                    res.json({ error: 'thread not find' });
                }
            })
        })
    });
    app.route('/api/replies/:board').put(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'databese erro :  ' + err });
            }
            db.collection(req.params.board).findOne({ _id: ObjectId(req.query['thread_id']) }, (err, data) => {
                if (err) {
                    res.json({ error: 'could not update ' + req.body['thread_id'] });
                }
                const replies = data.replies.map(replay => {
                    if (req.body.reply_id === replay._id) {
                        return {...replay, reported: true }
                    } else {
                        return replay
                    }
                })
                db.collection(req.params.board).updateOne({ _id: ObjectId(req.body['thread_id']) }, { $set: { bumped_on: new Date(), replies: replies } }, (err, dataU) => {
                    if (err) {
                        res.json({ Error: 'could not update ' + req.body['thread_id'] });
                    }
                    res.json({ success: 'successfully delete' });
                })
            })
        })
    });
    app.route('/api/replies/:board').delete(function(req, res) {
        MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if (err) {
                res.json({ error: 'databese erro :  ' + err });
            }
            db.collection(req.params.board).findOne({ _id: ObjectId(req.query['thread_id']) }, (err, data) => {
                if (err) {
                    res.json({ error: 'could not update ' + req.body['thread_id'] });
                }
                const modify = false;
                const replies = data.replies.map(replay => {
                    if (req.body.reply_id === replay._id && req.body.delete_password === replay.delete_password) {
                        modify = true;
                        return null
                    } else {
                        return replay
                    }
                })
                if (modify) {
                    db.collection(req.params.board).updateOne({ _id: ObjectId(req.body['thread_id']) }, { $set: { bumped_on: new Date(), replies: newreplies } }, (err, dataU) => {
                        if (err) {
                            res.json({ Error: 'could not update ' + req.body['thread_id'] });
                        }
                        res.json({ success: 'successfully delete' });
                    })
                } else {
                    res.json({ error: 'incorrect password' });
                }
            })
        })
    });


};