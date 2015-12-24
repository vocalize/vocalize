var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var aws = require('../aws/aws');
var Promise = require('bluebird');
var Counter = require('./counter');

var wordSchema = new Schema({
  word_index: {
    type: Number
  },
  word: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  accent: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  scores: [Number],
  acceptable_score: Number,
  level: String,
  s3: {
    Bucket: {
      type: String,
      required: true
    },
    Key: {
      type: String,
      required: true,
      unique: true
    }
  },
  created_at: {
    type: Date
  }
});

wordSchema.pre('save', function(next) {

  // Initializes the created_at date
  if (!this.created_at) {
    this.created_at = new Date();
  }

  this.s3.Key = 'public/' + this._id + '-' + this.s3.Key;

  Counter.findOneAndUpdate({
    'language': this.language,
    'accent': this.accent,
    'gender': this.gender
  }, {
    $inc: {
      seq: 1
    }
  }, {
    upsert: true
  }, function(err, counter) {

    if (err) {
      return next(err);
    }
    if (!counter) {
      this.word_index = 0;
    } else {
      this.word_index = counter.seq;
    }
    next();

  }.bind(this));
});

wordSchema.methods.downloadAudioFile = function(filepath) {
  var that = this;
  return new Promise(function(fulfill, reject) {
    aws.downloadFile(filepath, that).then(function() {
      fulfill(filepath);
    });
  });
};

// Ensure that words are unique to language, gender, and accent.
wordSchema.index({
  word: 1,
  language: 1,
  gender: 1,
  accent: 1
}, {
  unique: true
});

// compile schema into a Model
module.exports = mongoose.model('Word', wordSchema);
