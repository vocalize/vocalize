var Word = require('../models/word');
var util = require('../util');

/**
 * Gets one word based on the passed query string
 * @param  {[object]} req [includes query string]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
exports.getWord = function(req, res) {

  Word.findOne(req.query)
    .then(function(word) {
      if (!word) {
        res.status(404).send('Word not found');
      } else {
        res.status(200).send(word);
      }
    })
    .catch(function(err) {
      res.status(500).send('Error finding word');
    });
};

/**
 * Will get the next word in the list by word_index
 * If no words are found, will run _findRootWord 
 * to restart the word list at the lowest index
 * Searches by all queries in the get query string
 * ie GET /api/words/index/?word_index=0&language=english&gender=male
 * @param  {[object]} req [include query string to search by]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
exports.getWordByNextIndex = function(req, res) {

  if (req.query.word_index) {
    req.query.word_index = {
      $gt: req.query.word_index
    };

    Word.find(req.query).sort({
        word_index: 1
      })
      .limit(1)
      .then(function(word) {
        if (!word.length) {
          _findRootWord(req, res);
        } else {
          res.status(200).send(word[0]);
        }
      })
      .catch(function(err) {
        res.status(500).send('Error finding word');
      });
  } else {
    res.status(400).send('Word Index Not Included');
  }
};

/**
 * Returns the word with the lowest word_index
 * matching all other parameters.
 * @param  {[object]} req [include query string to search by]
 * @param  {[object]} res [response]
 * @return {[object]}     [word object from db]
 */
var _findRootWord = function(req, res) {

  req.query.word_index = {
    $gte: 0
  };

  Word.find(req.query).sort({
      word_index: 1
    })
    .limit(1)
    .then(function(word) {
      if (!word.length) {
        res.status(404).send('No Words Found');
      } else {
        res.status(200).send(word[0]);
      }
    }).catch(function(err) {
      res.status(500).send('Error finding word');
    });
};
