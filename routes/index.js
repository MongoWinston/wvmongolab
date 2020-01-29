//Basic Express Set up
var express = require('express');
var router = express.Router();

// requiring assert for basic error checking
// and dotenv for external config of mongo connection (in /.env file)
const assert = require('assert');
require('dotenv').config();

//this is used to filter on ObjectId
const {ObjectId} = require('mongodb');

// formatting a connection string based on username password and connection string in atlas
let connString = process.env.ATLAS_CONN_STRING;
const usrnm = process.env.ATLAS_USERNAME;
const psw = process.env.ATLAS_PASSWORD
connString = connString.slice(connString.indexOf("@"),connString.length);

//making a mongo connection handle and setting up database name
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://' + usrnm + ':' + psw + connString
const client = new MongoClient(url);
const dbName = 'sample_mflix';

/*
  ~~~ Mongo Functions for finding movies and updating them to be favorites ~~~
    these are used in the 3 routes
*/

const findMovies = function(db, filter, callback) {
  // Get the documents collection
  const collection = db.collection('movies');
  // Find movies based on filter which is a js object
  collection.find(filter).limit(50).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
}

const favoriteMovie = function(db, filter, callback){
  // Get the documents collection
  const collection = db.collection('movies');
  //the first argument is the match condition for an update
  //the second argument is the update. In this case we are setting a new KV pair: isFavorite:true
  collection.updateOne({_id:ObjectId(filter)},{$set: {isFavorite:true}},function(err,r){
    assert.equal(err, null);
    assert.equal(1, r.matchedCount);
    callback(r);
  });
}

// ~~~ Setting up 3 routes  ~~~ //

router.get('/', function(req, res, next) {

  client.connect(function(err) {

    assert.equal(null, err);
    const db = client.db(dbName);
    findMovies(db, {}, function(docs) {
      res.render('index', { title: 'Welcome To Mongolab',data:docs});
    });

  });

});

router.get('/favorite', function(req, res, next) {

  client.connect(function(err) {

    assert.equal(null, err);
    const db = client.db(dbName);
    findMovies(db, {isFavorite:true}, function(docs) {
      res.render('index', { title: 'Favorite Movies',data:docs});
    });

  });

});

router.get('/favorite/:movieID',function(req, res, next) {

  client.connect(function(err) {

    assert.equal(null, err);
    const db = client.db(dbName);
    favoriteMovie(db, req.params.movieID, function(docs) {
      console.log('movie favorited: '  + req.params.movieID);
      res.redirect('/');
    });

  });

})


module.exports = router;
