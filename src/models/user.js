const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model(
  'User',
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);
