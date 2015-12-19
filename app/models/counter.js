var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
	_id: {type: String, require: true},
	language: {type: String, require: true},
	accent: {type: String, require: true},
	gender: {type: String, require: true},
	seq: {type: Number, default: 0}
});

CounterSchema.index({
  word: 1,
  language: 1,
  gender: 1,
  accent: 1
}, {
  unique: true
});

module.exports = mongoose.model('Counter', CounterSchema);