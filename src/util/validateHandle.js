const Profile = require('../models/profile');

const validateHandle = async handle => {
  // Check to see if handle is already in use.
  const profile = await Profile.findOne({ handle }).exec();
  if (profile) {
    throw new Error('Handle already in use.');
  }
};

module.exports = validateHandle;
