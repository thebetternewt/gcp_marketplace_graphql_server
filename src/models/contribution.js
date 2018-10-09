const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model(
  'Contribution',
  new Schema(
    {
      title: {
        type: String,
        max: 100,
        required: true,
      },
      description: {
        type: String,
        max: 300,
      },
      link: {
        type: String,
      },
      photoUrl: {
        type: String,
      },
      gcp: {
        type: Boolean,
        required: true,
        default: false,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      taggedUsers: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    },
    {
      timestamps: true,
    }
  )
);
