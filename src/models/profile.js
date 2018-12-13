const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model(
  'Profile',
  new Schema(
    {
      // user: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'User',
      //   required: true,
      // },
      handle: {
        type: String,
        required: true,
        min: 3,
        max: 40,
      },
      bio: {
        type: String,
        required: true,
        max: 500,
      },
      skills: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
      },
      website: {
        type: String,
      },
      location: {
        type: String,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
        default: null,
      },
      socialLinks: {
        type: [
          {
            name: {
              type: String,
              required: true,
              max: 50,
            },
            url: { type: String, required: true },
          },
        ],
      },
    },
    {
      timestamps: true,
    }
  )
);
