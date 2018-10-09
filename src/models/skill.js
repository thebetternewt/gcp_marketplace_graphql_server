const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model(
  'Skill',
  new Schema({
    name: {
      type: String,
      max: 30,
      required: true,
      unique: true,
    },
  })
);
