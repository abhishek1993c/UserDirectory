const mongoose = require('mongoose');
const PowerSchema = new mongoose.Schema({
  powerName: {
    type: String,
    unique: true,
  },
  energy: {
    type: String,
  },
  cost: {
    type: String,
  },
});

module.exports = Power = mongoose.model('power', PowerSchema);
