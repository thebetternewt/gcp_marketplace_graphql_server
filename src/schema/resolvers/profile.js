const { Profile, User, Skill } = require('../../models');
const verifyUser = require('../../util/verifyUser');
const validateHandle = require('../../util/validateHandle');

module.exports = {
  Profile: {
    user: parent => User.findById(parent.user),
    skills: parent => Skill.where({ _id: { $in: parent.skills } }),
  },

  Query: {
    current: async (parent, args, { user }) => {
      verifyUser({ user });

      // user is authenticated
      return Profile.findOne({ user: user.id }).exec();
    },
    profile: async (parent, { handle }) =>
      Profile.findOne({ handle })
        // .populate('user', ['name', 'avatar'])
        .exec(),
    profiles: async (parent, { limit }) =>
      Profile.find()
        // .populate('user', ['name', 'avatar'])
        .limit(limit || 10)
        .exec(),
  },

  Mutation: {
    createProfile: async (parent, args, { user }) => {
      verifyUser({ user });

      // Check to see if profile already exists for user.
      const profile = await Profile.findOne({ user: user.id }).exec();
      if (profile) {
        throw new Error('User already has a profile.');
      }

      validateHandle(args.handle);

      const newProfile = new Profile({
        user: user.id,
        ...args,
      });

      return newProfile.save();
    },
    updateProfile: async (parent, args, { user }) => {
      const { id, ...updatedProperties } = args;
      const profile = await Profile.findById(id).exec();

      console.log(updatedProperties);

      // Restrict to logged in user
      // Restrict to profile owner or admin user
      verifyUser({
        user,
        testUserId: profile.user,
        current: true,
        admin: true,
      });

      profile.set({ ...updatedProperties });
      const updatedProfile = await profile.save();

      if (!updatedProfile) {
        throw new Error('Profile not found');
      }

      return updatedProfile;
    },
    deleteProfile: async (parent, { id }, { user }) => {
      const profile = await Profile.findById(id).exec();

      // Restrict to logged in user
      // Restrict to profile owner or admin user
      verifyUser({
        user,
        testUserId: profile.user,
        current: true,
        admin: true,
      });

      const removedProfile = await Profile.findByIdAndDelete(id).exec();

      if (!removedProfile) {
        throw new Error('Profile not found.');
      }

      return removedProfile.id;
    },
  },
};
