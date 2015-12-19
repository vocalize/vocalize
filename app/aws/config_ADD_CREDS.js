var bucket, db;

if (process.env.NODE_ENV === 'test') {
  bucket = 'hr10-vocalize-testing';
  db = 'vocalizetest';
} else if (process.env.NODE_ENV === 'production') {
	bucket = 'hr10-vocalize-production';
	db = 'vocalize';
} else {
  bucket = 'hr10-vocalize-development';
  db = 'vocalize';
}

module.exports = {
	mongoURI : process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/' + db,
	key : ADD_KEY,
	secret: ADD_SECRET,
	bucket: bucket
};

